import Link from "next/link";

export function EmptyState() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-white px-8 py-16 text-center">
      <p className="text-[15px] font-medium">Tidak ada produk yang cocok</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-ink-soft)]">
        Coba kurangi filter, atau lihat seluruh produk kami untuk
        membandingkan opsi yang tersedia.
      </p>
      <Link
        href="/produk"
        className="mt-6 inline-flex items-center text-sm font-medium underline underline-offset-4 hover:text-[var(--color-accent)]"
      >
        Reset filter
      </Link>
    </div>
  );
}
