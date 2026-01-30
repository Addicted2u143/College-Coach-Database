import { useEffect, useMemo, useState } from "react";
import Results from "./Results";

// If your file is src/lib/csv.ts, change this line to:
// import { loadCoachRows } from "../lib/csv";
import { loadCoachRows } from "../lib/csv";

import { loadFavorites, saveFavorites } from "../lib/storage";
import { DEFAULT_TAB, TABS } from "../config/tabs";

type AnyRow = Record<string, any>;

function getTabFromUrl(): string {
  const url = new URL(window.location.href);
  return url.searchParams.get("tab") || DEFAULT_TAB || "FBS";
}

function setTabInUrl(tab: string) {
  const url = new URL(window.location.href);
  url.searchParams.set("tab", tab);
  window.history.replaceState({}, "", url.toString());
}

function getField(row: AnyRow, key: string) {
  return row?.[key] ?? row?.[key[0].toUpperCase() + key.slice(1)];
}

function school(row: AnyRow) {
  return String(getField(row, "school") ?? getField(row, "name") ?? "");
}

function favKey(row: AnyRow) {
  const t = String(getField(row, "tab") ?? "");
  return `${t}__${school(row)}`.toLowerCase();
}

export default function Tabs() {
  const tabs = useMemo(() => TABS.map((t) => ({ id: t.key, label: t.label })), []);

  const [tab, setTab] = useState<string>(() => getTabFromUrl());
  const [view, setView] = useState<"cards" | "table">("table");

  const [rows, setRows] = useState<AnyRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [favorites, setFavorites] = useState<Set<string>>(() => loadFavorites());

  useEffect(() => {
    // keep URL synced on first load too
    setTabInUrl(tab);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      try {
        const tabDef = TABS.find((t) => t.key === tab) ?? TABS[0];
        const data = await loadCoachRows(tabDef.csvUrl);

        // Attach tab to each row so Results can filter correctly
        const withTab = (data as AnyRow[]).map((r: AnyRow) => ({ ...r, tab: tabDef.key }));

        if (!cancelled) setRows(withTab);
      } catch (e) {
        console.error(e);
        if (!cancelled) setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [tab]);

  const onTabChange = (next: string) => {
    setTab(next);
    setTabInUrl(next);
  };

  const onToggleFavorite = (row: AnyRow) => {
    const key = favKey(row);
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      saveFavorites(next);
      return next;
    });
  };

  return (
    <Results
      tabs={tabs}
      tab={tab}
      onTabChange={onTabChange}
      view={view}
      onViewChange={setView}
      rows={rows}
      loading={loading}
      favorites={favorites}
      onToggleFavorite={onToggleFavorite}
    />
  );
}