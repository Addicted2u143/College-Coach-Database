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

/**
 * Normalize keys so "Conference", "conference ", "Conf.", "conf_name" etc can match.
 */
function normKey(s: string) {
  return String(s || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Get a field from a row by trying:
 * 1) direct key
 * 2) capitalized variant
 * 3) case/space/punct-insensitive match against any row key
 */
function getField(row: AnyRow, key: string) {
  if (!row) return undefined;

  // 1) direct
  if (row?.[key] != null) return row[key];

  // 2) Capitalized first letter fallback
  const cap = key ? key[0].toUpperCase() + key.slice(1) : key;
  if (row?.[cap] != null) return row[cap];

  // 3) normalized scan
  const target = normKey(key);
  for (const k of Object.keys(row)) {
    if (normKey(k) === target) return row[k];
  }

  return undefined;
}

function rowTab(row: AnyRow) {
  return String(getField(row, "tab") ?? "");
}

function school(row: AnyRow) {
  return String(getField(row, "school") ?? getField(row, "name") ?? getField(row, "School") ?? "");
}

function conference(row: AnyRow) {
  // Try multiple likely header names
  return String(
    getField(row, "conference") ??
      getField(row, "conf") ??
      getField(row, "conferenceName") ??
      getField(row, "league") ??
      getField(row, "Conference") ??
      ""
  );
}

function website(row: AnyRow) {
  return String(getField(row, "website") ?? getField(row, "schoolWebsite") ?? "");
}

function questionnaire(row: AnyRow) {
  return String(getField(row, "questionnaire") ?? getField(row, "recruitingQuestionnaire") ?? "");
}

function staff(row: AnyRow) {
  return String(getField(row, "staff") ?? getField(row, "staffDirectory") ?? "");
}

function favKey(row: AnyRow) {
  return `${rowTab(row)}__${school(row)}`.toLowerCase();
}

function isUrl(s: string) {
  return typeof s === "string" && /^https?:\/\//i.test(s.trim());
}

type SortBy = "conference" | "school";
type SortDir = "asc" | "desc";

export default function Results(props: Props) {
  const { tabs, tab, onTabChange, view, onViewChange, rows, loading, favorites, onToggleFavorite } =
    props;

  const [search, setSearch] = useState("");
  const [conferenceFilter, setConferenceFilter] = useState("all");

  // Default sort: Conference A→Z then School A→Z
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

    if (conf !== "all") list = list.filter((r) => String(conference(r)) === conf);

    if (q) {
      list = list.filter((r) => {
        const s = school(r).toLowerCase();
        const c = String(conference(r)).toLowerCase();
        return s.includes(q) || c.includes(q);
      });
    }

    const dir = sortDir === "asc" ? 1 : -1;

    return [...list].sort((a, b) => {
      const sa = school(a);
      const sb = school(b);
      const ca = String(conference(a) || "");
      const cb = String(conference(b) || "");

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
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        {/* Mobile-friendly title sizing */}
        <div className="font-extrabold text-gray-900 text-2xl md:text-3xl">{tab}</div>

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

      {/* Tabs */}
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

      {/* Filters */}
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

      {/* Content */}
      {loading ? (
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">Loading…</div>
      ) : view === "table" ? (
        // ✅ MOBILE SIDE-SCROLL: overflow-x-auto + a min width table
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-x-auto">
          <table className="min-w-[820px] w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="px-4 py-3 font-extrabold">
                  <button onClick={() => onClickHeaderSort("school")} className="hover:underline">
                    School
                  </button>
                </th>
                <th className="px-4 py-3 font-extrabold">
                  <button onClick={() => onClickHeaderSort("conference")} className="hover:underline">
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
                const w = website(r).trim();
                const q = questionnaire(r).trim();
                const st = staff(r).trim();

                const key = favKey(r);
                const isFav = favorites.has(key);

                const conf = String(conference(r)).trim();

                return (
                  <tr key={key || i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <td className="px-4 py-3 font-semibold">{school(r)}</td>
                    <td className="px-4 py-3 text-gray-800">{conf || "—"}</td>

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
        // Cards
        <div className="space-y-4">
          {filtered.map((r, i) => {
            const w = website(r).trim();
            const q = questionnaire(r).trim();
            const st = staff(r).trim();

            const key = favKey(r);
            const isFav = favorites.has(key);

            const conf = String(conference(r)).trim();

            return (
              <div key={key || i} className="rounded-2xl bg-white border border-gray-200 shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    {/* Label + value (NOT same size/font) */}
                    <div className="text-[11px] font-bold uppercase tracking-wide text-gray-500">School</div>
                    <div className="text-xl font-extrabold text-gray-900 leading-tight truncate">
                      {school(r)}
                    </div>

                    <div className="mt-2 text-[11px] font-bold uppercase tracking-wide text-gray-500">
                      Conference
                    </div>
                    <div className="text-sm font-semibold text-gray-800">{conf || "—"}</div>
                  </div>

                  <button
                    onClick={() => onToggleFavorite(r)}
                    className={`shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl border transition ${
                      isFav
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                    }`}
                    aria-label="Toggle favorite"
                  >
                    {isFav ? "★" : "☆"}
                  </button>
                </div>

                {/* Links (keep original feel) */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {isUrl(w) ? (
                    <a
                      href={w}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800"
                    >
                      Website
                    </a>
                  ) : (
                    <span className="px-4 py-2 rounded-xl bg-gray-100 text-gray-400 font-semibold">
                      Website
                    </span>
                  )}

                  {isUrl(q) ? (
                    <a
                      href={q}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800"
                    >
                      Questionnaire
                    </a>
                  ) : (
                    <span className="px-4 py-2 rounded-xl bg-gray-100 text-gray-400 font-semibold">
                      Questionnaire
                    </span>
                  )}

                  {isUrl(st) ? (
                    <a
                      href={st}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800"
                    >
                      Staff
                    </a>
                  ) : (
                    <span className="px-4 py-2 rounded-xl bg-gray-100 text-gray-400 font-semibold">
                      Staff
                    </span>
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