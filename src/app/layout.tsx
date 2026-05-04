import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/common/WhatsAppFloat";
import { CompareProvider } from "@/components/compare/CompareProvider";
import { CompareBar } from "@/components/compare/CompareBar";
import { ProductsProvider } from "@/components/products/ProductsProvider";
import { getAllProducts } from "@/lib/products-repo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#faf8f4",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Loaded once per request; client components read via useProducts().
  let products = [] as Awaited<ReturnType<typeof getAllProducts>>;
  try {
    products = await getAllProducts();
  } catch {
    // DB not configured yet — site still renders, but lists will be empty.
  }

  return (
    <html lang="id" className={geistSans.variable}>
      <body className="min-h-screen flex flex-col">
        <ProductsProvider products={products}>
          <CompareProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CompareBar />
            <WhatsAppFloat />
          </CompareProvider>
        </ProductsProvider>
      </body>
    </html>
  );
}
