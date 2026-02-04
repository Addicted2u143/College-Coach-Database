// src/lib/types.ts

// =============================
// TAB / NAV TYPES
// =============================

// Keep TabKey flexible so keys like "Post-Graduate" or "Womens Flag" work
export type TabKey = string;

export type TabDef = {
  key: TabKey;
  label: string;
  csvUrl: string;
  group?: string;
};

// =============================
// DATA ROW TYPE
// =============================

// Generic row shape for CSV-loaded coach data
export type CoachRow = {
  tab?: string;
  division?: string;
  sheet?: string;
  group?: string;

  school?: string;
  School?: string;
  name?: string;

  conference?: string;
  Conference?: string;

  website?: string;
  Website?: string;

  questionnaire?: string;
  Questionnaire?: string;

  staff?: string;
  Staff?: string;

  [key: string]: any;
};

// =============================
// SORTING TYPES (used by sort.ts)
// =============================

export type SortKey = "school" | "conference";
export type SortDir = "asc" | "desc";