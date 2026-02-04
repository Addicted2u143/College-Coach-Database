// src/lib/types.ts

// NOTE:
// We keep TabKey flexible (string) so your tab keys can include spaces/hyphens
// like "Womens Flag" or "Post-Graduate" without TypeScript breaking.

export type TabKey = string;

export type TabDef = {
  key: TabKey;
  label: string;
  csvUrl: string;
  group?: string;
};

// Sorting helpers (used by src/lib/sort.ts)
export type SortKey = "school" | "conference";
export type SortDir = "asc" | "desc";