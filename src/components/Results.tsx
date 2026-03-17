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

// 🔥 SPLIT LOGIC (safe fallback)
function schoolSite(row: AnyRow) {
  return String(getAny(row, ["School Website", "school website", "Website", "website"])).trim();
}

function teamSite(row: AnyRow) {
  return String(getAny(row, ["Program Website", "program website", "Team Page", "team page"])).trim();
}

function questionnaire(row: AnyRow) {
  return String(getAny(row, ["Recruiting Questionnaire"])).trim();
}

function staff(row: AnyRow) {
  return String(getAny(row, ["Staff Directory"])).trim();
}

// 🔥 SOCIALS
function twitter(row: AnyRow) {
  return String(getAny(row, ["Twitter/X", "twitter"])).trim();
}

function instagram(row: AnyRow) {
  return String(getAny(row, ["Instagram", "instagram"])).trim();
}

function facebook(row: AnyRow) {
  return String(getAny(row, ["Facebook", "facebook"])).trim();
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

export default function Results(props: Props) {
  const { tabs, tab, onTabChange, view, onViewChange, rows, loading, favorites, onToggleFavorite } =
    props;

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

            const key = favKey(r) || i;

            return (
              <div key={key} className="border rounded-xl p-4 bg-white shadow-sm">

                {/* TITLE */}
                <div className="text-lg font-bold">{school(r)}</div>

                {/* DIVISION */}
                {division(r) && (
                  <div className="text-sm text-gray-700">
                    <b>Division:</b> {division(r)}
                  </div>
                )}

                {/* CONFERENCE */}
                <div className="text-sm text-gray-700">
                  <b>Conference:</b> {conference(r)}
                </div>

                {/* BUTTONS */}
                <div className="flex flex-wrap gap-2 mt-3">

                  {sSite && <a href={sSite} target="_blank" className="btn">School Site</a>}
                  {tSite && <a href={tSite} target="_blank" className="btn">Team Site</a>}
                  {q && <a href={q} target="_blank" className="btn">Questionnaire</a>}
                  {st && <a href={st} target="_blank" className="btn">Staff</a>}

                </div>

                {/* SOCIAL ICONS */}
                <div className="flex gap-3 mt-3 text-xl">
                  {tw && <a href={tw} target="_blank">🐦</a>}
                  {ig && <a href={ig} target="_blank">📸</a>}
                  {fb && <a href={fb} target="_blank">📘</a>}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* TABLE */}
      {view === "table" && (
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th>School</th>
              <th>Division</th>
              <th>Conference</th>
              <th>School</th>
              <th>Team</th>
              <th>Q</th>
              <th>Staff</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((r, i) => {
              const sSite = normalizeUrl(schoolSite(r));
              const tSite = normalizeUrl(teamSite(r));
              const q = normalizeUrl(questionnaire(r));
              const st = normalizeUrl(staff(r));

              return (
                <tr key={i}>
                  <td>{school(r)}</td>
                  <td>{division(r)}</td>
                  <td>{conference(r)}</td>

                  <td>{sSite && <a href={sSite}>Open</a>}</td>
                  <td>{tSite && <a href={tSite}>Open</a>}</td>
                  <td>{q && <a href={q}>Open</a>}</td>
                  <td>{st && <a href={st}>Open</a>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

    </section>
  );
}
