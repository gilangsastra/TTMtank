"use client";

import { Check, Plus } from "lucide-react";
import { useCompare } from "@/components/compare/CompareProvider";
import { cn } from "@/lib/cn";

export function CompareButton({ slug }: { slug: string }) {
  const { isSelected, toggle, canAddMore } = useCompare();
  const selected = isSelected(slug);
  const disabled = !selected && !canAddMore;

  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      disabled={disabled}
      aria-pressed={selected}
      title={
        disabled
          ? "Maksimal 4 produk untuk perbandingan"
          : selected
            ? "Hapus dari perbandingan"
            : "Tambah ke perbandingan"
      }
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:rounded-sm",
        selected
          ? "text-[var(--color-accent)]"
          : "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      {selected ? (
        <>
          <Check className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          Terpilih untuk dibandingkan
        </>
      ) : (
        <>
          <Plus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          Bandingkan
        </>
      )}
    </button>
  );
}
