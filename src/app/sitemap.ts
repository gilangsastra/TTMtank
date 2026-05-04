import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getAllProducts } from "@/lib/products-repo";

const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: "", priority: 1.0 },
  { path: "/produk", priority: 0.9 },
  { path: "/bandingkan", priority: 0.6 },
  { path: "/tentang", priority: 0.5 },
  { path: "/kontak", priority: 0.7 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();

  let products: Awaited<ReturnType<typeof getAllProducts>> = [];
  try {
    products = await getAllProducts();
  } catch {
    // DB unavailable at build time — emit static routes only.
  }

  return [
    ...STATIC_ROUTES.map((r) => ({
      url: `${base}${r.path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: r.priority,
    })),
    ...products.map((p) => ({
      url: `${base}/produk/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
