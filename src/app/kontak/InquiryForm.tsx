"use client";

import { useActionState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/data/products";
import { submitInquiry, type InquiryFormState } from "./actions";
import { cn } from "@/lib/cn";

const initialState: InquiryFormState = { ok: false, error: null };

type Props = {
  products: Product[];
  defaultProductSlug?: string;
  defaultMessage?: string;
};

export function InquiryForm({
  products,
  defaultProductSlug,
  defaultMessage,
}: Props) {
  const [state, formAction, isPending] = useActionState(
    submitInquiry,
    initialState,
  );

  if (state.ok) {
    return <SuccessState />;
  }

  const v = state.values;
  const fe = state.fieldErrors;

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {state.error ? <ErrorBanner message={state.error} /> : null}

      <Field
        label="Nama Lengkap"
        name="name"
        required
        autoComplete="name"
        defaultValue={v?.name ?? ""}
        error={fe?.name?.[0]}
      />

      <Field
        label="Nomor WhatsApp"
        name="phone"
        type="tel"
        required
        autoComplete="tel"
        placeholder="0812xxxxxxxx"
        defaultValue={v?.phone ?? ""}
        error={fe?.phone?.[0]}
        hint="Contoh: 0812-3456-7890 atau +62 812-3456-7890"
      />

      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        optional
        defaultValue={v?.email ?? ""}
        error={fe?.email?.[0]}
      />

      <Field
        label="Kota / Provinsi"
        name="city"
        required
        autoComplete="address-level2"
        placeholder="contoh: Jakarta Selatan"
        defaultValue={v?.city ?? ""}
        error={fe?.city?.[0]}
      />

      <SelectField
        label="Produk yang Diminati"
        name="productSlug"
        optional
        defaultValue={v?.productSlug ?? defaultProductSlug ?? ""}
      >
        <option value="">— Pilih produk (opsional) —</option>
        {products.map((p) => (
          <option key={p.slug} value={p.slug}>
            {p.name}
          </option>
        ))}
      </SelectField>

      <TextareaField
        label="Pesan / Kebutuhan"
        name="message"
        required
        rows={5}
        placeholder="Ceritakan kebutuhan Anda — kapasitas, lokasi pemasangan, target waktu, dan pertanyaan lainnya."
        defaultValue={v?.message ?? defaultMessage ?? ""}
        error={fe?.message?.[0]}
      />

      {/* Honeypot — invisible to humans, irresistible to bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Website (kosongkan)
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <div className="flex flex-col gap-4 border-t border-[var(--color-line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[var(--color-ink-soft)]">
          Dengan mengirim pesan, Anda setuju untuk dihubungi oleh tim kami.
        </p>
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? "Mengirim..." : "Kirim Pesan"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  optional = false,
  hint,
  error,
  defaultValue,
  autoComplete,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  error?: string;
  defaultValue?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  const id = `field-${name}`;
  const errId = `${id}-err`;
  const hintId = `${id}-hint`;
  const describedBy =
    [error ? errId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div>
      <Label htmlFor={id} required={required} optional={optional}>
        {label}
      </Label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={inputClass(Boolean(error))}
      />
      {hint && !error ? (
        <p id={hintId} className="mt-1.5 text-xs text-[var(--color-ink-soft)]">
          {hint}
        </p>
      ) : null}
      {error ? <FieldError id={errId}>{error}</FieldError> : null}
    </div>
  );
}

function SelectField({
  label,
  name,
  required = false,
  optional = false,
  defaultValue,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  optional?: boolean;
  defaultValue?: string;
  children: React.ReactNode;
}) {
  const id = `field-${name}`;
  return (
    <div>
      <Label htmlFor={id} required={required} optional={optional}>
        {label}
      </Label>
      <select
        id={id}
        name={name}
        required={required}
        defaultValue={defaultValue}
        className={cn(inputClass(false), "pr-8")}
      >
        {children}
      </select>
    </div>
  );
}

function TextareaField({
  label,
  name,
  required = false,
  rows = 4,
  placeholder,
  defaultValue,
  error,
}: {
  label: string;
  name: string;
  required?: boolean;
  rows?: number;
  placeholder?: string;
  defaultValue?: string;
  error?: string;
}) {
  const id = `field-${name}`;
  const errId = `${id}-err`;
  return (
    <div>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <textarea
        id={id}
        name={name}
        required={required}
        rows={rows}
        placeholder={placeholder}
        defaultValue={defaultValue}
        maxLength={1000}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errId : undefined}
        className={cn(inputClass(Boolean(error)), "min-h-[120px] resize-y")}
      />
      {error ? <FieldError id={errId}>{error}</FieldError> : null}
    </div>
  );
}

function Label({
  htmlFor,
  required,
  optional,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 flex items-baseline justify-between text-sm font-medium"
    >
      <span>
        {children}
        {required ? <span className="ml-0.5 text-[var(--color-accent)]">*</span> : null}
      </span>
      {optional ? (
        <span className="text-xs text-[var(--color-ink-soft)]">opsional</span>
      ) : null}
    </label>
  );
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs text-red-700">
      {children}
    </p>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <p>{message}</p>
    </div>
  );
}

function SuccessState() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-white px-8 py-14 text-center">
      <CheckCircle2
        className="mx-auto h-10 w-10 text-[var(--color-accent)]"
        strokeWidth={1.5}
        aria-hidden
      />
      <h2 className="mt-4 text-xl font-semibold">Pesan Anda terkirim.</h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-[var(--color-ink-soft)]">
        Tim kami akan menghubungi Anda via WhatsApp dalam 1×24 jam pada
        jam kerja. Jika mendesak, silakan chat langsung melalui tombol di
        kanan bawah halaman.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/produk"
          className="inline-flex h-11 items-center rounded-[var(--radius-md)] border border-[var(--color-line)] px-5 text-sm font-medium hover:border-[var(--color-ink)]"
        >
          Lihat Produk
        </Link>
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-[var(--radius-md)] bg-[var(--color-ink)] px-5 text-sm font-medium text-[var(--color-paper)] hover:bg-[var(--color-accent)]"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}

function inputClass(hasError: boolean): string {
  return cn(
    "block w-full rounded-[var(--radius-sm)] border bg-white px-3.5 py-2.5 text-sm",
    "focus:outline-none focus:border-[var(--color-ink)]",
    hasError
      ? "border-red-300 focus:border-red-600"
      : "border-[var(--color-line)]",
  );
}
