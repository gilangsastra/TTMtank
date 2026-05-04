import { Container } from "@/components/ui/Container";

export const metadata = { title: "Tentang Kami" };

export default function AboutPage() {
  return (
    <Container className="py-24">
      <h1 className="text-3xl font-semibold sm:text-4xl">Tentang Kami</h1>
      <p className="mt-4 text-[var(--color-ink-soft)]">
        Halaman tentang akan dibangun di langkah berikutnya.
      </p>
    </Container>
  );
}
