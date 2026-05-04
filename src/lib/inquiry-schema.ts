import { z } from "zod";

/**
 * Indonesian mobile phone format. Accepts:
 *   - 08xxxxxxxxxx (local)
 *   - 628xxxxxxxxx (international without +)
 *   - +628xxxxxxxxx (international with +)
 * Normalized to "62..." form on the server.
 */
const phoneRegex = /^(?:\+?62|0)8\d{8,11}$/;

export const inquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama terlalu panjang"),

  phone: z
    .string()
    .trim()
    .min(1, "Nomor WhatsApp wajib diisi")
    .transform((s) => s.replace(/[\s-]/g, ""))
    .refine((s) => phoneRegex.test(s), "Nomor WhatsApp tidak valid")
    .transform((s) => {
      // Normalize to "62..." form.
      const digits = s.replace(/^\+/, "");
      if (digits.startsWith("0")) return `62${digits.slice(1)}`;
      return digits;
    }),

  email: z
    .string()
    .trim()
    .max(254)
    .email("Email tidak valid")
    .optional()
    .or(z.literal("")),

  city: z
    .string()
    .trim()
    .min(2, "Kota wajib diisi")
    .max(100, "Kota terlalu panjang"),

  productSlug: z
    .string()
    .trim()
    .max(100)
    .optional()
    .or(z.literal("")),

  message: z
    .string()
    .trim()
    .min(10, "Pesan minimal 10 karakter")
    .max(1000, "Pesan terlalu panjang (maks. 1.000 karakter)"),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
export type InquiryRaw = Record<string, FormDataEntryValue | undefined>;
