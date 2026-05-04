import type { Material } from "@/data/products";

export const materials: readonly Material[] = [
  "Polyethylene",
  "Stainless Steel",
  "Fiberglass",
] as const;

export type CapacityBucket = {
  id: string;
  label: string;
  min: number;
  max: number; // exclusive upper bound; use Infinity for "and above"
};

export const capacityBuckets: readonly CapacityBucket[] = [
  { id: "lt-500", label: "Hingga 500 L", min: 0, max: 501 },
  { id: "500-1000", label: "500 – 1.000 L", min: 500, max: 1001 },
  { id: "1000-2000", label: "1.000 – 2.000 L", min: 1000, max: 2001 },
  { id: "2000-5000", label: "2.000 – 5.000 L", min: 2000, max: 5001 },
  { id: "gt-5000", label: "Di atas 5.000 L", min: 5001, max: Number.POSITIVE_INFINITY },
] as const;

export type SortId =
  | "default"
  | "price-asc"
  | "price-desc"
  | "capacity-asc"
  | "capacity-desc";

export const sortOptions: readonly { id: SortId; label: string }[] = [
  { id: "default", label: "Pilihan Kami" },
  { id: "price-asc", label: "Harga: Terendah" },
  { id: "price-desc", label: "Harga: Tertinggi" },
  { id: "capacity-asc", label: "Kapasitas: Terkecil" },
  { id: "capacity-desc", label: "Kapasitas: Terbesar" },
] as const;
