import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const metadata = { title: "Halaman tidak ditemukan" };

export default function NotFound() {
  return (
    <Container className="py-32 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
        404
      </p>
      <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
        Halaman tidak ditemukan
      </h1>
      <p className="mx-auto mt-4 max-w-md text-[var(--color-ink-soft)]">
        Halaman yang Anda cari mungkin sudah dipindahkan atau tidak tersedia.
        Silakan kembali ke beranda atau jelajahi katalog kami.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-[var(--radius-md)] bg-[var(--color-ink)] px-6 text-sm font-medium text-[var(--color-paper)] hover:bg-[var(--color-accent)]"
        >
          Beranda
        </Link>
        <Link
          href="/produk"
          className="inline-flex h-11 items-center rounded-[var(--radius-md)] border border-[var(--color-line)] px-6 text-sm font-medium hover:border-[var(--color-ink)]"
        >
          Lihat Produk
        </Link>
      </div>
    </Container>
  );
}
