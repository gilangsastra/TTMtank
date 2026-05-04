import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products-repo";
import { ProductForm } from "../ProductForm";

export const metadata = { title: "Edit Produk" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <header>
        <h1 className="text-2xl font-semibold">Edit Produk</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
          {product.name} — <code>{product.slug}</code>
        </p>
      </header>
      <div className="mt-8">
        <ProductForm mode="edit" product={product} />
      </div>
    </div>
  );
}
