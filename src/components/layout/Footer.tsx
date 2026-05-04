import Link from "next/link";
import { site } from "@/config/site";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--color-line)]">
      <Container className="py-14">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="text-[15px] font-semibold">{site.name}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--color-ink-soft)]">
              {site.description}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-soft)]">
              Navigasi
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-soft)]">
              Kontak
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--color-ink-soft)]">
              <li>{site.whatsapp.display}</li>
              <li>{site.contact.email}</li>
              <li className="leading-relaxed">{site.contact.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[var(--color-line)] pt-6 text-xs text-[var(--color-ink-soft)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. Seluruh hak cipta dilindungi.</p>
          <p>Dibuat di Indonesia.</p>
        </div>
      </Container>
    </footer>
  );
}
