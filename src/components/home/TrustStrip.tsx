import { ShieldCheck, Sun, Droplets, Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";

const items = [
  {
    icon: ShieldCheck,
    title: "Garansi 10–15 Tahun",
    body: "Garansi resmi tertulis dari pabrik untuk seluruh produk.",
  },
  {
    icon: Sun,
    title: "Tahan UV & Cuaca",
    body: "Material berlapis UV stabilizer, tidak mudah getas di iklim tropis.",
  },
  {
    icon: Droplets,
    title: "Food-Grade",
    body: "Aman untuk air minum, bebas logam berat dan bau plastik.",
  },
  {
    icon: Truck,
    title: "Kirim Seluruh Indonesia",
    body: "Pengiriman ke 34 provinsi dengan asuransi pengiriman.",
  },
];

export function TrustStrip() {
  return (
    <section
      aria-labelledby="trust-heading"
      className="border-y border-[var(--color-line)] bg-[var(--color-accent-soft)]/40"
    >
      <h2 id="trust-heading" className="sr-only">
        Mengapa memilih kami
      </h2>
      <Container className="py-14">
        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex flex-col gap-3">
              <Icon
                className="h-6 w-6 text-[var(--color-accent)]"
                strokeWidth={1.5}
                aria-hidden
              />
              <p className="text-[15px] font-semibold">{title}</p>
              <p className="text-sm leading-relaxed text-[var(--color-ink-soft)]">
                {body}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
