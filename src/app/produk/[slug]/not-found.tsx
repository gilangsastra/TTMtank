import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="py-32 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
        404
      </p>
      <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
        Produk tidak ditemukan
      </h1>
      <p className="mx-auto mt-4 max-w-md text-[var(--color-ink-soft)]">
        Halaman yang Anda cari mungkin sudah dipindahkan atau tidak tersedia.
        Silakan kembali ke daftar produk.
      </p>
      <Link
        href="/produk"
        className="mt-8 inline-flex h-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-ink)] px-7 text-[15px] font-medium text-[var(--color-paper)] transition hover:bg-[var(--color-accent)]"
      >
        Lihat semua produk
      </Link>
    </Container>
  );
}
