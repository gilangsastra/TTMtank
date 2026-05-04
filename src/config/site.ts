export const site = {
  name: "TTM Tank",
  tagline: "Tangki Air Premium untuk Rumah & Industri",
  description:
    "Tangki air berkualitas tinggi dengan garansi resmi. Kapasitas 250 liter hingga 5.000 liter, material food-grade tahan UV, pengiriman ke seluruh Indonesia.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  // WhatsApp must be in international format WITHOUT '+' or spaces.
  // 0812-xxxx → 62812xxxx
  whatsapp: {
    number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "6281327001001",
    display: "+62 813-2700-1001",
  },

  contact: {
    email: "email@gmail.com",
    address: "Petamanan, Banyuputih, Kec. Banyuputih, Kabupaten Batang, Jawa Tengah",
  },

  nav: [
    { label: "Produk", href: "/produk" },
    { label: "Bandingkan", href: "/bandingkan" },
    { label: "Tentang Kami", href: "/tentang" },
    { label: "Kontak", href: "/kontak" },
  ],
} as const;

export type Site = typeof site;
