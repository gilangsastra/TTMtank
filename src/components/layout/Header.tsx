import Link from "next/link";
import { site } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { buildWhatsAppLink, defaultInquiryMessage } from "@/lib/whatsapp";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[var(--color-paper)]/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="text-[15px] font-semibold tracking-tight"
          aria-label={`${site.name} — beranda`}
        >
          {site.name}
        </Link>

        <nav aria-label="Navigasi utama" className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm text-[var(--color-ink-soft)]">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-[var(--color-ink)] transition"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <LinkButton
          href={buildWhatsAppLink(defaultInquiryMessage)}
          target="_blank"
          rel="noopener noreferrer"
          variant="primary"
          size="md"
          className="hidden sm:inline-flex"
        >
          Hubungi via WhatsApp
        </LinkButton>
      </Container>
    </header>
  );
}
