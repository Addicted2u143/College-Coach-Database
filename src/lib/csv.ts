// src/lib/csv.ts
type RowObj = Record<string, string>;

export async function loadCsv(csvUrl: string): Promise<RowObj[]> {
  const res = await fetch(csvUrl, { cache: "no-store" });
  if (!res.ok) throw new Error(`CSV fetch failed: ${res.status}`);
  const text = await res.text();
  const { headers, rows } = parseCsv(text);

  const keys = headers.map((h) => normalizeHeader(h));
  return rows.map((r) => {
    const obj: RowObj = {};
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i] || `col_${i + 1}`;
      obj[k] = (r[i] ?? "").trim();
    }
    return obj;
  });
}

/**
 * Backward-compatible exports (in case any older file still imports these names)
 * If your project references loadCoachRows somewhere, it will still work.
 */
export const loadCoachRows = loadCsv;
// Some older versions used loadCoachRows(csvUrl, tab). If that exists in your code,
// this wrapper preserves that signature too.
export async function loadCoachRowsForTab(csvUrl: string, tab: string): Promise<RowObj[]> {
  const rows = await loadCsv(csvUrl);
  return rows.map((r) => ({ ...r, tab }));
}

function normalizeHeader(h: string) {
  // Keep original-ish headers but make them safe object keys
  // e.g. "Men’s Basketball" -> "Mens Basketball"
  return String(h || "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[’']/g, "")
    .replace(/[^a-zA-Z0-9 _-]/g, "")
    .trim();
}

/**
 * Minimal CSV parser (handles quotes + commas + newlines)
 */
function parseCsv(input: string): { headers: string[]; rows: string[][] } {
  const text = input.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (c === '"' && inQuotes && next === '"') {
      field += '"';
      i++;
      continue;
    }

    if (c === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (!inQuotes && c === ",") {
      row.push(field);
      field = "";
      continue;
    }

    if (!inQuotes && c === "\n") {
      row.push(field);
      field = "";
      if (row.length > 1 || (row[0] ?? "").trim() !== "") rows.push(row);
      row = [];
      continue;
    }

    field += c;
  }

  row.push(field);
  if (row.length > 1 || (row[0] ?? "").trim() !== "") rows.push(row);

  const headers = (rows.shift() || []).map((h) => String(h ?? "").trim());
  return { headers, rows };
}