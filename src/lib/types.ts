// FILE: src/lib/types.ts
export type TabKey =
  | "FBS"
  | "FCS"
  | "DII"
  | "DIII"
  | "NAIA"
  | "Sprint"
  | "JuCo"
  | "Post-Graduate"
  | "Canada"
  | "Womens Flag";

export type SortKey = "conference" | "school";
export type SortDir = "asc" | "desc";

export type CoachRow = {
  tab?: string;

  school?: string;
  name?: string;

  conference?: string;

  website?: string;
  schoolWebsite?: string;

  questionnaire?: string;
  recruitingQuestionnaire?: string;

  staff?: string;
  staffDirectory?: string;

  [key: string]: unknown;
};