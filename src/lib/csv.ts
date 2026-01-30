// FILE: src/lib/csv.ts
import Papa from "papaparse";

type Row = Record<string, unknown>;

function normKey(s: string) {
  return String(s).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function findKeyLike(sampleRow: Row, needles: string[]) {
  const keys = Object.keys(sampleRow || {});
  const ns = needles.map(normKey);
  return (
    keys.find((k) => ns.some((n) => normKey(k) === n || normKey(k).includes(n))) || null
  );
}

function isBlank(v: unknown) {
  if (v === null || v === undefined) return true;
  const s = String(v).trim();
  return s === "";
}

/**
 * Loads a CSV and (optionally) tags rows with { tab }.
 * Also forward-fills Conference-like columns so merged/blank cells from Sheets become usable.
 */
export async function loadCoachRows(csvUrl: string, tab?: string) {
  if (!csvUrl?.trim()) throw new Error("Missing CSV URL");

  const res = await fetch(csvUrl, { cache: "no-store" });
  if (!res.ok) throw new Error(`CSV fetch failed: ${res.status} ${res.statusText}`);

  const text = await res.text();

  const parsed = Papa.parse<Row>(text, {
    header: true,
    skipEmptyLines: true,
  });

  const rows = (parsed.data || []).filter(Boolean) as Row[];

  // Detect a "Conference" column (could be "Conference", "Conf", etc.)
  const sample = rows[0] || {};
  const confKey =
    findKeyLike(sample, ["conference"]) ||
    findKeyLike(sample, ["conf"]) ||
    findKeyLike(sample, ["league"]);

  // Forward-fill conference values (fixes merged cells / blanks in exports)
  if (confKey) {
    let last = "";
    for (const r of rows) {
      const v = r[confKey];
      if (!isBlank(v)) last = String(v).trim();
      else if (last) r[confKey] = last;
    }
  }

  const t = tab?.trim();
  return rows.map((r) => (t ? { ...r, tab: t } : { ...r }));
}