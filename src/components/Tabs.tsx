import { useEffect, useMemo, useState } from "react";
import Results from "./components/Results";
import { loadCoachRows } from "./lib/csv";
import { loadFavorites, saveFavorites } from "./lib/storage";
import { DEFAULT_TAB, TABS } from "./config/tabs";

type AnyRow = any;

function getTabFromUrl(): string {
  const url = new URL(window.location.href);
  return url.searchParams.get("tab") || DEFAULT_TAB || "FBS";
}

function setTabInUrl(tab: string) {
  const url = new URL(window.location.href);
  url.searchParams.set("tab", tab);
  window.history.replaceState({}, "", url.toString());
}

function favKey(row: AnyRow) {
  const tab = String(row?.tab ?? "");
  const school = String(row?.school ?? row?.School ?? row?.name ?? "");
  return `${tab}__${school}`.toLowerCase();
}

export default function App() {
  const [tab, setTab] = useState<string>(getTabFromUrl());
  const [view, setView] = useState<"cards" | "table">("cards");

  const [rows, setRows] = useState<AnyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [favorites, setFavorites] = useState<Set<string>>(() => loadFavorites());

  useEffect(() => {
    setTabInUrl(tab);
  }, [tab]);

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const batches = await Promise.all(
          TABS.map(async (t) => {
            if (!t.csvUrl.trim()) return [];
            const list = await loadCoachRows(t.csvUrl);
            return list.map((r) => ({ ...r, tab: t.key }));
          })
        );

        if (!mounted) return;
        setRows(batches.flat());
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

  const tabs = useMemo(() => TABS.map((t) => ({ id: t.key, label: t.label })), []);

  const onToggleFavorite = (row: AnyRow) => {
    const key = favKey(row);
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-brand-light text-brand-gray">
      <header className="px-4 pt-8 pb-6">
        <div className="mx-auto max-w-6xl flex flex-col items-center">
          <img src="/logo-black.png" alt="My Recruits" className="h-20 w-auto md:h-24" />
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-brand-black">
            College Coach Directory
          </h1>
          <div className="mt-6 h-1 w-full rounded bg-brand-red/90" />
        </div>
      </header>

      <main className="px-4 pb-10">
        <div className="mx-auto max-w-6xl">
          {err ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-900">
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
              rows={rows}
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