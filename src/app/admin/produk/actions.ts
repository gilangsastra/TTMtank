"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { productSchema } from "@/lib/product-schema";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/products-repo";

export type ProductFormState = {
  ok: boolean;
  error: string | null;
  fieldErrors?: Partial<Record<string, string[]>>;
  values?: Record<string, string>;
};

const initialOk: ProductFormState = { ok: true, error: null };

function readEntries(fd: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of fd.entries()) {
    if (typeof v === "string") out[k] = v;
  }
  return out;
}

export async function createProductAction(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const raw = readEntries(formData);
  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Mohon periksa kembali isian.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: raw,
    };
  }

  try {
    await createProduct(parsed.data);
  } catch (err) {
    console.error("[admin] createProduct failed", err);
    const msg =
      err instanceof Error && /unique/i.test(err.message)
        ? "Slug sudah dipakai produk lain."
        : "Gagal menyimpan produk.";
    return { ok: false, error: msg, values: raw };
  }

  revalidatePath("/admin/produk");
  revalidatePath("/produk");
  redirect("/admin/produk");
}

export async function updateProductAction(
  originalSlug: string,
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const raw = readEntries(formData);
  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Mohon periksa kembali isian.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: raw,
    };
  }

  try {
    await updateProduct(originalSlug, parsed.data);
  } catch (err) {
    console.error("[admin] updateProduct failed", err);
    const msg =
      err instanceof Error && /unique/i.test(err.message)
        ? "Slug sudah dipakai produk lain."
        : "Gagal memperbarui produk.";
    return { ok: false, error: msg, values: raw };
  }

  revalidatePath("/admin/produk");
  revalidatePath("/produk");
  revalidatePath(`/produk/${parsed.data.slug}`);
  if (originalSlug !== parsed.data.slug) {
    revalidatePath(`/produk/${originalSlug}`);
  }
  redirect("/admin/produk");
}

export async function deleteProductAction(slug: string): Promise<void> {
  if (!slug) return;
  await deleteProduct(slug);
  revalidatePath("/admin/produk");
  revalidatePath("/produk");
  revalidatePath(`/produk/${slug}`);
}
