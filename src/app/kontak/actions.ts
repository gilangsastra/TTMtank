"use server";

import { headers } from "next/headers";
import { inquirySchema } from "@/lib/inquiry-schema";
import { saveInquiry } from "@/lib/inquiry-store";
import { rateLimit } from "@/lib/rate-limit";
import { getProductBySlug } from "@/lib/products-repo";

export type InquiryFormState = {
  ok: boolean;
  error: string | null;
  fieldErrors?: Partial<Record<string, string[]>>;
  /** Echo of submitted values so the form can re-populate after an error. */
  values?: {
    name?: string;
    phone?: string;
    email?: string;
    city?: string;
    productSlug?: string;
    message?: string;
  };
};

const RATE_LIMIT = { max: 5, windowMs: 10 * 60_000 };

async function getClientContext() {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  const ip = fwd
    ? fwd.split(",")[0]?.trim() || "unknown"
    : (h.get("x-real-ip") ?? "unknown");
  const userAgent = h.get("user-agent");
  return { ip, userAgent };
}

function readString(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v : "";
}

export async function submitInquiry(
  _prev: InquiryFormState,
  formData: FormData,
): Promise<InquiryFormState> {
  const { ip, userAgent } = await getClientContext();

  // Honeypot: bots tend to fill any input. Real users never see this field.
  // We pretend success so bots don't learn they were detected.
  if (readString(formData, "website").trim() !== "") {
    return { ok: true, error: null };
  }

  // Rate limit per IP.
  const rl = rateLimit(`inquiry:${ip}`, RATE_LIMIT);
  if (!rl.allowed) {
    return {
      ok: false,
      error: "Terlalu banyak permintaan. Coba lagi dalam beberapa menit.",
      values: collectValues(formData),
    };
  }

  // Validate with the same schema used on the client.
  const raw = {
    name: readString(formData, "name"),
    phone: readString(formData, "phone"),
    email: readString(formData, "email"),
    city: readString(formData, "city"),
    productSlug: readString(formData, "productSlug"),
    message: readString(formData, "message"),
  };

  const parsed = inquirySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Mohon periksa kembali isian Anda.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: raw,
    };
  }

  // If a product slug was provided, validate it against the catalog.
  // Unknown slugs are dropped, not rejected — keeps UX forgiving.
  const knownSlug = parsed.data.productSlug
    ? (await getProductBySlug(parsed.data.productSlug))?.slug
    : undefined;

  try {
    await saveInquiry(
      { ...parsed.data, productSlug: knownSlug ?? "" },
      { ip, userAgent },
    );
  } catch (err) {
    // Log full error server-side; never leak to the client.
    console.error("[inquiry] save failed", err);
    return {
      ok: false,
      error:
        "Terjadi kesalahan saat menyimpan pesan. Silakan coba lagi atau hubungi kami via WhatsApp.",
      values: raw,
    };
  }

  return { ok: true, error: null };
}

function collectValues(fd: FormData): InquiryFormState["values"] {
  return {
    name: readString(fd, "name"),
    phone: readString(fd, "phone"),
    email: readString(fd, "email"),
    city: readString(fd, "city"),
    productSlug: readString(fd, "productSlug"),
    message: readString(fd, "message"),
  };
}
