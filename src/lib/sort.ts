// FILE: src/lib/sort.ts
import type { CoachRow, SortDir, SortKey } from "./types";

function s(v: unknown) {
  return String(v ?? "").toLowerCase();
}

export function sortRows(rows: CoachRow[], sortKey: SortKey, dir: SortDir) {
  const mult = dir === "asc" ? 1 : -1;

  return [...rows].sort((a, b) => {
    const aPrimary = s(a[sortKey]);
    const bPrimary = s(b[sortKey]);

    if (aPrimary !== bPrimary) return aPrimary.localeCompare(bPrimary) * mult;

    const secondary: SortKey = sortKey === "conference" ? "school" : "conference";
    const aSec = s(a[secondary]);
    const bSec = s(b[secondary]);

    return aSec.localeCompare(bSec) * mult;
  });
}