import type { Track } from "./roomStore";

export async function fetchTracksForCategory(
  query: string,
  limit = 150,
  opts?: { categoryGenres?: string[] | null }
): Promise<Track[]> {
  const url = new URL("https://itunes.apple.com/search");
  url.searchParams.set("media", "music");
  url.searchParams.set("entity", "song");
  url.searchParams.set("limit", String(Math.min(200, limit)));
  url.searchParams.set("term", query);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`iTunes search failed: ${res.status}`);
  const data = await res.json();

  let items: any[] = Array.isArray(data?.results) ? data.results : [];

  // preview only
  items = items.filter((t) => typeof t?.previewUrl === "string" && t.previewUrl.length > 0);

  // ✅ genre filter (optional)
  const allowed = (opts?.categoryGenres ?? null)?.map((g) => g.toLowerCase()) ?? null;
  if (allowed && allowed.length > 0) {
    const filtered = items.filter((t) => {
      const g = String(t?.primaryGenreName ?? "").toLowerCase();
      return allowed.includes(g);
    });
    if (filtered.length >= 12) items = filtered;
  }

  return items.map((t) => ({
    id: String(t.trackId),                 // ✅ tärkeä
    title: String(t.trackName ?? ""),
    artist: String(t.artistName ?? ""),
    previewUrl: String(t.previewUrl ?? ""),
    genre: t.primaryGenreName ? String(t.primaryGenreName) : undefined,
  }));
}
