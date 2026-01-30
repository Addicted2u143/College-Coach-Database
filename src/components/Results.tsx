import { useMemo, useState } from "react";

type AnyRow = any;
type TabItem = { id: string; label: string };

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

// normalize keys: "School Website" -> "schoolwebsite"
function normKey(s: string) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function getField(row: AnyRow, keys: string | string[]) {
  if (!row) return undefined;
  const list = Array.isArray(keys) ? keys : [keys];

  // Fast path: direct access + TitleCase variant
  for (const k of list) {
    if (k in row) return row[k];
    const title = k ? k[0].toUpperCase() + k.slice(1) : k;
    if (title in row) return row[title];
  }

  // Robust path: case/space-insensitive match
  const map = new Map<string, any>();
  for (const rk of Object.keys(row)) map.set(normKey(rk), row[rk]);

  for (const k of list) {
    const hit = map.get(normKey(k));
    if (hit !== undefined) return hit;
  }

  return undefined;
}

function rowTab(row: AnyRow) {
  return String(getField(row, ["tab", "division", "sheet", "group"]) ?? "");
}

function school(row: AnyRow) {
  return String(getField(row, ["school", "name", "program", "college"]) ?? "");
}

function conference(row: AnyRow) {
  return String(getField(row, ["conference", "conf"]) ?? "");
}

function website(row: AnyRow) {
  return String(
    getField(row, ["website", "schoolWebsite", "school website", "school url", "url"]) ?? ""
  );
}

function questionnaire(row: AnyRow) {
  return String(
    getField(row, [
      "questionnaire",
      "recruitingQuestionnaire",
      "recruiting questionnaire",
      "questionnaire link",
    ]) ?? ""
  );
}

function staff(row: AnyRow) {
  return String(
    getField(row, ["staff", "staffDirectory", "staff directory", "staff link"]) ?? ""
  );
}

function favKey(row: AnyRow) {
  return `${rowTab(row)}__${school(row)}`.toLowerCase();
}

function normalizeUrl(s: string) {
  const v = (s || "").trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  // If sheet has "www.school.edu" without https, fix it
  if (/^www\./i.test(v)) return `https://${v}`;
  return v;
}

function isUrl(s: string) {
  const v = normalizeUrl(s);
  return /^https?:\/\//i.test(v);
}

type SortBy = "conference" | "school";
type SortDir = "asc" | "desc";

