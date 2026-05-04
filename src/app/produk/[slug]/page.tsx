import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ShieldCheck, Truck, MessagesSquare, ChevronLeft } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { ProductSpecs } from "@/components/product/ProductSpecs";
import type { Product } from "@/data/products";
import { safeGetAllProducts, getProductBySlug } from "@/lib/products-repo";
import { formatLiter, formatRupiah } from "@/lib/format";
import {
  buildWhatsAppLink,
  buildProductInquiryMessage,
  buildProductQuoteMessage,
} from "@/lib/whatsapp";
import { site } from "@/config/site";

type RouteParams = { slug: string };

// Pre-render every product page at build time (zero runtime DB cost).
export async function generateStaticParams(): Promise<RouteParams[]> {
  const all = await safeGetAllProducts();
  return all.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Produk tidak ditemukan" };

  const title = `${p.name} — ${formatLiter(p.capacityLiters)}`;
  const description = `${p.description.slice(0, 150)}…`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: p.imageUrl, width: 1200, height: 1500, alt: p.name }],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <Container className="py-10 sm:py-14">
      <Breadcrumbs product={product} />

      <div className="mt-8 grid gap-12 md:grid-cols-2 md:gap-16 lg:gap-20">
        <ProductImage product={product} />
        <ProductInfo product={product} />
      </div>

      <ProductLongInfo product={product} />

      <JsonLd product={product} />
    </Container>
  );
}

function Breadcrumbs({ product }: { product: Product }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-[var(--color-ink-soft)]">
        <li>
          <Link
            href="/produk"
            className="inline-flex items-center gap-1 hover:text-[var(--color-ink)] transition"
          >
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
            Produk
          </Link>
        </li>
        <li aria-hidden>·</li>
        <li className="text-[var(--color-ink)]">{product.name}</li>
      </ol>
    </nav>
  );
}

function ProductImage({ product: p }: { product: Product }) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-white md:aspect-[4/5]">
      <Image
        src={p.imageUrl}
        alt={p.name}
        fill
        priority
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-contain p-12"
      />
      {p.highlight ? (
        <span className="absolute left-5 top-5 rounded-[var(--radius-sm)] bg-[var(--color-ink)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-[var(--color-paper)]">
          {p.highlight}
        </span>
      ) : null}
    </div>
  );
}

function ProductInfo({ product: p }: { product: Product }) {
  const inquiryHref = buildWhatsAppLink(buildProductInquiryMessage(p));
  const quoteHref = `/kontak?produk=${encodeURIComponent(p.slug)}`;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
        {p.useCase}
      </p>
      <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
        {p.name}
      </h1>
      <p className="mt-3 text-[var(--color-ink-soft)]">
        {formatLiter(p.capacityLiters)} · {p.material}
      </p>

      <p className="mt-6 text-2xl font-medium tabular-nums sm:text-3xl">
        {formatRupiah(p.priceIDR)}
      </p>
      <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
        Belum termasuk ongkir & instalasi. Konfirmasi via WhatsApp.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <LinkButton
          href={inquiryHref}
          target="_blank"
          rel="noopener noreferrer"
          size="lg"
        >
          <MessagesSquare className="h-4 w-4" aria-hidden />
          Chat WhatsApp
        </LinkButton>
        <Link
          href={quoteHref}
          className="inline-flex h-12 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-line)] bg-transparent px-7 text-[15px] font-medium text-[var(--color-ink)] transition hover:border-[var(--color-ink)]"
        >
          Minta Penawaran
        </Link>
      </div>

      <ul className="mt-8 space-y-2.5 text-sm">
        <TrustRow icon={ShieldCheck}>
          Garansi resmi {p.warrantyYears} tahun
        </TrustRow>
        <TrustRow icon={Truck}>
          Pengiriman ke seluruh Indonesia, tersedia jasa instalasi
        </TrustRow>
        <TrustRow icon={Check}>
          Konsultasi gratis dengan tim teknis sebelum pembelian
        </TrustRow>
      </ul>

      <div className="mt-10">
        <ProductSpecs product={p} />
      </div>
    </div>
  );
}

function TrustRow({
  icon: Icon,
  children,
}: {
  icon: typeof Check;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3 text-[var(--color-ink-soft)]">
      <Icon
        className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]"
        strokeWidth={1.75}
        aria-hidden
      />
      <span>{children}</span>
    </li>
  );
}

function ProductLongInfo({ product: p }: { product: Product }) {
  return (
    <section className="mt-20 grid gap-12 border-t border-[var(--color-line)] pt-16 md:grid-cols-2 md:gap-16">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
          Tentang Produk
        </p>
        <h2 className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl">
          Untuk siapa produk ini.
        </h2>
        <p className="mt-6 text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
          {p.description}
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
          Keunggulan
        </p>
        <ul className="mt-6 space-y-3.5">
          {p.features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-[15px]">
              <Check
                className="mt-1 h-4 w-4 shrink-0 text-[var(--color-accent)]"
                strokeWidth={1.75}
                aria-hidden
              />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function JsonLd({ product: p }: { product: Product }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    image: `${site.url}${p.imageUrl}`,
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      url: `${site.url}/produk/${p.slug}`,
      priceCurrency: "IDR",
      price: p.priceIDR,
      availability: "https://schema.org/InStock",
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Kapasitas", value: `${p.capacityLiters} L` },
      { "@type": "PropertyValue", name: "Material", value: p.material },
      { "@type": "PropertyValue", name: "Garansi", value: `${p.warrantyYears} tahun` },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Server-rendered, no user input — XSS-safe.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
