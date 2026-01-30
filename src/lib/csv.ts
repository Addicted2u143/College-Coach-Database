// FILE: src/lib/csv.ts
import Papa from "papaparse";

export async function loadCoachRows(csvUrl: string, tab?: string) {
  if (!csvUrl?.trim()) throw new Error("Missing CSV URL");

  const res = await fetch(csvUrl);
  if (!res.ok) throw new Error(`CSV fetch failed: ${res.status} ${res.statusText}`);

  const text = await res.text();

  const parsed = Papa.parse<Record<string, unknown>>(text, {
    header: true,
    skipEmptyLines: true,
  });

  const t = tab ?? "";

  return (parsed.data || [])
    .filter(Boolean)
    .map((r) => (t ? { ...r, tab: t } : { ...r }));
}