import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/data/products";
import { formatLiter, formatRupiah } from "@/lib/format";
import { CompareButton } from "@/components/compare/CompareButton";

type Props = {
  product: Product;
  priority?: boolean;
};

export function ProductCard({ product: p, priority = false }: Props) {
  return (
    <article>
      <Link
        href={`/produk/${p.slug}`}
        className="group block focus-visible:outline-none"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-white">
          <Image
            src={p.imageUrl}
            alt={p.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-8 transition duration-500 group-hover:scale-[1.03]"
          />
          {p.highlight ? (
            <span className="absolute left-4 top-4 rounded-[var(--radius-sm)] bg-[var(--color-ink)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-[var(--color-paper)]">
              {p.highlight}
            </span>
          ) : null}
        </div>

        <div className="mt-5 space-y-1.5">
          <p className="text-[15px] font-medium">{p.name}</p>
          <p className="text-sm text-[var(--color-ink-soft)]">
            {formatLiter(p.capacityLiters)} · {p.material}
          </p>
          <p className="text-sm">
            Mulai <span className="font-medium">{formatRupiah(p.priceIDR)}</span>
          </p>
          <p className="text-xs text-[var(--color-ink-soft)]">
            Garansi {p.warrantyYears} tahun · {p.useCase}
          </p>
        </div>
      </Link>

      <div className="mt-3">
        <CompareButton slug={p.slug} />
      </div>
    </article>
  );
}
