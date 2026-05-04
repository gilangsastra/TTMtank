-- Products schema. JSONB arrays for features/certifications avoid a join table
-- for what are effectively static per-product strings.

CREATE TABLE IF NOT EXISTS products (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  capacity_liters INTEGER NOT NULL CHECK (capacity_liters > 0),
  material        TEXT NOT NULL CHECK (material IN ('Polyethylene', 'Stainless Steel', 'Fiberglass')),
  price_idr       INTEGER NOT NULL CHECK (price_idr >= 0),
  warranty_years  INTEGER NOT NULL CHECK (warranty_years > 0),
  use_case        TEXT NOT NULL CHECK (use_case IN ('Rumah Tangga', 'Industri', 'Komersial')),
  image_url       TEXT NOT NULL,
  highlight       TEXT,
  diameter_cm     INTEGER NOT NULL CHECK (diameter_cm > 0),
  height_cm       INTEGER NOT NULL CHECK (height_cm > 0),
  description     TEXT NOT NULL,
  features        JSONB NOT NULL DEFAULT '[]',
  certifications  JSONB NOT NULL DEFAULT '[]',
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_sort ON products (sort_order, name);

-- Auto-update updated_at on UPDATE.
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Seed: insert if not already present (slug-keyed). Idempotent.
INSERT INTO products
  (slug, name, capacity_liters, material, price_idr, warranty_years, use_case, image_url, highlight, diameter_cm, height_cm, description, features, certifications, sort_order)
VALUES
  ('ttm-rumah-500', 'TTM Rumah 500', 500, 'Polyethylene', 1150000, 10, 'Rumah Tangga', '/images/placeholder-tank.svg', 'Pilihan hemat untuk rumah kecil', 88, 110,
   'Tangki air 500 liter untuk rumah tinggal kecil atau hunian satu lantai. Material polyethylene food-grade dengan lapisan tahan UV, cocok untuk menyimpan air bersih jangka panjang tanpa khawatir berbau atau mengalami perubahan rasa.',
   '["Material polyethylene food-grade","Lapisan UV stabilizer, tahan terik matahari tropis","Tidak berbau plastik, aman untuk air minum","Ringan, mudah dipasang di dak rumah"]'::jsonb,
   '["SNI","Food-Grade Certified"]'::jsonb, 10),

  ('ttm-rumah-1000', 'TTM Rumah 1000', 1000, 'Polyethylene', 1850000, 10, 'Rumah Tangga', '/images/placeholder-tank.svg', 'Paling populer untuk rumah tinggal', 110, 130,
   'Kapasitas paling sering dipilih untuk rumah tinggal 4–5 orang. Cukup untuk kebutuhan harian termasuk saat PDAM mati, dengan dimensi yang masih ramah untuk dak beton standar.',
   '["Material polyethylene food-grade","Lapisan UV stabilizer, tahan terik matahari tropis","Tidak berbau plastik, aman untuk air minum","Ringan, mudah dipasang di dak rumah"]'::jsonb,
   '["SNI","Food-Grade Certified"]'::jsonb, 20),

  ('ttm-rumah-2000', 'TTM Rumah 2000', 2000, 'Polyethylene', 3290000, 10, 'Rumah Tangga', '/images/placeholder-tank.svg', NULL, 140, 165,
   'Untuk rumah besar atau dua lantai dengan banyak kamar mandi. Memberi cadangan ekstra saat pasokan air sedang tidak stabil, sambil tetap dengan biaya perawatan rendah.',
   '["Material polyethylene food-grade","Lapisan UV stabilizer, tahan terik matahari tropis","Tidak berbau plastik, aman untuk air minum","Ringan, mudah dipasang di dak rumah"]'::jsonb,
   '["SNI","Food-Grade Certified"]'::jsonb, 30),

  ('ttm-pro-1500', 'TTM Pro 1500', 1500, 'Stainless Steel', 5450000, 15, 'Komersial', '/images/placeholder-tank.svg', 'Food-grade SS 304', 120, 140,
   'Cocok untuk kafe, klinik kecil, dan kantor butik. Stainless Steel 304 menjaga kualitas air tetap bersih dan netral rasa — pilihan tepat saat kualitas air menjadi bagian dari standar layanan.',
   '["Stainless Steel 304 food-grade","Permukaan halus, mudah dibersihkan","Tahan korosi & perubahan cuaca ekstrem","Tidak menyerap bau atau warna"]'::jsonb,
   '["SNI","Food-Grade Certified","ISO 9001"]'::jsonb, 40),

  ('ttm-pro-3000', 'TTM Pro 3000', 3000, 'Stainless Steel', 8950000, 15, 'Komersial', '/images/placeholder-tank.svg', NULL, 145, 200,
   'Solusi untuk restoran, hotel boutique, dan gedung perkantoran kecil-menengah. Stainless Steel 304 dengan lasan rapi, mudah dibersihkan, dan disertai garansi 15 tahun.',
   '["Stainless Steel 304 food-grade","Permukaan halus, mudah dibersihkan","Tahan korosi & perubahan cuaca ekstrem","Tidak menyerap bau atau warna"]'::jsonb,
   '["SNI","Food-Grade Certified","ISO 9001"]'::jsonb, 50),

  ('ttm-industri-3000', 'TTM Industri 3000', 3000, 'Fiberglass', 9750000, 12, 'Industri', '/images/placeholder-tank.svg', NULL, 150, 195,
   'Ditujukan untuk pabrik kecil, fasilitas pertanian, dan utilitas. Fiberglass tebal yang tahan beban dan zat kimia ringan — pilihan andal di lingkungan operasi yang berat.',
   '["Fiberglass tebal multi-layer","Tahan beban tinggi & zat kimia ringan","Ideal untuk industri, gedung tinggi, dan utilitas","Insulasi termal alami menjaga suhu air"]'::jsonb,
   '["SNI","ISO 9001"]'::jsonb, 60),

  ('ttm-industri-5000', 'TTM Industri 5000', 5000, 'Fiberglass', 14500000, 12, 'Industri', '/images/placeholder-tank.svg', NULL, 180, 220,
   'Untuk gudang, pabrik menengah, dan kebutuhan air industri terpusat. Fiberglass multi-layer dengan insulasi termal alami yang membantu menjaga suhu air stabil.',
   '["Fiberglass tebal multi-layer","Tahan beban tinggi & zat kimia ringan","Ideal untuk industri, gedung tinggi, dan utilitas","Insulasi termal alami menjaga suhu air"]'::jsonb,
   '["SNI","ISO 9001"]'::jsonb, 70),

  ('ttm-industri-10000', 'TTM Industri 10000', 10000, 'Fiberglass', 26500000, 12, 'Industri', '/images/placeholder-tank.svg', 'Untuk pabrik & gedung tinggi', 220, 280,
   'Kapasitas industri besar untuk gedung tinggi, kawasan pabrik, dan fasilitas dengan kebutuhan air yang konsisten. Pemasangan didampingi tim teknis kami.',
   '["Fiberglass tebal multi-layer","Tahan beban tinggi & zat kimia ringan","Ideal untuk industri, gedung tinggi, dan utilitas","Insulasi termal alami menjaga suhu air"]'::jsonb,
   '["SNI","ISO 9001"]'::jsonb, 80)

ON CONFLICT (slug) DO NOTHING;
