"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { sortOptions } from "@/lib/product-meta";

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const current = searchParams.get("sort") ?? "default";

  function onChange(value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value === "default") next.delete("sort");
    else next.set("sort", value);
    const qs = next.toString();
    startTransition(() => {
      router.replace(qs ? `/produk?${qs}` : "/produk", { scroll: false });
    });
  }

  return (
    <label className="flex items-center gap-3 text-sm text-[var(--color-ink-soft)]">
      <span>Urutkan</span>
      <select
        value={current}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-[var(--radius-sm)] border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-1.5 text-sm text-[var(--color-ink)] focus:border-[var(--color-ink)] focus:outline-none"
        aria-label="Urutkan produk"
      >
        {sortOptions.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
