// FILE: src/config/tabs.ts
import type { TabKey } from "../lib/types";

export const TABS: Array<{ key: TabKey; label: string; csvUrl: string }> = [
  {
    key: "FBS",
    label: "FBS",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?output=csv",
  },
  {
    key: "FCS",
    label: "FCS",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=1355347771&single=true&output=csv",
  },
  {
    key: "DII",
    label: "DII",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=56535029&single=true&output=csv",
  },
  {
    key: "DIII",
    label: "DIII",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=1086413570&single=true&output=csv",
  },
  {
    key: "NAIA",
    label: "NAIA",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=1429911104&single=true&output=csv",
  },
  {
    key: "Sprint",
    label: "Sprint",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=2045840484&single=true&output=csv",
  },
  {
    key: "JuCo",
    label: "JuCo",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=1057782639&single=true&output=csv",
  },
  {
    key: "Post-Graduate",
    label: "Post-Graduate",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=2097889449&single=true&output=csv",
  },
  {
    key: "Canada",
    label: "Canada",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=814992836&single=true&output=csv",
  },
  {
    key: "Womens Flag",
    label: "Womens Flag",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=1723697523&single=true&output=csv",
  },
];

export const DEFAULT_TAB: TabKey = "FBS";