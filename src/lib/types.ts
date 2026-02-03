// FILE: src/lib/types.ts
export type CoachRow = {
  conference: string; // Column A
  school: string; // Column B
  schoolWebsite?: string;
  recruitingQuestionnaire?: string;
  staffDirectory?: string;

  // Optional future fields (safe to keep now)
  headCoach?: string;
  email?: string;
  phone?: string;
};

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
  | "Womens Flag"
  | "Mens Basketball"
  | "Mens Baseball";

export type LoadState =
  | { status: "idle" | "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; rows: CoachRow[] };

export type SortKey = "conference" | "school";
export type SortDir = "asc" | "desc";
