import { readFileSync } from "node:fs";
import * as XLSX from "xlsx";

const wb = XLSX.read(
  readFileSync("scripts/data/selle-jallot-database.xlsx"),
  { type: "buffer" },
);
console.log("Sheets:", wb.SheetNames);
for (const name of wb.SheetNames) {
  const ws = wb.Sheets[name];
  const range = XLSX.utils.decode_range(ws["!ref"]);
  console.log(`\n--- ${name} (${range.e.r + 1} rows × ${range.e.c + 1} cols) ---`);
  const rows = XLSX.utils.sheet_to_json(ws, {
    header: 1,
    defval: "",
    raw: false,
  });
  rows.slice(0, 4).forEach((r, i) => console.log(`  row ${i}:`, r));
}
