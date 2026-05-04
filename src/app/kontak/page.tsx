import { Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { InquiryForm } from "./InquiryForm";
import { safeGetAllProducts } from "@/lib/products-repo";
import { site } from "@/config/site";
import { buildWhatsAppLink, defaultInquiryMessage } from "@/lib/whatsapp";
import { formatLiter } from "@/lib/format";

export const metadata = {
  title: "Kontak",
  description:
    "Hubungi tim TTM Tank untuk konsultasi produk, permintaan penawaran, dan dukungan instalasi. Tersedia via WhatsApp atau formulir.",
};

type SearchParams = Record<string, string | string[] | undefined>;

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const slug = typeof sp.produk === "string" ? sp.produk : undefined;
  const products = await safeGetAllProducts();
  const product = slug ? products.find((p) => p.slug === slug) : undefined;

  const defaultMessage = product
    ? `Saya tertarik dengan ${product.name} (${formatLiter(product.capacityLiters)}, ${product.material}). ` +
      `Mohon penawaran resmi termasuk ongkir dan estimasi instalasi.`
    : "";

  return (
    <Container className="py-16 sm:py-20">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
          Kontak
        </p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
          Bantu kami pahami kebutuhan Anda.
        </h1>
        <p className="mt-4 text-[var(--color-ink-soft)]">
          Isi formulir di bawah, atau langsung chat WhatsApp untuk respons
          lebih cepat. Kami merespons dalam 1×24 jam pada jam kerja.
        </p>
      </header>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-16">
        <div>
          <InquiryForm
            products={products}
            defaultProductSlug={product?.slug}
            defaultMessage={defaultMessage}
          />
        </div>

        <aside className="space-y-8 lg:border-l lg:border-[var(--color-line)] lg:pl-12">
          <InfoBlock
            icon={MessageCircle}
            label="WhatsApp"
            primary={site.whatsapp.display}
            action={
              <a
                href={buildWhatsAppLink(defaultInquiryMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline underline-offset-4 hover:text-[var(--color-accent)]"
              >
                Chat langsung
              </a>
            }
          />
          <InfoBlock icon={Mail} label="Email" primary={site.contact.email} />
          <InfoBlock
            icon={MapPin}
            label="Alamat"
            primary={site.contact.address}
          />
          <InfoBlock
            icon={Clock}
            label="Jam Operasional"
            primary="Senin – Sabtu"
            secondary="08.00 – 17.00 WIB"
          />
        </aside>
      </div>
    </Container>
  );
}

function InfoBlock({
  icon: Icon,
  label,
  primary,
  secondary,
  action,
}: {
  icon: typeof Mail;
  label: string;
  primary: string;
  secondary?: string;
  action?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-soft)]">
        <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
        {label}
      </div>
      <p className="mt-2 text-[15px] leading-relaxed">{primary}</p>
      {secondary ? (
        <p className="text-sm text-[var(--color-ink-soft)]">{secondary}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
