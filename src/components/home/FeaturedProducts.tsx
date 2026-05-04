import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/data/products";

export function FeaturedProducts({ products }: { products: Product[] }) {
  const featured = products.slice(0, 4);
  if (featured.length === 0) return null;

  return (
    <section aria-labelledby="featured-heading">
      <Container className="py-24">
        <div className="flex items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
              Produk Pilihan
            </p>
            <h2
              id="featured-heading"
              className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl"
            >
              Tangki untuk setiap kebutuhan.
            </h2>
          </div>
          <Link
            href="/produk"
            className="hidden items-center gap-1 text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition sm:inline-flex"
          >
            Lihat semua
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <li key={p.slug}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>

        <div className="mt-10 sm:hidden">
          <Link
            href="/produk"
            className="inline-flex items-center gap-1 text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition"
          >
            Lihat semua produk
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </Container>
    </section>
  );
}
