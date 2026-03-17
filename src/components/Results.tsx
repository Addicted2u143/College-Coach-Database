// src/components/Results.tsx
import { useMemo, useState } from "react";

type AnyRow = any;

type TabItem = { id: string; label: string; group?: string };

type Props = {
  tabs: TabItem[];
  tab: string;
  onTabChange: (tab: string) => void;

  view: "cards" | "table";
  onViewChange: (v: "cards" | "table") => void;

  rows: AnyRow[];
  loading: boolean;

  favorites: Set<string>;
  onToggleFavorite: (row: AnyRow) => void;
};

function getAny(row: AnyRow, keys: string[]) {
  if (!row) return "";
  for (const k of keys) {
    const v = row[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") return v;
  }
  return "";
}

function rowTab(row: AnyRow) {
  return String(getAny(row, ["tab", "division", "group"])).trim();
}

function school(row: AnyRow) {
  return String(getAny(row, ["School", "school", "Name"])).trim();
}

function division(row: AnyRow) {
  return String(getAny(row, ["Division", "division"])).trim();
}

function conference(row: AnyRow) {
  return String(getAny(row, ["Conference", "conference"])).trim();
}

function schoolSite(row: AnyRow) {
  return String(getAny(row, ["School Website", "Website"])).trim();
}

function teamSite(row: AnyRow) {
  return String(getAny(row, ["Team Page", "Program Website"])).trim();
}

function questionnaire(row: AnyRow) {
  return String(getAny(row, ["Recruiting Questionnaire"])).trim();
}

function staff(row: AnyRow) {
  return String(getAny(row, ["Staff Directory"])).trim();
}

function twitter(row: AnyRow) {
  return String(getAny(row, ["Twitter/X", "twitter_x"])).trim();
}

function instagram(row: AnyRow) {
  return String(getAny(row, ["Instagram"])).trim();
}

function facebook(row: AnyRow) {
  return String(getAny(row, ["Facebook"])).trim();
}

function normalizeUrl(value: string) {
  const s = String(value || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  if (/^www\./i.test(s)) return `https://${s}`;
  return "";
}

function favKey(row: AnyRow) {
  return `${rowTab(row)}__${school(row)}`.toLowerCase();
}

export default function Results({
  tabs,
  tab,
  onTabChange,
  view,
  onViewChange,
  rows,
  loading,
  favorites,
  onToggleFavorite,
}: Props) {

  // prevent unused variable build errors
  void tabs;
  void tab;
  void onTabChange;
  void view;
  void onViewChange;
  void loading;
  void favorites;
  void onToggleFavorite;

  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter((r) => {
      return (
        String(school(r)).toLowerCase().includes(q) ||
        String(conference(r)).toLowerCase().includes(q)
      );
    });
  }, [rows, search]);

  return (
    <section className="space-y-4">

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="w-full border px-3 py-2 rounded"
      />

      {/* CARDS */}
      {view === "cards" && (
        <div className="grid md:grid-cols-2 gap-3">
          {filtered.map((r, i) => {
            const sSite = normalizeUrl(schoolSite(r));
            const tSite = normalizeUrl(teamSite(r));
            const q = normalizeUrl(questionnaire(r));
            const st = normalizeUrl(staff(r));
            const tw = normalizeUrl(twitter(r));
            const ig = normalizeUrl(instagram(r));
            const fb = normalizeUrl(facebook(r));

            return (
              <div key={i} className="border rounded-xl p-4 bg-white shadow-sm">

                <div className="text-lg font-bold">{school(r)}</div>

                {division(r) && (
                  <div className="text-sm text-gray-700">
                    <b>Division:</b> {division(r)}
                  </div>
                )}

                <div className="text-sm text-gray-700">
                  <b>Conference:</b> {conference(r)}
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {sSite && <a href={sSite} target="_blank" className="btn">School Site</a>}
                  {tSite && <a href={tSite} target="_blank" className="btn">Team Site</a>}
                  {q && <a href={q} target="_blank" className="btn">Questionnaire</a>}
                  {st && <a href={st} target="_blank" className="btn">Staff</a>}
                </div>

                {/* SOCIAL ICONS */}
                <div className="flex gap-3 mt-3">

                  {tw && (
                    <a href={tw} target="_blank" className="p-2 bg-gray-100 rounded">
                      X
                    </a>
                  )}

                  {ig && (
                    <a href={ig} target="_blank" className="p-2 bg-gray-100 rounded">
                      IG
                    </a>
                  )}

                  {fb && (
                    <a href={fb} target="_blank" className="p-2 bg-gray-100 rounded">
                      FB
                    </a>
                  )}

                </div>

              </div>
            );
          })}
        </div>
      )}

    </section>
  );
}
