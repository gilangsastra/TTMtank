"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { materials, capacityBuckets } from "@/lib/product-meta";
import { cn } from "@/lib/cn";

export function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const selectedMaterials = searchParams.getAll("material");
  const selectedBuckets = searchParams.getAll("capacity");
  const priceMin = searchParams.get("priceMin") ?? "";
  const priceMax = searchParams.get("priceMax") ?? "";

  function pushParams(next: URLSearchParams) {
    const qs = next.toString();
    startTransition(() => {
      router.replace(qs ? `/produk?${qs}` : "/produk", { scroll: false });
    });
  }

  function toggleMulti(key: "material" | "capacity", value: string) {
    const next = new URLSearchParams(searchParams.toString());
    const current = next.getAll(key);
    next.delete(key);
    if (current.includes(value)) {
      current.filter((v) => v !== value).forEach((v) => next.append(key, v));
    } else {
      [...current, value].forEach((v) => next.append(key, v));
    }
    pushParams(next);
  }

  function setPrice(key: "priceMin" | "priceMax", value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value === "") next.delete(key);
    else next.set(key, value);
    pushParams(next);
  }

  function reset() {
    startTransition(() => {
      router.replace("/produk", { scroll: false });
    });
  }

  const hasFilters =
    selectedMaterials.length > 0 ||
    selectedBuckets.length > 0 ||
    priceMin !== "" ||
    priceMax !== "";

  return (
    <aside
      className={cn(
        "text-sm",
        isPending && "opacity-60 transition-opacity",
      )}
      aria-label="Filter produk"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
          Filter
        </h2>
        {hasFilters ? (
          <button
            type="button"
            onClick={reset}
            className="text-xs text-[var(--color-ink-soft)] underline-offset-4 hover:text-[var(--color-ink)] hover:underline"
          >
            Reset
          </button>
        ) : null}
      </div>

      <FilterGroup label="Material">
        {materials.map((m) => (
          <CheckboxRow
            key={m}
            label={m}
            checked={selectedMaterials.includes(m)}
            onChange={() => toggleMulti("material", m)}
          />
        ))}
      </FilterGroup>

      <FilterGroup label="Kapasitas">
        {capacityBuckets.map((b) => (
          <CheckboxRow
            key={b.id}
            label={b.label}
            checked={selectedBuckets.includes(b.id)}
            onChange={() => toggleMulti("capacity", b.id)}
          />
        ))}
      </FilterGroup>

      <FilterGroup label="Harga (Rupiah)">
        <div className="grid grid-cols-2 gap-2">
          <PriceInput
            label="Min"
            value={priceMin}
            onChange={(v) => setPrice("priceMin", v)}
          />
          <PriceInput
            label="Max"
            value={priceMax}
            onChange={(v) => setPrice("priceMax", v)}
          />
        </div>
      </FilterGroup>
    </aside>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8 border-t border-[var(--color-line)] pt-6">
      <p className="mb-3 text-[13px] font-semibold">{label}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 cursor-pointer accent-[var(--color-ink)]"
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}

function PriceInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs text-[var(--color-ink-soft)]">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        step={50000}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className="mt-1 w-full rounded-[var(--radius-sm)] border border-[var(--color-line)] bg-white px-3 py-2 text-sm tabular-nums focus:border-[var(--color-ink)] focus:outline-none"
      />
    </label>
  );
}
