import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { WhyUs } from "@/components/home/WhyUs";
import { ClosingCTA } from "@/components/home/ClosingCTA";
import { safeGetAllProducts } from "@/lib/products-repo";

export default async function HomePage() {
  const products = await safeGetAllProducts();
  return (
    <>
      <Hero />
      <TrustStrip />
      <FeaturedProducts products={products} />
      <WhyUs />
      <ClosingCTA />
    </>
  );
}
