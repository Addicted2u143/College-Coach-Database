// src/App.tsx
import { useEffect, useMemo, useState } from "react";
import Results from "./components/Results";

import { loadCoachRows } from "./lib/csv";
import { loadFavorites, saveFavorites } from "./lib/storage";
import { DEFAULT_TAB, TABS } from "./config/tabs";

type AnyRow = any;

function getTabFromUrl() {
  const url = new URL(window.location.href);
  const tab = url.searchParams.get("tab");
  return tab || (DEFAULT_TAB as any) || "FBS";
}

function setTabInUrl(tab: string) {
  const url = new URL(window.location.href);
  url.searchParams.set("tab", tab);
  window.history.replaceState({}, "", url.toString());
}

// Favorite key: stable string per row
function favKey(row: AnyRow) {
  const tab = row?.tab ?? row?.division ?? row?.sheet ?? row?.group ?? "";
  const school = row?.school ?? row?.School ?? row?.name ?? "";
  return `${tab}__${school}`.toLowerCase();
}

export default function App() {
  const [tab, setTab] = useState<string>(getTabFromUrl());
  const [view, setView] = useState<"cards" | "table">("cards");

  const [allRows, setAllRows] = useState<AnyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Load data
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const rows = await loadCoachRows();
        if (!mounted) return;
        setAllRows(Array.isArray(rows) ? rows : []);
      } catch (e: any) {
        if (!mounted) return;
        setErr(e?.message || "Failed to load data.");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Load favorites
  useEffect(() => {
    try {
      const saved = loadFavorites?.();
      if (Array.isArray(saved)) setFavorites(new Set(saved));
    } catch {
      // ignore
    }
  }, []);

  // Persist favorites
  useEffect(() => {
    try {
      saveFavorites?.(Array.from(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  // Sync tab with URL
  useEffect(() => {
    setTabInUrl(tab);
  }, [tab]);

  // Tabs list
  const tabs = useMemo(() => {
    const raw = (TABS as any[]) || [];
    const normalized = raw.map((t) => {
      if (typeof t === "string") return { id: t, label: t };
      const id = t.id ?? t.key ?? t.value ?? t.name ?? t.label;
      const label = t.label ?? t.name ?? t.id ?? t.key ?? String(id);
      return { id: String(id), label: String(label) };
    });
    return normalized.length ? normalized : [{ id: tab, label: tab }];
  }, [tab]);

  const onToggleFavorite = (row: AnyRow) => {
    const key = favKey(row);
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // ✅ This fixes the logo on GitHub Pages / subpaths
  const logoUrl = `${import.meta.env.BASE_URL}logo-black.png`;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="px-4 pt-8 pb-6">
        <div className="mx-auto max-w-6xl flex flex-col items-center">
          <img src={logoUrl} alt="My Recruits" className="h-20 w-auto md:h-24" />

          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-black">
            College Coach Directory
          </h1>

          <div className="mt-6 h-1 w-full rounded bg-red-600/90" />
        </div>
      </header>

      <main className="px-4 pb-10">
        <div className="mx-auto max-w-6xl">
          {err ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              <div className="font-bold">Error</div>
              <div className="mt-1 text-sm">{err}</div>
            </div>
          ) : (
            <Results
              tabs={tabs}
              tab={tab}
              onTabChange={setTab}
              view={view}
              onViewChange={setView}
              rows={allRows}
              loading={loading}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
            />
          )}
        </div>
      </main>
    </div>
  );
}