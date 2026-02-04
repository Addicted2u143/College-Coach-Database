// src/config/tabs.ts
import type { TabDef, TabKey } from "../lib/types";

export const TABS: TabDef[] = [
  // --- MEN'S FOOTBALL ---
  {
    key: "FBS",
    label: "FBS",
    group: "Men’s Football",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?output=csv",
  },
  {
    key: "FCS",
    label: "FCS",
    group: "Men’s Football",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=1355347771&single=true&output=csv",
  },
  {
    key: "DII",
    label: "DII",
    group: "Men’s Football",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=56535029&single=true&output=csv",
  },
  {
    key: "DIII",
    label: "DIII",
    group: "Men’s Football",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=1086413570&single=true&output=csv",
  },
  {
    key: "NAIA",
    label: "NAIA",
    group: "Men’s Football",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=1429911104&single=true&output=csv",
  },
  {
    key: "Sprint",
    label: "Sprint",
    group: "Men’s Football",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=2045840484&single=true&output=csv",
  },
  {
    key: "JuCo",
    label: "JuCo",
    group: "Men’s Football",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=1057782639&single=true&output=csv",
  },
  {
    key: "PostGraduate",
    label: "Post-Graduate",
    group: "Men’s Football",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=2097889449&single=true&output=csv",
  },
  {
    key: "Canada",
    label: "Canada",
    group: "Men’s Football",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=814992836&single=true&output=csv",
  },

  // --- WOMEN'S SPORTS ---
  {
    key: "WomensFlag",
    label: "Women’s Flag",
    group: "Women’s Sports",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=1723697523&single=true&output=csv",
  },
  {
    key: "WomensVolleyball",
    label: "Women’s Volleyball",
    group: "Women’s Sports",
    csvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=871852710&single=true&output=csv",
  },

  // --- OTHER SPORTS ---
  {
    key: "MensBasketball",
    label: "Men’s Basketball",
    group: "Other Sports",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=1547947146&single=true&output=csv",
  },
  {
    key: "MensBaseball",
    label: "Men’s Baseball",
    group: "Other Sports",
    csvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC7JeyZJaNuU-jdhjDGgzOvj4-ZLxORZ008FnhdsFgvK5KV93tT1lYfkvCDw4h5g/pub?gid=1455310286&single=true&output=csv",
  },
];

// if your TabKey type is strict and doesn’t like extra strings,
// keep DEFAULT_TAB as the existing known key:
export const DEFAULT_TAB: TabKey = "FBS";