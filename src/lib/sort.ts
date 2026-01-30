import type { CoachRow, SortDir, SortKey } from "./types";

function cmp(a: string, b: string) {
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}

export function sortRows(rows: CoachRow[], sortKey: SortKey, sortDir: SortDir): CoachRow[] {
  const dir = sortDir === "asc" ? 1 : -1;

  const secondary: SortKey = sortKey === "school" ? "conference" : "school";

  return [...rows].sort((r1, r2) => {
    const p1 = (r1[sortKey] ?? "").toString();
    const p2 = (r2[sortKey] ?? "").toString();
    const primary = cmp(p1, p2);
    if (primary !== 0) return primary * dir;

    const s1 = (r1[secondary] ?? "").toString();
    const s2 = (r2[secondary] ?? "").toString();
    const sec = cmp(s1, s2);
    if (sec !== 0) return sec * dir;

    const tSchool = cmp(r1.school, r2.school);
    if (tSchool !== 0) return tSchool;

    return cmp(r1.conference, r2.conference);
  });
}