// src/App.tsx
import { useEffect, useMemo, useState } from "react";
import Results from "./components/Results";
import { TABS, DEFAULT_TAB } from "./config/tabs";
import { loadCsv } from "./lib/csv";
import type { TabKey } from "./lib/types";

type AnyRow = any;

export default function App() {
  const [tab, setTab] = useState<TabKey>(DEFAULT_TAB);
  const [rows, setRows] = useState<AnyRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [view, setView] = useState<"cards" | "table">("cards");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const activeTab = useMemo(() => TABS.find((t) => t.key === tab), [tab]);

  // Load CSV whenever tab changes
  useEffect(() => {
    if (!activeTab) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    loadCsv(activeTab.csvUrl)
      .then((data: AnyRow[]) => {
        if (cancelled) return;

        const list = Array.isArray(data) ? data : [];
        setRows(list.map((r) => ({ ...r, tab: activeTab.key })));

        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error("CSV load failed:", err);
        if (cancelled) return;

        setRows([]);
        setError(
          `Failed to load ${activeTab.label}. ` +
            (err instanceof Error ? err.message : String(err))
        );
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  function toggleFavorite(row: AnyRow) {
    const t = String(row?.tab ?? "").trim();
    const s = String(row?.school ?? row?.School ?? row?.name ?? "").trim();
    const key = `${t}__${s}`.toLowerCase();

    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <img
            src="/logo-black.png"
            alt="My Recruits"
            className="h-16 mx-auto mb-3"
          />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            College Database
          </h1>
          <div className="mt-4 h-1 w-full bg-red-700 rounded-full" />
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Error banner (only shows when CSV fails) */}
        {error ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-800 font-semibold">
            {error}
          </div>
        ) : null}

        <Results
          tabs={TABS.map((t) => ({
            id: t.key,
            label: t.label,
            group: t.group,
          }))}
          tab={tab}
          onTabChange={(t) => setTab(t as TabKey)}
          view={view}
          onViewChange={setView}
          rows={rows}
          loading={loading}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      </main>
    </div>
  );
}