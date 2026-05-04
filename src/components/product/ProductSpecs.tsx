import type { Product } from "@/data/products";
import { formatLiter } from "@/lib/format";

const numberFormatter = new Intl.NumberFormat("id-ID");

function formatDimensions(d: Product["dimensions"]): string {
  return `Ø ${numberFormatter.format(d.diameterCm)} × ${numberFormatter.format(
    d.heightCm,
  )} cm`;
}

export function ProductSpecs({ product: p }: { product: Product }) {
  const rows: { label: string; value: string }[] = [
    { label: "Kapasitas", value: formatLiter(p.capacityLiters) },
    { label: "Material", value: p.material },
    { label: "Dimensi", value: formatDimensions(p.dimensions) },
    { label: "Garansi", value: `${p.warrantyYears} tahun` },
    { label: "Jenis Penggunaan", value: p.useCase },
    { label: "Sertifikasi", value: p.certifications.join(" · ") },
  ];

  return (
    <dl className="divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
      {rows.map((r) => (
        <div
          key={r.label}
          className="grid grid-cols-[140px_1fr] gap-4 py-3.5 text-sm"
        >
          <dt className="text-[var(--color-ink-soft)]">{r.label}</dt>
          <dd className="text-[var(--color-ink)]">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
