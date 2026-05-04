import {
  materials,
  capacityBuckets,
  sortOptions,
  type SortId,
} from "@/lib/product-meta";

export type ProductFilters = {
  materials: string[];
  capacityBucketIds: string[];
  priceMin?: number;
  priceMax?: number;
  sort: SortId;
};

type RawSearchParams = Record<string, string | string[] | undefined>;

function asArray(v: string | string[] | undefined): string[] {
  if (v === undefined) return [];
  return Array.isArray(v) ? v : [v];
}

function asPositiveNumber(v: string | string[] | undefined): number | undefined {
  if (typeof v !== "string") return undefined;
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0) return undefined;
  // Clamp upper bound — defensive against very large user input.
  return Math.min(n, 1_000_000_000);
}

const validMaterials = new Set<string>(materials);
const validBucketIds = new Set<string>(capacityBuckets.map((b) => b.id));
const validSorts = new Set<string>(sortOptions.map((s) => s.id));

/**
 * Parses Next.js searchParams into a strongly-typed filter object.
 * Unknown values are silently dropped — never trust URL input.
 */
export function parseProductFilters(sp: RawSearchParams): ProductFilters {
  const sortRaw = typeof sp.sort === "string" ? sp.sort : "default";
  return {
    materials: asArray(sp.material).filter((m) => validMaterials.has(m)),
    capacityBucketIds: asArray(sp.capacity).filter((c) => validBucketIds.has(c)),
    priceMin: asPositiveNumber(sp.priceMin),
    priceMax: asPositiveNumber(sp.priceMax),
    sort: validSorts.has(sortRaw) ? (sortRaw as SortId) : "default",
  };
}
