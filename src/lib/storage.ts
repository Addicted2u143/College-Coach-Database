const FAV_KEY = "ccd:favorites:v1";

export function loadFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((x) => typeof x === "string"));
  } catch {
    return new Set();
  }
}

export function saveFavorites(favs: Set<string>): void {
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify(Array.from(favs)));
  } catch {
    // ignore
  }
}
