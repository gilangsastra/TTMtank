# TTM Tank

Website produk tangki air premium untuk pasar Indonesia.

## Stack

- Next.js 15 (App Router, Server Components)
- TypeScript
- Tailwind CSS v4
- Hosting: Vercel (nanti)
- Database: PostgreSQL (nanti)

## Menjalankan secara lokal

```bash
npm install
cp .env.example .env.local   # lalu isi nilai sesuai kebutuhan
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Skrip

| Skrip          | Fungsi                          |
| -------------- | ------------------------------- |
| `npm run dev`  | Mode development (Turbopack)    |
| `npm run build`| Build produksi                  |
| `npm run start`| Jalankan build produksi         |
| `npm run lint` | ESLint                          |
| `npm run typecheck` | Cek tipe TypeScript        |

## Struktur folder

```
src/
  app/          # Routing (App Router)
  components/   # UI dipisah: layout/, home/, ui/, common/
  config/       # site.ts — sumber tunggal: brand, kontak, navigasi
  lib/          # Helpers murni (format, whatsapp, cn)
  data/         # Data produk statis (sementara, sebelum DB)
public/images/  # Aset gambar
```

## Konfigurasi cepat

Ubah brand, nomor WhatsApp, alamat, dan email di **`src/config/site.ts`**.