export default function Results(props: Props) {
  const { tabs, tab, onTabChange, view, onViewChange, rows, loading, favorites, onToggleFavorite } =
    props;

  const [search, setSearch] = useState("");
  const [conferenceFilter, setConferenceFilter] = useState("all");

  // Default workbook sort: Conference A→Z then School A→Z
  const [sortBy, setSortBy] = useState<SortBy>("conference");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const tabRows = useMemo(() => (rows || []).filter((r) => rowTab(r) === tab), [rows, tab]);

  const conferences = useMemo(() => {
    const set = new Set<string>();
    for (const r of tabRows) {
      const c = String(conference(r) || "").trim();
      if (c) set.add(c);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [tabRows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const conf = conferenceFilter;

    let list = tabRows;

    if (conf !== "all") list = list.filter((r) => conference(r) === conf);

    if (q) {
      list = list.filter(
        (r) =>
          school(r).toLowerCase().includes(q) || conference(r).toLowerCase().includes(q)
      );
    }

    const dir = sortDir === "asc" ? 1 : -1;

    return [...list].sort((a, b) => {
      const sa = school(a);
      const sb = school(b);
      const ca = conference(a);
      const cb = conference(b);

      if (sortBy === "conference") {
        const first = ca.localeCompare(cb) * dir;
        if (first !== 0) return first;
        return sa.localeCompare(sb) * dir;
      }

      const first = sa.localeCompare(sb) * dir;
      if (first !== 0) return first;
      return ca.localeCompare(cb) * dir;
    });
  }, [tabRows, search, conferenceFilter, sortBy, sortDir]);

  const onClickHeaderSort = (key: SortBy) => {
    if (sortBy !== key) {
      setSortBy(key);
      setSortDir("asc");
      return;
    }
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-3xl font-extrabold text-gray-900">{tab}</div>

        <div className="flex items-center gap-2 rounded-xl bg-white p-1 border border-gray-300 shadow-sm">
          <button
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
              view === "cards" ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => onViewChange("cards")}
          >
            Cards
          </button>
          <button
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
              view === "table" ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => onViewChange("table")}
          >
            Table
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition ${
                active
                  ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                  : "bg-white text-gray-800 border-gray-300 hover:border-gray-500"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <div className="text-xs font-bold text-gray-600">Search</div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="School or conference…"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-red-500/40"
            />
          </div>

          <div>
            <div className="text-xs font-bold text-gray-600">Conference</div>
            <select
              value={conferenceFilter}
              onChange={(e) => setConferenceFilter(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-red-500/40"
            >
              <option value="all">All conferences</option>
              {conferences.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="text-xs font-bold text-gray-600">Sort</div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-red-500/40"
            >
              <option value="conference">Conference</option>
              <option value="school">School</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 font-semibold hover:bg-gray-100"
              onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
            >
              {sortDir === "asc" ? "A→Z" : "Z→A"}
            </button>
          </div>
        </div>

        <div className="mt-3 text-sm text-gray-700">
          {loading ? "Loading…" : `Showing ${filtered.length} schools`}
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">Loading…</div>
      ) : view === "table" ? (
        <div className="overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="px-4 py-3 font-extrabold">
                  <button onClick={() => onClickHeaderSort("school")} className="hover:underline">
                    School
                  </button>
                </th>
                <th className="px-4 py-3 font-extrabold">
                  <button
                    onClick={() => onClickHeaderSort("conference")}
                    className="hover:underline"
                  >
                    Conference
                  </button>
                </th>
                <th className="px-4 py-3 font-extrabold text-center">Website</th>
                <th className="px-4 py-3 font-extrabold text-center">Questionnaire</th>
                <th className="px-4 py-3 font-extrabold text-center">Staff</th>
                <th className="px-4 py-3 font-extrabold text-center">Fav</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((r, i) => {
                const w = normalizeUrl(website(r));
                const q = normalizeUrl(questionnaire(r));
                const st = normalizeUrl(staff(r));

                const key = favKey(r);
                const isFav = favorites.has(key);

                return (
                  <tr key={key || i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <td className="px-4 py-3 font-semibold">{school(r)}</td>
                    <td className="px-4 py-3 text-gray-800">{conference(r)}</td>

                    <td className="px-4 py-3 text-center">
                      {isUrl(w) ? (
                        <a
                          href={w}
                          target="_blank"
                          rel="noreferrer"
                          className="text-red-700 font-semibold hover:underline"
                        >
                          Open
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {isUrl(q) ? (
                        <a
                          href={q}
                          target="_blank"
                          rel="noreferrer"
                          className="text-red-700 font-semibold hover:underline"
                        >
                          Open
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {isUrl(st) ? (
                        <a
                          href={st}
                          target="_blank"
                          rel="noreferrer"
                          className="text-red-700 font-semibold hover:underline"
                        >
                          Open
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onToggleFavorite(r)}
                        className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border transition ${
                          isFav
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {isFav ? "★" : "☆"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((r, i) => {
            const w = normalizeUrl(website(r));
            const q = normalizeUrl(questionnaire(r));
            const st = normalizeUrl(staff(r));

            const key = favKey(r);
            const isFav = favorites.has(key);

            return (
              <div key={key || i} className="rounded-2xl bg-white border border-gray-200 shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xl font-extrabold text-gray-900">{school(r)}</div>
                    <div className="mt-1 text-sm text-gray-600">{conference(r)}</div>
                  </div>

                  <button
                    onClick={() => onToggleFavorite(r)}
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border transition ${
                      isFav
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {isFav ? "★" : "☆"}
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {isUrl(w) ? (
                    <a href={w} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800">
                      Website
                    </a>
                  ) : (
                    <span className="px-4 py-2 rounded-xl bg-gray-100 text-gray-400 font-semibold">Website</span>
                  )}

                  {isUrl(q) ? (
                    <a href={q} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800">
                      Questionnaire
                    </a>
                  ) : (
                    <span className="px-4 py-2 rounded-xl bg-gray-100 text-gray-400 font-semibold">Questionnaire</span>
                  )}

                  {isUrl(st) ? (
                    <a href={st} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800">
                      Staff
                    </a>
                  ) : (
                    <span className="px-4 py-2 rounded-xl bg-gray-100 text-gray-400 font-semibold">Staff</span>
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