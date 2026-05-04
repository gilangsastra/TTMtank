"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useCompare } from "@/components/compare/CompareProvider";
import { useProducts } from "@/components/products/ProductsProvider";
import { buildCompareUrl, MIN_COMPARE } from "@/lib/compare";
import { cn } from "@/lib/cn";

export function CompareBar() {
  const pathname = usePathname();
  const products = useProducts();
  const { selection, remove, clear } = useCompare();

  if (pathname === "/bandingkan") return null;
  if (selection.length === 0) return null;

  const items = selection
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const canCompare = items.length >= MIN_COMPARE;
  const remaining = MIN_COMPARE - items.length;

  return (
    <div
      role="region"
      aria-label="Daftar produk untuk dibandingkan"
      className="fixed inset-x-4 bottom-4 z-40 sm:bottom-6 sm:left-1/2 sm:right-auto sm:w-[calc(100%-3rem)] sm:max-w-2xl sm:-translate-x-1/2"
    >
      <div className="rounded-[var(--radius-lg)] border border-white/10 bg-[var(--color-ink)] text-[var(--color-paper)] shadow-xl">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
              Bandingkan ({items.length}/4)
            </span>
            <ul className="flex min-w-0 items-center gap-2 overflow-x-auto">
              {items.map((p) => (
                <li key={p.slug} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => remove(p.slug)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs transition hover:bg-white/20"
                    aria-label={`Hapus ${p.name} dari perbandingan`}
                  >
                    <span className="max-w-[120px] truncate">{p.name}</span>
                    <X className="h-3 w-3" strokeWidth={2} aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={clear}
              className="hidden text-xs text-white/60 transition hover:text-white sm:inline"
            >
              Reset
            </button>
            <Link
              href={buildCompareUrl(items.map((p) => p.slug))}
              aria-disabled={!canCompare}
              className={cn(
                "inline-flex h-9 items-center rounded-[var(--radius-sm)] bg-[var(--color-paper)] px-4 text-xs font-medium text-[var(--color-ink)] transition",
                canCompare ? "hover:bg-white" : "pointer-events-none opacity-40",
              )}
            >
              {canCompare ? "Bandingkan" : `Pilih ${remaining} lagi`}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
