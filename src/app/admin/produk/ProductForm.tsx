"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/data/products";
import {
  createProductAction,
  updateProductAction,
  type ProductFormState,
} from "./actions";
import { cn } from "@/lib/cn";

const initial: ProductFormState = { ok: true, error: null };

type Props = {
  mode: "create" | "edit";
  product?: Product & { sortOrder?: number };
};

export function ProductForm({ mode, product }: Props) {
  const action =
    mode === "edit" && product
      ? updateProductAction.bind(null, product.slug)
      : createProductAction;

  const [state, formAction, isPending] = useActionState(action, initial);

  const v = state.values;
  const fe = state.fieldErrors;
  const def = (key: string, fallback: string | number = ""): string => {
    if (v && v[key] !== undefined) return v[key] ?? "";
    return String(fallback);
  };

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {state.error ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p>{state.error}</p>
        </div>
      ) : null}

      <Row>
        <Field
          name="slug"
          label="Slug"
          required
          defaultValue={def("slug", product?.slug ?? "")}
          error={fe?.slug?.[0]}
          hint="Huruf kecil, angka, tanda hubung. Contoh: ttm-rumah-1000"
        />
        <Field
          name="name"
          label="Nama Produk"
          required
          defaultValue={def("name", product?.name ?? "")}
          error={fe?.name?.[0]}
        />
      </Row>

      <Row>
        <Field
          name="capacityLiters"
          label="Kapasitas (liter)"
          type="number"
          required
          defaultValue={def("capacityLiters", product?.capacityLiters ?? "")}
          error={fe?.capacityLiters?.[0]}
        />
        <SelectField
          name="material"
          label="Material"
          required
          defaultValue={def("material", product?.material ?? "Polyethylene")}
          options={["Polyethylene", "Stainless Steel", "Fiberglass"]}
          error={fe?.material?.[0]}
        />
      </Row>

      <Row>
        <Field
          name="priceIDR"
          label="Harga (Rupiah)"
          type="number"
          required
          defaultValue={def("priceIDR", product?.priceIDR ?? "")}
          error={fe?.priceIDR?.[0]}
        />
        <Field
          name="warrantyYears"
          label="Garansi (tahun)"
          type="number"
          required
          defaultValue={def("warrantyYears", product?.warrantyYears ?? "")}
          error={fe?.warrantyYears?.[0]}
        />
      </Row>

      <Row>
        <SelectField
          name="useCase"
          label="Jenis Penggunaan"
          required
          defaultValue={def("useCase", product?.useCase ?? "Rumah Tangga")}
          options={["Rumah Tangga", "Industri", "Komersial"]}
          error={fe?.useCase?.[0]}
        />
        <Field
          name="sortOrder"
          label="Urutan Tampil"
          type="number"
          defaultValue={def("sortOrder", product?.dimensions ? "" : "0")}
          hint="Angka kecil tampil lebih dulu (default 0)"
          error={fe?.sortOrder?.[0]}
        />
      </Row>

      <Row>
        <Field
          name="diameterCm"
          label="Diameter (cm)"
          type="number"
          required
          defaultValue={def("diameterCm", product?.dimensions.diameterCm ?? "")}
          error={fe?.diameterCm?.[0]}
        />
        <Field
          name="heightCm"
          label="Tinggi (cm)"
          type="number"
          required
          defaultValue={def("heightCm", product?.dimensions.heightCm ?? "")}
          error={fe?.heightCm?.[0]}
        />
      </Row>

      <Field
        name="imageUrl"
        label="URL Gambar"
        required
        defaultValue={def("imageUrl", product?.imageUrl ?? "/images/placeholder-tank.svg")}
        error={fe?.imageUrl?.[0]}
        hint="Path lokal (mis. /images/x.png) atau URL eksternal yang diizinkan"
      />

      <Field
        name="highlight"
        label="Highlight (opsional)"
        defaultValue={def("highlight", product?.highlight ?? "")}
        error={fe?.highlight?.[0]}
        hint="Badge kecil di kartu produk. Contoh: Paling populer"
      />

      <TextareaField
        name="description"
        label="Deskripsi"
        required
        rows={4}
        defaultValue={def("description", product?.description ?? "")}
        error={fe?.description?.[0]}
      />

      <TextareaField
        name="features"
        label="Keunggulan"
        rows={4}
        defaultValue={def(
          "features",
          (product?.features ?? []).join("\n"),
        )}
        error={fe?.features?.[0]}
        hint="Satu poin per baris"
      />

      <TextareaField
        name="certifications"
        label="Sertifikasi"
        rows={3}
        defaultValue={def(
          "certifications",
          (product?.certifications ?? []).join("\n"),
        )}
        error={fe?.certifications?.[0]}
        hint="Satu sertifikasi per baris (mis. SNI, ISO 9001)"
      />

      <div className="flex items-center justify-end gap-3 border-t border-[var(--color-line)] pt-6">
        <Link
          href="/admin/produk"
          className="text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
        >
          Batal
        </Link>
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending
            ? "Menyimpan..."
            : mode === "edit"
              ? "Simpan Perubahan"
              : "Tambah Produk"}
        </Button>
      </div>
    </form>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-6 md:grid-cols-2">{children}</div>;
}

function Field({
  name,
  label,
  type = "text",
  required = false,
  defaultValue,
  hint,
  error,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  hint?: string;
  error?: string;
}) {
  const id = `f-${name}`;
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium"
      >
        {label}
        {required ? <span className="ml-0.5 text-[var(--color-accent)]">*</span> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        aria-invalid={Boolean(error)}
        className={inputClass(Boolean(error))}
      />
      {hint && !error ? (
        <p className="mt-1 text-xs text-[var(--color-ink-soft)]">{hint}</p>
      ) : null}
      {error ? (
        <p role="alert" className="mt-1 text-xs text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SelectField({
  name,
  label,
  required = false,
  defaultValue,
  options,
  error,
}: {
  name: string;
  label: string;
  required?: boolean;
  defaultValue?: string;
  options: readonly string[];
  error?: string;
}) {
  const id = `f-${name}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
        {required ? <span className="ml-0.5 text-[var(--color-accent)]">*</span> : null}
      </label>
      <select
        id={id}
        name={name}
        required={required}
        defaultValue={defaultValue}
        className={cn(inputClass(Boolean(error)), "pr-8")}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error ? (
        <p role="alert" className="mt-1 text-xs text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function TextareaField({
  name,
  label,
  rows = 4,
  required = false,
  defaultValue,
  hint,
  error,
}: {
  name: string;
  label: string;
  rows?: number;
  required?: boolean;
  defaultValue?: string;
  hint?: string;
  error?: string;
}) {
  const id = `f-${name}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
        {required ? <span className="ml-0.5 text-[var(--color-accent)]">*</span> : null}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        required={required}
        defaultValue={defaultValue}
        aria-invalid={Boolean(error)}
        className={cn(inputClass(Boolean(error)), "min-h-[100px] resize-y")}
      />
      {hint && !error ? (
        <p className="mt-1 text-xs text-[var(--color-ink-soft)]">{hint}</p>
      ) : null}
      {error ? (
        <p role="alert" className="mt-1 text-xs text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function inputClass(hasError: boolean): string {
  return cn(
    "block w-full rounded-[var(--radius-sm)] border bg-white px-3 py-2 text-sm",
    "focus:outline-none focus:border-[var(--color-ink)]",
    hasError
      ? "border-red-300 focus:border-red-600"
      : "border-[var(--color-line)]",
  );
}
