import { Container } from "@/components/ui/Container";
import { Filters } from "@/components/product/Filters";
import { SortSelect } from "@/components/product/SortSelect";
import { ProductCard } from "@/components/product/ProductCard";
import { EmptyState } from "@/components/product/EmptyState";
import { safeGetAllProducts } from "@/lib/products-repo";
import { parseProductFilters } from "@/lib/search-params";
import { applyFilters } from "@/lib/filter-products";

export const metadata = {
  title: "Produk",
  description:
    "Jelajahi koleksi tangki air TTM Tank — Polyethylene, Stainless Steel, dan Fiberglass dengan kapasitas 500 hingga 10.000 liter.",
};

type SearchParams = Record<string, string | string[] | undefined>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const filters = parseProductFilters(sp);
  const products = await safeGetAllProducts();
  const filtered = applyFilters(products, filters);

  return (
    <Container className="py-16 sm:py-20">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
          Katalog
        </p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
          Pilih tangki yang tepat.
        </h1>
        <p className="mt-4 text-[var(--color-ink-soft)]">
          Saring berdasarkan material, kapasitas, dan harga. Semua produk
          dilengkapi garansi resmi dan pengiriman ke seluruh Indonesia.
        </p>
      </header>

      <div className="mt-12 grid gap-10 md:grid-cols-[240px_1fr] md:gap-14">
        <details
          className="md:hidden border-b border-[var(--color-line)] pb-6"
          open={false}
        >
          <summary className="cursor-pointer list-none text-sm font-medium">
            <span className="inline-flex items-center gap-2">
              Tampilkan Filter
              <span aria-hidden>↓</span>
            </span>
          </summary>
          <div className="mt-6">
            <Filters />
          </div>
        </details>

        <div className="hidden md:block">
          <Filters />
        </div>

        <div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-[var(--color-ink-soft)]">
              {filtered.length} produk
            </p>
            <SortSelect />
          </div>

          {filtered.length === 0 ? (
            <div className="mt-8">
              <EmptyState />
            </div>
          ) : (
            <ul className="mt-8 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p, i) => (
                <li key={p.slug}>
                  <ProductCard product={p} priority={i < 3} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Container>
  );
}
