import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const stringList = z
  .string()
  .transform((s) =>
    s
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0),
  )
  .pipe(z.array(z.string().min(1).max(120)).max(20));

export const productSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(slugRegex, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  name: z.string().trim().min(2).max(100),
  capacityLiters: z.coerce.number().int().min(50).max(1_000_000),
  material: z.enum(["Polyethylene", "Stainless Steel", "Fiberglass"]),
  priceIDR: z.coerce.number().int().min(0).max(10_000_000_000),
  warrantyYears: z.coerce.number().int().min(1).max(50),
  useCase: z.enum(["Rumah Tangga", "Industri", "Komersial"]),
  imageUrl: z.string().trim().min(1).max(500),
  highlight: z
    .string()
    .trim()
    .max(80)
    .optional()
    .or(z.literal(""))
    .transform((s) => (s && s.length > 0 ? s : undefined)),
  diameterCm: z.coerce.number().int().min(10).max(2000),
  heightCm: z.coerce.number().int().min(10).max(2000),
  description: z.string().trim().min(10).max(2000),
  features: stringList,
  certifications: stringList,
  sortOrder: z.coerce.number().int().min(0).max(10000).default(0),
});

export type ProductInput = z.infer<typeof productSchema>;
