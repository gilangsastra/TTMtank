import type { Product } from "@/data/products";
import { capacityBuckets } from "@/lib/product-meta";
import type { ProductFilters } from "@/lib/search-params";

/**
 * Pure filter + sort function. No React, no I/O — easy to test.
 */
export function applyFilters(
  products: readonly Product[],
  f: ProductFilters,
): Product[] {
  const buckets = capacityBuckets.filter((b) => f.capacityBucketIds.includes(b.id));

  const filtered = products.filter((p) => {
    if (f.materials.length > 0 && !f.materials.includes(p.material)) return false;

    if (buckets.length > 0) {
      const matchesAny = buckets.some(
        (b) => p.capacityLiters >= b.min && p.capacityLiters < b.max,
      );
      if (!matchesAny) return false;
    }

    if (f.priceMin !== undefined && p.priceIDR < f.priceMin) return false;
    if (f.priceMax !== undefined && p.priceIDR > f.priceMax) return false;

    return true;
  });

  switch (f.sort) {
    case "price-asc":
      return filtered.sort((a, b) => a.priceIDR - b.priceIDR);
    case "price-desc":
      return filtered.sort((a, b) => b.priceIDR - a.priceIDR);
    case "capacity-asc":
      return filtered.sort((a, b) => a.capacityLiters - b.capacityLiters);
    case "capacity-desc":
      return filtered.sort((a, b) => b.capacityLiters - a.capacityLiters);
    default:
      return filtered;
  }
}
