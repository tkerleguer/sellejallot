/**
 * Sync the bike compatibility database from the Google Sheet (xlsx export).
 *
 * Default behaviour: fetches the latest xlsx from the public Drive URL,
 * caches it locally for offline dev, then regenerates `src/data/bikes.ts`.
 *
 * Run via: `npm run sync`. Used at Vercel build time and by GitHub Actions.
 *
 * Env vars:
 *   SHEET_ID    Override Drive file ID (default: hardcoded)
 *   SYNC_FETCH  Set to "false" to skip Drive fetch and use the cached xlsx
 *               (useful for local dev when offline)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import * as XLSX from "xlsx";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const XLSX_PATH = resolve(ROOT, "scripts/data/selle-jallot-database.xlsx");
const OUT_PATH = resolve(ROOT, "src/data/bikes.ts");

const SHEET_ID = process.env.SHEET_ID ?? "1MOIRNVbH1W0zTa0lVpDC3uVpyE48-J-w";
const FETCH_FRESH = process.env.SYNC_FETCH !== "false";

let xlsxBuffer: Buffer;
if (FETCH_FRESH) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=xlsx`;
  console.log(`↓ Fetching xlsx from Drive…`);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    xlsxBuffer = Buffer.from(await res.arrayBuffer());
    mkdirSync(dirname(XLSX_PATH), { recursive: true });
    writeFileSync(XLSX_PATH, xlsxBuffer);
    console.log(
      `  ✓ Got ${xlsxBuffer.length} bytes, cached at ${XLSX_PATH}`,
    );
  } catch (err) {
    if (existsSync(XLSX_PATH)) {
      console.warn(
        `  ⚠ Drive fetch failed (${(err as Error).message}); using cached xlsx`,
      );
      xlsxBuffer = readFileSync(XLSX_PATH);
    } else {
      console.error(
        `  ✗ Drive fetch failed and no cached xlsx at ${XLSX_PATH}`,
      );
      throw err;
    }
  }
} else if (existsSync(XLSX_PATH)) {
  console.log(`Using cached xlsx (SYNC_FETCH=false)`);
  xlsxBuffer = readFileSync(XLSX_PATH);
} else {
  console.error(`Missing xlsx at ${XLSX_PATH} and SYNC_FETCH=false`);
  process.exit(1);
}

type Status = "compatible" | "check" | "incompatible";

interface Model {
  diameter: number;
  type: string;
  status: Status;
  note?: string;
}

interface CompatibleBrand {
  name: string;
  flag: "attention_modele" | null;
  models: Record<string, Model>;
}

interface IncompatibleBrand {
  name: string;
  reason: string;
  scope: "all" | string[];
}

const wb = XLSX.read(xlsxBuffer, { type: "buffer" });

const compatRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
  wb.Sheets[wb.SheetNames.find((n) => n.includes("Compatibles"))!],
  { defval: "", raw: false, range: 1 },
);

const incompatRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
  wb.Sheets[wb.SheetNames.find((n) => n.includes("Incompatibles"))!],
  { defval: "", raw: false, range: 1 },
);

const norm = (v: unknown) => String(v ?? "").trim();

const parseStatus = (v: string): Status => {
  if (v.includes("Incompatible")) return "incompatible";
  if (v.includes("Vérifier") || v.includes("erifier")) return "check";
  return "compatible";
};

const compatibleMap = new Map<string, CompatibleBrand>();

for (const row of compatRows) {
  const brand = norm(row["Marque"]);
  const model = norm(row["Modèle"] ?? row["Modele"] ?? row["Model"]);
  const diamRaw = norm(row["Diamètre (mm)"] ?? row["Diametre (mm)"]);
  if (!brand || !model || !diamRaw) continue;
  const diameter = parseFloat(diamRaw.replace(",", "."));
  if (Number.isNaN(diameter)) continue;

  const type = norm(row["Type"]);
  const statusRaw = norm(row["Statut"]);
  const status = parseStatus(statusRaw);
  const flag = norm(row["Flag"]).includes("attention")
    ? "attention_modele"
    : null;
  const note = norm(row["Note"]) || undefined;

  let entry = compatibleMap.get(brand);
  if (!entry) {
    entry = { name: brand, flag, models: {} };
    compatibleMap.set(brand, entry);
  }
  if (flag && !entry.flag) entry.flag = flag;
  entry.models[model] = { diameter, type, status, ...(note ? { note } : {}) };
}

const incompatibleBrands: IncompatibleBrand[] = [];
for (const row of incompatRows) {
  const brand = norm(row["Marque"]);
  const models = norm(row["Modèles concernés"] ?? row["Modeles concernes"]);
  const reason = norm(row["Raison d'incompatibilité"] ?? row["Raison"]);
  if (!brand || !reason) continue;
  if (
    brand.startsWith("↓") ||
    brand.startsWith("Decathlon") ||
    brand.startsWith("Elops") ||
    brand.startsWith("O2feel") ||
    brand.startsWith("Rockrider")
  ) {
    // Subsection: "models inside compatible brands". Skip — already represented
    // in the compatible sheet with `incompatible` status on the model.
    continue;
  }
  const scope: "all" | string[] =
    models.toLowerCase() === "tous"
      ? "all"
      : models.split(",").map((m) => m.trim()).filter(Boolean);
  incompatibleBrands.push({ name: brand, reason, scope });
}

const compatibleBrands = [...compatibleMap.values()].sort((a, b) =>
  a.name.localeCompare(b.name, "fr", { sensitivity: "base" }),
);

const allDiameters = new Set<number>();
for (const b of compatibleBrands)
  for (const m of Object.values(b.models)) allDiameters.add(m.diameter);
const diametersSupported = [27.2, 30.9, 31.6, 34.0];

const allTypes = new Set<string>();
for (const b of compatibleBrands)
  for (const m of Object.values(b.models)) if (m.type) allTypes.add(m.type);

const totalModels = compatibleBrands.reduce(
  (sum, b) => sum + Object.keys(b.models).length,
  0,
);

// Stable hash of the data only — independent of timestamps.
// Used to skip writes (and avoid noisy commits) when nothing changed.
const dataPayload = JSON.stringify({
  brands: compatibleBrands,
  incompatibleBrands,
});
const dataHash = createHash("sha256")
  .update(dataPayload)
  .digest("hex")
  .slice(0, 16);

if (existsSync(OUT_PATH)) {
  const previous = readFileSync(OUT_PATH, "utf8");
  const m = previous.match(/Data hash: ([0-9a-f]{16})/);
  if (m && m[1] === dataHash) {
    console.log(
      `↻ Database unchanged (hash ${dataHash}) — no write, no commit.`,
    );
    process.exit(0);
  }
}

const out = `// Auto-generated by scripts/sync-sheet.ts — DO NOT EDIT BY HAND.
// Source: Google Sheet "selle-jallot-database.xlsx"
// Data hash: ${dataHash}
// ${compatibleBrands.length} brands · ${totalModels} models · ${incompatibleBrands.length} blanket-incompatible brands

export type CompatibilityStatus = "compatible" | "check" | "incompatible";

export interface BikeModel {
  diameter: number;
  type: string;
  status: CompatibilityStatus;
  note?: string;
}

export interface CompatibleBrand {
  name: string;
  flag: "attention_modele" | null;
  models: Record<string, BikeModel>;
}

export interface IncompatibleBrand {
  name: string;
  reason: string;
  scope: "all" | string[];
}

export interface BikesDatabase {
  meta: {
    updated: string;
    diametersSupported: number[];
    types: string[];
    counts: { brands: number; models: number; incompatibleBrands: number };
  };
  brands: CompatibleBrand[];
  incompatibleBrands: IncompatibleBrand[];
}

export const database: BikesDatabase = ${JSON.stringify(
  {
    meta: {
      updated: new Date().toISOString().slice(0, 10),
      diametersSupported,
      types: [...allTypes].sort(),
      counts: {
        brands: compatibleBrands.length,
        models: totalModels,
        incompatibleBrands: incompatibleBrands.length,
      },
    },
    brands: compatibleBrands,
    incompatibleBrands,
  },
  null,
  2,
)};

export default database;
`;

writeFileSync(OUT_PATH, out);
console.log(
  `✅ Wrote ${OUT_PATH}\n   ${compatibleBrands.length} brands · ${totalModels} models · ${incompatibleBrands.length} fully-incompatible brands\n   Diameters in DB: ${[...allDiameters].sort((a, b) => a - b).join(", ")} mm`,
);
