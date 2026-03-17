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
  return String(
    getAny(row, ["tab", "Tab", "division", "Division", "sheet", "Sheet", "group", "Group"])
  ).trim();
}

function school(row: AnyRow) {
  return String(getAny(row, ["School", "school", "Name", "name"])).trim();
}

function division(row: AnyRow) {
  return String(getAny(row, ["Division", "division"])).trim();
}

function conference(row: AnyRow) {
  return String(getAny(row, ["Conference", "conference", "Conf", "conf"])).trim();
}

function schoolSite(row: AnyRow) {
  return String(
    getAny(row, [
      "School Website",
      "school website",
      "SchoolWebsite",
      "schoolWebsite",
      "Website",
      "website",
      "URL",
      "url",
    ])
  ).trim();
}

function teamSite(row: AnyRow) {
  return String(
    getAny(row, [
      "Team Page",
      "team page",
      "Program Website",
      "program website",
      "ProgramWebsite",
      "programWebsite",
    ])
  ).trim();
}

function questionnaire(row: AnyRow) {
  return String(
    getAny(row, [
      "Recruiting Questionnaire",
      "recruiting questionnaire",
      "RecruitingQuestionnaire",
      "recruitingQuestionnaire",
      "Questionnaire",
      "questionnaire",
    ])
  ).trim();
}

function staff(row: AnyRow) {
  return String(
    getAny(row, [
      "Staff Directory",
      "staff directory",
      "StaffDirectory",
      "staffDirectory",
      "Staff",
      "staff",
    ])
  ).trim();
}

function twitter(row: AnyRow) {
  return String(
    getAny(row, [
      "Twitter_x",
      "twitter_x",
      "Twitter/X",
      "twitter/x",
      "Twitter",
      "twitter",
    ])
  ).trim();
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
  if (/^(open|link|n\/a|na|none|tbd|coming soon)$/i.test(s)) return "";
  if (/go to registration/i.test(s)) return "";
  if (/^https?:\/\//i.test(s)) return s;
  if (/^www\./i.test(s)) return `https://${s}`;
  return "";
}

function favKey(row: AnyRow) {
  return `${rowTab(row)}__${school(row)}`.toLowerCase();
}

type SortBy = "school" | "division" | "conference";
type SortDir = "asc" | "desc";

function SocialIconX() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2H21l-6.5 7.43L22 22h-6.828l-5.345-6.993L3.5 22H1l6.927-7.91L2 2h6.828l4.845 6.326L18.244 2Zm-2.394 18h1.885L8.394 4H6.41l9.44 16Z"/>
    </svg>
  );
}

function SocialIconInstagram() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm4.25 5.5A4.75 4.75 0 1 0 16.75 12 4.75 4.75 0 0 0 12 7.5Zm6-1.75a1.25 1.25 0 1 0 1.25 1.25A1.25 1.25 0 0 0 18 5.75Z"/>
    </svg>
  );
}

function SocialIconFacebook() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M13 22v-9h3l1-4h-4V7c0-1 .5-2 2-2h2V1.5S16.5 1 15 1c-3 0-5 2-5 5v3H7v4h3v9h3Z"/>
    </svg>
  );
}

