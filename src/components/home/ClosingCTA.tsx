import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { buildWhatsAppLink, defaultInquiryMessage } from "@/lib/whatsapp";
import Link from "next/link";

export function ClosingCTA() {
  return (
    <section className="border-t border-[var(--color-line)] bg-[var(--color-ink)] text-[var(--color-paper)]">
      <Container className="py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-end">
          <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
            Butuh saran ukuran tangki?<br />
            Kami bantu pilih.
          </h2>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <LinkButton
              href={buildWhatsAppLink(defaultInquiryMessage)}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              className="bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-white"
            >
              Chat WhatsApp
            </LinkButton>
            <Link
              href="/kontak"
              className="inline-flex h-12 items-center justify-center rounded-[var(--radius-md)] border border-white/20 px-7 text-[15px] font-medium text-[var(--color-paper)] transition hover:border-white/60"
            >
              Kirim Inquiry
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
