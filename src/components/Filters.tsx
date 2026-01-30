// FILE: src/components/Filters.tsx
import React from "react";
import type { SortDir, SortKey } from "../lib/types";

type Props = {
  query: string;
  conference: string;
  conferences: string[];
  showFavoritesOnly: boolean;

  sortKey: SortKey;
  sortDir: SortDir;

  onQueryChange: (v: string) => void;
  onConferenceChange: (v: string) => void;
  onToggleFavoritesOnly: () => void;
  onClear: () => void;

  onSortKeyChange: (k: SortKey) => void;
  onToggleSortDir: () => void;
};

export default function Filters(props: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex-1">
          <label className="text-sm font-medium text-slate-700">Search</label>
          <input
            value={props.query}
            onChange={(e) => props.onQueryChange(e.target.value)}
            placeholder="School or conference…"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base outline-none focus:border-slate-400"
          />
        </div>

        <div className="md:w-72">
          <label className="text-sm font-medium text-slate-700">Conference</label>
          <select
            value={props.conference}
            onChange={(e) => props.onConferenceChange(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base outline-none focus:border-slate-400"
          >
            <option value="">All conferences</option>
            {props.conferences.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Mobile sort controls (desktop sorts by clicking headers) */}
        <div className="flex flex-1 flex-wrap items-end justify-between gap-2 md:justify-end">
          <div className="flex gap-2 md:hidden">
            <div>
              <label className="text-sm font-medium text-slate-700">Sort</label>
              <select
                value={props.sortKey}
                onChange={(e) => props.onSortKeyChange(e.target.value as SortKey)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base outline-none focus:border-slate-400"
              >
                <option value="conference">Conference</option>
                <option value="school">School</option>
              </select>
            </div>

            <button
              onClick={props.onToggleSortDir}
              className="mt-6 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-200"
            >
              {props.sortDir === "asc" ? "A→Z" : "Z→A"}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={props.onToggleFavoritesOnly}
              className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                props.showFavoritesOnly
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-900 hover:bg-slate-200"
              }`}
            >
              ★ Favorites
            </button>

            <button
              onClick={props.onClear}
              className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-200"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
