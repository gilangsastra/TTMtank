import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CompareTable } from "@/components/compare/CompareTable";
import { safeGetAllProducts } from "@/lib/products-repo";
import {
  parseCompareSlugsRaw,
  MIN_COMPARE,
  MAX_COMPARE,
} from "@/lib/compare";

export const metadata = {
  title: "Bandingkan Produk",
  description:
    "Bandingkan tangki air TTM Tank secara berdampingan — kapasitas, harga, material, dimensi, dan garansi.",
};

type SearchParams = Record<string, string | string[] | undefined>;

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const requested = parseCompareSlugsRaw(sp);

  const all = await safeGetAllProducts();
  const bySlug = new Map(all.map((p) => [p.slug, p]));
  const items = requested
    .map((slug) => bySlug.get(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const enough = items.length >= MIN_COMPARE;

  return (
    <Container className="py-16 sm:py-20">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
          Perbandingan
        </p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
          Bandingkan tangki sebelum membeli.
        </h1>
        <p className="mt-4 text-[var(--color-ink-soft)]">
          Pilih hingga {MAX_COMPARE} tangki dari halaman produk untuk melihat
          spesifikasi berdampingan.
        </p>
      </header>

      <div className="mt-12">
        {enough ? (
          <CompareTable items={items} />
        ) : (
          <EmptyCompareState count={items.length} />
        )}
      </div>
    </Container>
  );
}

function EmptyCompareState({ count }: { count: number }) {
  const remaining = MIN_COMPARE - count;
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-white px-8 py-16 text-center">
      <p className="text-[15px] font-medium">
        {count === 0
          ? "Belum ada produk untuk dibandingkan"
          : `Pilih ${remaining} produk lagi untuk membandingkan`}
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-ink-soft)]">
        Buka halaman produk dan klik tombol &ldquo;Bandingkan&rdquo; pada
        minimal {MIN_COMPARE} tangki yang Anda pertimbangkan. Pilihan tersimpan
        otomatis selama Anda menjelajah.
      </p>
      <Link
        href="/produk"
        className="mt-6 inline-flex h-11 items-center rounded-[var(--radius-md)] bg-[var(--color-ink)] px-6 text-sm font-medium text-[var(--color-paper)] transition hover:bg-[var(--color-accent)]"
      >
        Lihat Produk
      </Link>
    </div>
  );
}
