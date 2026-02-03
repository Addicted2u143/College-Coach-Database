// src/config/tabs.ts
import type { TabDef, TabKey } from "../lib/types";

export const TABS: TabDef[] = [
  {
    key: "FBS",
    label: "FBS",
    group: "Football",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?output=csv",
  },
  {
    key: "FCS",
    label: "FCS",
    group: "Football",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=1355347771&single=true&output=csv",
  },
  {
    key: "DII",
    label: "DII",
    group: "Football",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=56535029&single=true&output=csv",
  },
  {
    key: "DIII",
    label: "DIII",
    group: "Football",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=1086413570&single=true&output=csv",
  },
  {
    key: "NAIA",
    label: "NAIA",
    group: "Football",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=1429911104&single=true&output=csv",
  },
  {
    key: "Sprint",
    label: "Sprint",
    group: "Football",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=2045840484&single=true&output=csv",
  },
  {
    key: "JuCo",
    label: "JuCo",
    group: "Football",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=1057782639&single=true&output=csv",
  },
  {
    key: "Post-Graduate",
    label: "Post-Graduate",
    group: "Football",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=2097889449&single=true&output=csv",
  },
  {
    key: "Canada",
    label: "Canada",
    group: "Football",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=814992836&single=true&output=csv",
  },
  {
    key: "Womens Flag",
    label: "Womens Flag",
    group: "Football",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=1723697523&single=true&output=csv",
  },

  // ---- Other Sports (NEW) ----
  {
    key: "Mens Basketball",
    label: "Men’s Basketball",
    group: "Other Sports",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=1547947146&single=true&output=csv",
  },
  {
    key: "Mens Baseball",
    label: "Men’s Baseball",
    group: "Other Sports",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=1455310286&single=true&output=csv",
  },
];

export const DEFAULT_TAB: TabKey = "FBS";
