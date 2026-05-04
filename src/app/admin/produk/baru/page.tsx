import { ProductForm } from "../ProductForm";

export const metadata = { title: "Produk Baru" };

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <header>
        <h1 className="text-2xl font-semibold">Tambah Produk Baru</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
          Lengkapi form di bawah. Semua field bertanda * wajib diisi.
        </p>
      </header>
      <div className="mt-8">
        <ProductForm mode="create" />
      </div>
    </div>
  );
}
