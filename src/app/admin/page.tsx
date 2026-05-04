import { listInquiries } from "@/lib/inquiry-store";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata = { title: "Inquiries" };

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Jakarta",
});

export default async function AdminInquiriesPage() {
  let inquiries: Awaited<ReturnType<typeof listInquiries>> = [];
  let error: string | null = null;
  try {
    inquiries = await listInquiries(200);
  } catch (e) {
    error = e instanceof Error ? e.message : "Gagal memuat data";
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Inquiries</h1>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            Daftar lead terbaru, urut dari yang paling baru.
          </p>
        </div>
        <p className="text-sm text-[var(--color-ink-soft)]">
          {inquiries.length} entri
        </p>
      </header>

      {error ? (
        <div className="mt-8 rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      {inquiries.length === 0 && !error ? (
        <div className="mt-8 rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-white px-6 py-12 text-center text-sm text-[var(--color-ink-soft)]">
          Belum ada inquiry yang masuk.
        </div>
      ) : null}

      {inquiries.length > 0 ? (
        <div className="mt-8 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--color-line)] bg-[var(--color-paper)] text-left text-xs uppercase tracking-[0.14em] text-[var(--color-ink-soft)]">
              <tr>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">Kontak</th>
                <th className="px-4 py-3 font-medium">Kota</th>
                <th className="px-4 py-3 font-medium">Produk</th>
                <th className="px-4 py-3 font-medium">Pesan</th>
                <th className="px-4 py-3" aria-label="Aksi" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)]">
              {inquiries.map((q) => (
                <tr key={q.id} className="align-top">
                  <td className="px-4 py-3 whitespace-nowrap text-[var(--color-ink-soft)]">
                    {dateFormatter.format(q.createdAt)}
                  </td>
                  <td className="px-4 py-3 font-medium">{q.name}</td>
                  <td className="px-4 py-3">
                    <div className="font-mono text-xs">{q.phone}</div>
                    {q.email ? (
                      <div className="text-xs text-[var(--color-ink-soft)]">
                        {q.email}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">{q.city}</td>
                  <td className="px-4 py-3">
                    {q.productSlug ? (
                      <code className="rounded bg-[var(--color-paper)] px-1.5 py-0.5 text-xs">
                        {q.productSlug}
                      </code>
                    ) : (
                      <span className="text-xs text-[var(--color-ink-soft)]">
                        —
                      </span>
                    )}
                  </td>
                  <td className="max-w-xs px-4 py-3 text-[var(--color-ink-soft)]">
                    <p className="line-clamp-3 whitespace-pre-wrap">
                      {q.message}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={buildWhatsAppLink(
                        `Halo ${q.name}, terima kasih sudah menghubungi TTM Tank.`,
                        q.phone,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium underline underline-offset-4 hover:text-[var(--color-accent)]"
                    >
                      WhatsApp
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
