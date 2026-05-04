import Link from "next/link";
import { LogOut } from "lucide-react";
import { logout } from "./actions";

export const metadata = {
  title: { default: "Admin", template: "%s — Admin TTM Tank" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-paper)]">
      <header className="border-b border-[var(--color-line)] bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="text-sm font-semibold">
              TTM Admin
            </Link>
            <nav aria-label="Admin">
              <ul className="flex items-center gap-6 text-sm text-[var(--color-ink-soft)]">
                <li>
                  <Link href="/admin" className="hover:text-[var(--color-ink)]">
                    Inquiries
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/produk"
                    className="hover:text-[var(--color-ink)]"
                  >
                    Produk
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 text-xs text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden />
              Keluar
            </button>
          </form>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
