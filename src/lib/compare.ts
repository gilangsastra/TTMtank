export const MAX_COMPARE = 4;
export const MIN_COMPARE = 2;
export const COMPARE_STORAGE_KEY = "ttm:compare";

type RawSearchParams = Record<string, string | string[] | undefined>;

/**
 * Parses ?p=slug1&p=slug2 into a list of slugs. Whitelisting against the
 * actual catalog is done by the calling page (server-side, async).
 *
 * This function only enforces dedup and the MAX_COMPARE cap.
 */
export function parseCompareSlugsRaw(sp: RawSearchParams): string[] {
  const raw = sp.p;
  if (!raw) return [];
  const arr = Array.isArray(raw) ? raw : [raw];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of arr) {
    if (typeof v !== "string") continue;
    if (seen.has(v)) continue;
    seen.add(v);
    out.push(v);
    if (out.length >= MAX_COMPARE) break;
  }
  return out;
}

export function buildCompareUrl(slugs: string[]): string {
  if (slugs.length === 0) return "/bandingkan";
  const params = new URLSearchParams();
  for (const s of slugs) params.append("p", s);
  return `/bandingkan?${params.toString()}`;
}
