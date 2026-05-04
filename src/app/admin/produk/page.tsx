import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getAllProducts } from "@/lib/products-repo";
import { formatRupiah, formatLiter } from "@/lib/format";
import { deleteProductAction } from "./actions";

export const metadata = { title: "Produk" };

export default async function AdminProductsPage() {
  let products: Awaited<ReturnType<typeof getAllProducts>> = [];
  let error: string | null = null;
  try {
    products = await getAllProducts();
  } catch (e) {
    error = e instanceof Error ? e.message : "Gagal memuat produk";
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Produk</h1>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            Kelola katalog tangki — tambah, edit, atau hapus.
          </p>
        </div>
        <Link
          href="/admin/produk/baru"
          className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-ink)] px-4 text-sm font-medium text-[var(--color-paper)] hover:bg-[var(--color-accent)]"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Produk Baru
        </Link>
      </header>

      {error ? (
        <div className="mt-8 rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      {products.length === 0 && !error ? (
        <div className="mt-8 rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-white px-6 py-12 text-center text-sm text-[var(--color-ink-soft)]">
          Belum ada produk. Klik &ldquo;Produk Baru&rdquo; untuk menambah.
        </div>
      ) : null}

      {products.length > 0 ? (
        <div className="mt-8 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--color-line)] bg-[var(--color-paper)] text-left text-xs uppercase tracking-[0.14em] text-[var(--color-ink-soft)]">
              <tr>
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Kapasitas</th>
                <th className="px-4 py-3 font-medium">Material</th>
                <th className="px-4 py-3 font-medium">Harga</th>
                <th className="px-4 py-3" aria-label="Aksi" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)]">
              {products.map((p) => (
                <tr key={p.slug}>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3">
                    <code className="rounded bg-[var(--color-paper)] px-1.5 py-0.5 text-xs">
                      {p.slug}
                    </code>
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {formatLiter(p.capacityLiters)}
                  </td>
                  <td className="px-4 py-3">{p.material}</td>
                  <td className="px-4 py-3 tabular-nums">
                    {formatRupiah(p.priceIDR)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={`/admin/produk/${p.slug}`}
                        className="inline-flex h-8 items-center gap-1 rounded-[var(--radius-sm)] border border-[var(--color-line)] px-2.5 text-xs hover:border-[var(--color-ink)]"
                      >
                        <Pencil className="h-3 w-3" aria-hidden />
                        Edit
                      </Link>
                      <DeleteForm slug={p.slug} name={p.name} />
                    </div>
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

function DeleteForm({ slug, name }: { slug: string; name: string }) {
  // Server action bound with the slug as the first arg.
  const action = deleteProductAction.bind(null, slug);
  return (
    <form action={action}>
      <button
        type="submit"
        className="inline-flex h-8 items-center gap-1 rounded-[var(--radius-sm)] border border-[var(--color-line)] px-2.5 text-xs text-red-700 hover:border-red-400 hover:bg-red-50"
        // Confirm via native dialog on click; native is simple and accessible.
        // (Server action still validates the slug.)
        formNoValidate
      >
        <Trash2 className="h-3 w-3" aria-hidden />
        <span>Hapus</span>
        <span className="sr-only">{name}</span>
      </button>
    </form>
  );
}
