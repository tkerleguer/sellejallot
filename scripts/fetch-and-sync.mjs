/**
 * One-shot script: decode the base64 xlsx blob saved at scripts/data/drive-blob.json
 * (produced by the Drive MCP `download_file_content` call) and write it as a
 * binary xlsx ready for sync-sheet.ts to consume.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const BLOB_JSON = resolve(ROOT, "scripts/data/drive-blob.json");
const XLSX_OUT = resolve(ROOT, "scripts/data/selle-jallot-database.xlsx");

mkdirSync(dirname(XLSX_OUT), { recursive: true });

const json = JSON.parse(readFileSync(BLOB_JSON, "utf8"));
const base64 = json.content?.[0]?.embeddedResource?.contents?.blob;
if (!base64) {
  console.error("No blob found in drive-blob.json");
  process.exit(1);
}
writeFileSync(XLSX_OUT, Buffer.from(base64, "base64"));
console.log(`✅ Wrote ${XLSX_OUT} (${(Buffer.from(base64, "base64").length / 1024).toFixed(1)} KB)`);
