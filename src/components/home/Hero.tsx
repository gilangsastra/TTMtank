import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { buildWhatsAppLink, defaultInquiryMessage } from "@/lib/whatsapp";

export function Hero() {
  return (
    <section className="relative">
      <Container className="pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
            Tangki Air Berkualitas
          </p>

          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-6xl">
            Air bersih, tersimpan dengan tenang.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--color-ink-soft)] sm:text-lg">
            Tangki air premium untuk rumah, bisnis, dan industri di seluruh Indonesia.
            Material food-grade tahan UV, garansi resmi hingga 15 tahun.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/produk"
              className="inline-flex h-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-ink)] px-7 text-[15px] font-medium text-[var(--color-paper)] transition hover:bg-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
            >
              Lihat Produk
            </Link>

            <LinkButton
              href={buildWhatsAppLink(defaultInquiryMessage)}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="lg"
            >
              Konsultasi via WhatsApp
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
