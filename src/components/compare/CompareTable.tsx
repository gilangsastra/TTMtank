import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import type { Product } from "@/data/products";
import { formatLiter, formatRupiah } from "@/lib/format";
import { buildCompareUrl } from "@/lib/compare";
import { buildWhatsAppLink, buildProductInquiryMessage } from "@/lib/whatsapp";

const numberFormatter = new Intl.NumberFormat("id-ID");

type SpecRow = {
  label: string;
  get: (p: Product) => string;
};

const SPEC_ROWS: readonly SpecRow[] = [
  { label: "Kapasitas", get: (p) => formatLiter(p.capacityLiters) },
  { label: "Harga", get: (p) => formatRupiah(p.priceIDR) },
  { label: "Material", get: (p) => p.material },
  {
    label: "Dimensi",
    get: (p) =>
      `Ø ${numberFormatter.format(p.dimensions.diameterCm)} × ${numberFormatter.format(p.dimensions.heightCm)} cm`,
  },
  { label: "Garansi", get: (p) => `${p.warrantyYears} tahun` },
  { label: "Jenis Penggunaan", get: (p) => p.useCase },
  { label: "Sertifikasi", get: (p) => p.certifications.join(" · ") },
] as const;

export function CompareTable({ items }: { items: Product[] }) {
  const slugs = items.map((p) => p.slug);
  const gridStyle = {
    gridTemplateColumns: `140px repeat(${items.length}, minmax(180px, 1fr))`,
  };

  return (
    <div className="-mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0">
      <div className="grid min-w-fit" style={gridStyle}>
        <StickyLabel className="border-b border-[var(--color-line)]" />
        {items.map((p) => (
          <HeaderCell key={p.slug} product={p} slugs={slugs} />
        ))}

        {SPEC_ROWS.map((row) => (
          <Fragment key={row.label}>
            <StickyLabel className="border-b border-[var(--color-line)] py-4 text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-ink-soft)]">
              {row.label}
            </StickyLabel>
            {items.map((p) => (
              <Cell
                key={p.slug}
                className="border-b border-[var(--color-line)] py-4 text-sm tabular-nums"
              >
                {row.get(p)}
              </Cell>
            ))}
          </Fragment>
        ))}

        <StickyLabel />
        {items.map((p) => (
          <Cell key={p.slug} className="pt-6">
            <a
              href={buildWhatsAppLink(buildProductInquiryMessage(p))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-ink)] px-4 text-xs font-medium text-[var(--color-paper)] transition hover:bg-[var(--color-accent)]"
            >
              Chat WhatsApp
            </a>
          </Cell>
        ))}
      </div>
    </div>
  );
}

function HeaderCell({
  product: p,
  slugs,
}: {
  product: Product;
  slugs: string[];
}) {
  const removeUrl = buildCompareUrl(slugs.filter((s) => s !== p.slug));

  return (
    <div className="border-b border-[var(--color-line)] px-3 pb-6 pt-2">
      <div className="flex justify-end">
        <Link
          href={removeUrl}
          replace
          aria-label={`Hapus ${p.name} dari perbandingan`}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[var(--color-ink-soft)] transition hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-ink)]"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        </Link>
      </div>
      <Link href={`/produk/${p.slug}`} className="group block">
        <div className="relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)] bg-white">
          <Image
            src={p.imageUrl}
            alt={p.name}
            fill
            sizes="200px"
            className="object-contain p-5 transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <p className="mt-3 text-sm font-medium leading-tight transition group-hover:text-[var(--color-accent)]">
          {p.name}
        </p>
      </Link>
    </div>
  );
}

function StickyLabel({
  className = "",
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`sticky left-0 z-[1] bg-[var(--color-paper)] pr-4 ${className}`}
    >
      {children}
    </div>
  );
}

function Cell({
  className = "",
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return <div className={`px-3 ${className}`}>{children}</div>;
}
