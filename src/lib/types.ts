// src/lib/types.ts

export type TabKey = string;

export type TabDef = {
  key: TabKey;
  label: string;
  group: string;
  csvUrl: string;
};

export type CoachRow = Record<string, string>;