export default function Results(props: Props) {
  const {
    tabs,
    tab,
    onTabChange,
    view,
    onViewChange,
    rows,
    loading,
    favorites,
    onToggleFavorite,
  } = props;

  const [search, setSearch] = useState("");
  const [conferenceFilter, setConferenceFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortBy>("conference");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const tabRows = useMemo(() => {
    const t = String(tab || "");
    return (rows || []).filter((r) => String(rowTab(r)) === t);
  }, [rows, tab]);

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
        const s = String(school(r) || "").toLowerCase();
        const c = String(conference(r) || "").toLowerCase();
        const d = String(division(r) || "").toLowerCase();
        return s.includes(q) || c.includes(q) || d.includes(q);
      });
    }

    const dir = sortDir === "asc" ? 1 : -1;

    return [...list].sort((a, b) => {
      const sa = String(school(a) || "");
      const sb = String(school(b) || "");
      const da = String(division(a) || "");
      const db = String(division(b) || "");
      const ca = String(conference(a) || "");
      const cb = String(conference(b) || "");

      if (sortBy === "division") {
        const first = da.localeCompare(db) * dir;
        if (first !== 0) return first;
        const second = ca.localeCompare(cb) * dir;
        if (second !== 0) return second;
        return sa.localeCompare(sb) * dir;
      }

      if (sortBy === "conference") {
        const first = ca.localeCompare(cb) * dir;
        if (first !== 0) return first;
        const second = da.localeCompare(db) * dir;
        if (second !== 0) return second;
        return sa.localeCompare(sb) * dir;
      }

      const first = sa.localeCompare(sb) * dir;
      if (first !== 0) return first;
      const second = da.localeCompare(db) * dir;
      if (second !== 0) return second;
      return ca.localeCompare(cb) * dir;
    });
  }, [tabRows, search, conferenceFilter, sortBy, sortDir]);

  const groupedTabs = useMemo(() => {
    const order: string[] = [];
    const map = new Map<string, TabItem[]>();

    for (const t of tabs) {
      let g = t.group || "Men’s Football";

      if (g === "Other Sports") g = "Men’s Other Sports";

      if (!map.has(g)) {
        map.set(g, []);
        order.push(g);
      }
      map.get(g)!.push(t);
    }

    const preferred = ["Men’s Football", "Men’s Other Sports", "Women’s Sports"];
    order.sort((a, b) => {
      const ia = preferred.indexOf(a);
      const ib = preferred.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });

    return order.map((g) => ({ group: g, tabs: map.get(g)! }));
  }, [tabs]);

  const TabPill = ({ id, label }: TabItem) => {
    const active = String(id) === String(tab);
    return (
      <button
        onClick={() => onTabChange(id)}
        className={[
          "px-3 py-1.5 rounded-full text-sm font-semibold border transition",
          active
            ? "bg-gray-900 text-white border-gray-900 shadow-sm"
            : "bg-white text-gray-800 border-gray-300 hover:border-gray-500",
        ].join(" ")}
      >
        {label}
      </button>
    );
  };

  return (
    <section className="space-y-4">
      <div className="flex justify-end">
        <div className="flex items-center gap-2 rounded-xl bg-white p-1 border border-gray-300 shadow-sm">
          <button
            className={[
              "px-3 py-1.5 rounded-lg text-sm font-semibold transition",
              view === "cards" ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100",
            ].join(" ")}
            onClick={() => onViewChange("cards")}
          >
            Cards
          </button>

          <button
            className={[
              "px-3 py-1.5 rounded-lg text-sm font-semibold transition",
              view === "table" ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100",
            ].join(" ")}
            onClick={() => onViewChange("table")}
          >
            Table
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {groupedTabs.map((g) => (
          <div key={g.group} className="space-y-2">
            <div className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
              {g.group}
            </div>
            <div className="flex flex-wrap gap-2">
              {g.tabs.map((t) => (
                <TabPill key={t.id} id={t.id} label={t.label} group={t.group} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <div className="text-xs font-bold text-gray-600">Search</div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="School, division, or conference…"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-red-600/40"
            />
          </div>

          <div>
            <div className="text-xs font-bold text-gray-600">Conference</div>
            <select
              value={conferenceFilter}
              onChange={(e) => setConferenceFilter(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-red-600/40"
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
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-red-600/40"
            >
              <option value="conference">Conference</option>
              <option value="division">Division</option>
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
      ) : view === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((r, idx) => {
            const sSite = normalizeUrl(schoolSite(r));
            const tSite = normalizeUrl(teamSite(r));
            const q = normalizeUrl(questionnaire(r));
            const st = normalizeUrl(staff(r));
            const tw = normalizeUrl(twitter(r));
            const ig = normalizeUrl(instagram(r));
            const fb = normalizeUrl(facebook(r));

            const key = favKey(r) || `${tab}__${idx}`;
            const isFav = favorites.has(key);

            return (
              <div key={key} className="rounded-2xl bg-white border border-gray-200 shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xl font-extrabold text-gray-900 break-words">
                      {school(r) || "—"}
                    </div>

                    {division(r) && (
                      <div className="mt-1 text-sm text-gray-700 break-words">
                        <span className="font-semibold text-gray-800">Division:</span>{" "}
                        {division(r)}
                      </div>
                    )}

                    <div className="mt-1 text-sm text-gray-700 break-words">
                      <span className="font-semibold text-gray-800">Conference:</span>{" "}
                      {conference(r) || "—"}
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleFavorite(r)}
                    className={[
                      "inline-flex items-center justify-center w-10 h-10 rounded-xl border transition",
                      isFav
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100",
                    ].join(" ")}
                    title={isFav ? "Unfavorite" : "Favorite"}
                  >
                    {isFav ? "★" : "☆"}
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {sSite && (
                    <a
                      href={sSite}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-gray-900 text-white font-semibold hover:opacity-90"
                    >
                      School Site
                    </a>
                  )}

                  {tSite && (
                    <a
                      href={tSite}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-gray-900 text-white font-semibold hover:opacity-90"
                    >
                      Team Site
                    </a>
                  )}

                  {q ? (
                    <a
                      href={q}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-gray-900 text-white font-semibold hover:opacity-90"
                    >
                      Questionnaire
                    </a>
                  ) : (
                    <span className="px-4 py-2 rounded-xl bg-gray-100 text-gray-400 font-semibold">
                      Questionnaire
                    </span>
                  )}

                  {st ? (
                    <a
                      href={st}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-gray-900 text-white font-semibold hover:opacity-90"
                    >
                      Staff
                    </a>
                  ) : (
                    <span className="px-4 py-2 rounded-xl bg-gray-100 text-gray-400 font-semibold">
                      Staff
                    </span>
                  )}
                </div>

                <div className="mt-3 flex gap-3">
                  {tw && (
                    <a
                      href={tw}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-black transition"
                      aria-label="Twitter/X"
                      title="Twitter/X"
                    >
                      <SocialIconX />
                    </a>
                  )}

                  {ig && (
                    <a
                      href={ig}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-black transition"
                      aria-label="Instagram"
                      title="Instagram"
                    >
                      <SocialIconInstagram />
                    </a>
                  )}

                  {fb && (
                    <a
                      href={fb}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-black transition"
                      aria-label="Facebook"
                      title="Facebook"
                    >
                      <SocialIconFacebook />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="w-full overflow-x-auto [-webkit-overflow-scrolling:touch]">
            <table className="min-w-[1180px] w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="px-4 py-3 font-extrabold">School</th>
                  <th className="px-4 py-3 font-extrabold">Division</th>
                  <th className="px-4 py-3 font-extrabold">Conference</th>
                  <th className="px-4 py-3 font-extrabold text-center">School Site</th>
                  <th className="px-4 py-3 font-extrabold text-center">Team Site</th>
                  <th className="px-4 py-3 font-extrabold text-center">Questionnaire</th>
                  <th className="px-4 py-3 font-extrabold text-center">Staff</th>
                  <th className="px-4 py-3 font-extrabold text-center">X</th>
                  <th className="px-4 py-3 font-extrabold text-center">IG</th>
                  <th className="px-4 py-3 font-extrabold text-center">FB</th>
                  <th className="px-4 py-3 font-extrabold text-center">Fav</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, idx) => {
                  const sSite = normalizeUrl(schoolSite(r));
                  const tSite = normalizeUrl(teamSite(r));
                  const q = normalizeUrl(questionnaire(r));
                  const st = normalizeUrl(staff(r));
                  const tw = normalizeUrl(twitter(r));
                  const ig = normalizeUrl(instagram(r));
                  const fb = normalizeUrl(facebook(r));

                  const key = favKey(r) || `${tab}__${idx}`;
                  const isFav = favorites.has(key);

                  return (
                    <tr key={key} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                      <td className="px-4 py-3 font-semibold text-gray-900">{school(r) || "—"}</td>
                      <td className="px-4 py-3 text-gray-700">{division(r) || "—"}</td>
                      <td className="px-4 py-3 text-gray-700">{conference(r) || "—"}</td>

                      <td className="px-4 py-3 text-center">
                        {sSite ? (
                          <a
                            href={sSite}
                            target="_blank"
                            rel="noreferrer"
                            className="text-red-700 font-extrabold hover:underline"
                          >
                            Open
                          </a>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {tSite ? (
                          <a
                            href={tSite}
                            target="_blank"
                            rel="noreferrer"
                            className="text-red-700 font-extrabold hover:underline"
                          >
                            Open
                          </a>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {q ? (
                          <a
                            href={q}
                            target="_blank"
                            rel="noreferrer"
                            className="text-red-700 font-extrabold hover:underline"
                          >
                            Open
                          </a>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {st ? (
                          <a
                            href={st}
                            target="_blank"
                            rel="noreferrer"
                            className="text-red-700 font-extrabold hover:underline"
                          >
                            Open
                          </a>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {tw ? (
                          <a
                            href={tw}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center p-1 rounded text-gray-700 hover:text-black hover:bg-gray-100 transition"
                            aria-label="Twitter/X"
                            title="Twitter/X"
                          >
                            <SocialIconX />
                          </a>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {ig ? (
                          <a
                            href={ig}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center p-1 rounded text-gray-700 hover:text-black hover:bg-gray-100 transition"
                            aria-label="Instagram"
                            title="Instagram"
                          >
                            <SocialIconInstagram />
                          </a>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {fb ? (
                          <a
                            href={fb}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center p-1 rounded text-gray-700 hover:text-black hover:bg-gray-100 transition"
                            aria-label="Facebook"
                            title="Facebook"
                          >
                            <SocialIconFacebook />
                          </a>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => onToggleFavorite(r)}
                          className={[
                            "inline-flex items-center justify-center w-9 h-9 rounded-lg border transition",
                            isFav
                              ? "bg-gray-900 text-white border-gray-900"
                              : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100",
                          ].join(" ")}
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

          <div className="px-4 py-3 text-xs text-gray-500 border-t bg-white md:hidden">
            Tip: swipe left/right to see all columns.
          </div>
        </div>
      )}
    </section>
  );
}
