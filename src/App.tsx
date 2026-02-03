// src/App.tsx
import { useEffect, useMemo, useState } from "react";
import Results from "./components/Results";
import { TABS, DEFAULT_TAB } from "./config/tabs";

type AnyRow = any;

function getTabFromUrl(allowed: Set<string>) {
  const u = new URL(window.location.href);
  const raw = u.searchParams.get("tab");
  if (!raw) return DEFAULT_TAB;
  return allowed.has(raw) ? (raw as any) : DEFAULT_TAB;
}

function setTabInUrl(tab: string) {
  const u = new URL(window.location.href);
  u.searchParams.set("tab", tab);
  window.history.replaceState({}, "", u.toString());
}

export default function App() {
  const allowedTabs = useMemo(() => new Set(TABS.map((t) => t.key)), []);
  const [tab, setTab] = useState<string>(() => getTabFromUrl(allowedTabs));

  const [rows, setRows] = useState<AnyRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Keep URL -> state in sync (back/forward)
  useEffect(() => {
    const onPop = () => setTab(getTabFromUrl(allowedTabs));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [allowedTabs]);

  // Load ALL tabs (so switching tabs is instant)
  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      try {
        const allRows: AnyRow[] = [];

        for (const t of TABS) {
          const res = await fetch(t.csvUrl, { cache: "no-store" });
          const text = await res.text();

          // super-light CSV parse (assumes your published CSV is normal)
          const lines = text.replace(/\r/g, "").split("\n").filter(Boolean);
          const headers = (lines.shift() || "")
            .split(",")
            .map((h) => h.trim());

          for (const line of lines) {
            const cols = line.split(",");
            const obj: Record<string, string> = { tab: t.key };
            for (let i = 0; i < headers.length; i++) obj[headers[i]] = cols[i] ?? "";
            allRows.push(obj);
          }
        }

        if (!cancelled) setRows(allRows);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const onTabChange = (next: string) => {
    setTab(next);
    setTabInUrl(next);
  };

  const [view, setView] = useState<"cards" | "table">("cards");
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set());

  const onToggleFavorite = (row: AnyRow) => {
    const key = `${String(row.tab || "")}__${String(row.School || row.school || row.Name || row.name || "")}`.toLowerCase();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <Results
          tabs={TABS.map((t) => ({ id: t.key, label: t.label, group: t.group }))}
          tab={tab}
          onTabChange={onTabChange}
          view={view}
          onViewChange={setView}
          rows={rows}
          loading={loading}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
        />
      </div>
    </div>
  );
}
