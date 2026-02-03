// src/lib/types.ts

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

export type TabGroup = "Football" | "Other Sports";

export type TabDef = {
  key: TabKey;
  label: string;
  csvUrl: string;
  group: TabGroup;
};
