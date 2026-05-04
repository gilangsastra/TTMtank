import { Container } from "@/components/ui/Container";

const reasons = [
  {
    number: "01",
    title: "Dibuat untuk iklim Indonesia",
    body:
      "Setiap produk diuji di lapangan — terik matahari, hujan deras, dan kualitas air yang berbeda di tiap daerah.",
  },
  {
    number: "02",
    title: "Spesifikasi yang jujur",
    body:
      "Tidak ada angka pemasaran yang dilebih-lebihkan. Kapasitas, ketebalan, dan dimensi tertulis apa adanya.",
  },
  {
    number: "03",
    title: "Layanan yang bisa dihubungi",
    body:
      "Konsultasi via WhatsApp dengan tim teknis — bukan chatbot. Bantuan instalasi tersedia di kota besar.",
  },
];

export function WhyUs() {
  return (
    <section
      aria-labelledby="why-heading"
      className="border-t border-[var(--color-line)]"
    >
      <Container className="py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
            Mengapa TTM Tank
          </p>
          <h2
            id="why-heading"
            className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl"
          >
            Lebih dari sekadar wadah air.
          </h2>
        </div>

        <ol className="mt-14 grid gap-10 md:grid-cols-3">
          {reasons.map((r) => (
            <li key={r.number} className="border-t border-[var(--color-ink)] pt-6">
              <p className="text-xs font-medium tracking-widest text-[var(--color-ink-soft)]">
                {r.number}
              </p>
              <p className="mt-3 text-[17px] font-semibold">{r.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                {r.body}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
