import Papa from "papaparse";
import type { CoachRow } from "./types";

function norm(s: unknown): string {
  if (typeof s !== "string") return "";
  return s.trim();
}

function asUrl(s: string): string | undefined {
  const v = s.trim();
  if (!v) return undefined;
  if (/^https?:\/\//i.test(v)) return v;
  return undefined;
}

function getField(row: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    if (k in row) return norm(row[k]);
  }
  const map = new Map(Object.keys(row).map((k) => [k.toLowerCase(), k]));
  for (const k of keys) {
    const hit = map.get(k.toLowerCase());
    if (hit) return norm(row[hit]);
  }
  return "";
}

export async function loadCoachRows(csvUrl: string): Promise<CoachRow[]> {
  if (!csvUrl.trim()) {
    throw new Error("Missing CSV URL for this tab. Add it in src/config/tabs.ts");
  }

  const resp = await fetch(csvUrl.trim(), { cache: "no-store" });
  if (!resp.ok) throw new Error(`CSV fetch failed (${resp.status})`);
  const text = await resp.text();

  const parsed = Papa.parse<Record<string, unknown>>(text, {
    header: true,
    skipEmptyLines: true
  });

  if (parsed.errors?.length) {
    const first = parsed.errors[0];
    throw new Error(`CSV parse error: ${first.message}`);
  }

  let lastConference = "";
  const rows: CoachRow[] = [];

  for (const r of parsed.data ?? []) {
    const conferenceRaw = getField(r, ["Conference"]);
    const school = getField(r, ["School"]);
    if (!school) continue;

    const conference = conferenceRaw || lastConference || "Unknown";
    lastConference = conference;

    const website = asUrl(getField(r, ["School Website", "Website"]));
    const questionnaire = asUrl(getField(r, ["Recruiting Questionnaire", "Questionnaire"]));
    const staff = asUrl(getField(r, ["Staff Directory", "Staff"]));

    rows.push({
      conference,
      school,
      website,
      questionnaire,
      staff,

      // legacy key names
      schoolWebsite: website,
      recruitingQuestionnaire: questionnaire,
      staffDirectory: staff,

      // optional future fields
      headCoach: getField(r, ["Head Coach", "Coach"]) || undefined,
      email: getField(r, ["Email", "E-mail"]) || undefined,
      phone: getField(r, ["Phone"]) || undefined
    });
  }

  return rows;
}
