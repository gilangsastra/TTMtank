import { site } from "@/config/site";
import type { Product } from "@/data/products";
import { formatLiter } from "@/lib/format";

export function buildWhatsAppLink(message: string, number?: string): string {
  const target = number ?? site.whatsapp.number;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${target}?text=${encoded}`;
}

export const defaultInquiryMessage =
  `Halo ${site.name}, saya tertarik dengan produk tangki air Anda. ` +
  `Mohon info lebih lanjut. Terima kasih.`;

export function buildProductInquiryMessage(p: Product): string {
  return (
    `Halo ${site.name}, saya tertarik dengan ${p.name} ` +
    `(${formatLiter(p.capacityLiters)}, ${p.material}). ` +
    `Apakah masih tersedia dan bisa dikirim ke alamat saya? Terima kasih.`
  );
}

export function buildProductQuoteMessage(p: Product): string {
  return (
    `Halo ${site.name}, saya ingin meminta penawaran resmi untuk ${p.name} ` +
    `(${formatLiter(p.capacityLiters)}, ${p.material}). ` +
    `Mohon info harga, ongkir, dan estimasi instalasi. Terima kasih.`
  );
}
