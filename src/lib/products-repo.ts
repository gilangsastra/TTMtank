import { getDb } from "@/lib/db";
import type { Product, Material, UseCase } from "@/data/products";
import type { ProductInput } from "@/lib/product-schema";

type DbRow = {
  slug: string;
  name: string;
  capacityLiters: number;
  material: Material;
  priceIdr: number;
  warrantyYears: number;
  useCase: UseCase;
  imageUrl: string;
  highlight: string | null;
  diameterCm: number;
  heightCm: number;
  description: string;
  features: string[];
  certifications: string[];
  sortOrder: number;
};

const SELECT_COLS = `
  slug,
  name,
  capacity_liters AS "capacityLiters",
  material,
  price_idr AS "priceIdr",
  warranty_years AS "warrantyYears",
  use_case AS "useCase",
  image_url AS "imageUrl",
  highlight,
  diameter_cm AS "diameterCm",
  height_cm AS "heightCm",
  description,
  features,
  certifications,
  sort_order AS "sortOrder"
`;

function fromRow(r: DbRow): Product {
  return {
    slug: r.slug,
    name: r.name,
    capacityLiters: r.capacityLiters,
    material: r.material,
    priceIDR: r.priceIdr,
    warrantyYears: r.warrantyYears,
    useCase: r.useCase,
    imageUrl: r.imageUrl,
    highlight: r.highlight ?? undefined,
    dimensions: { diameterCm: r.diameterCm, heightCm: r.heightCm },
    description: r.description,
    features: r.features,
    certifications: r.certifications,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const sql = getDb();
  const rows = await sql<DbRow[]>`
    SELECT ${sql.unsafe(SELECT_COLS)} FROM products
    ORDER BY sort_order, name
  `;
  return rows.map(fromRow);
}

/**
 * Same as getAllProducts() but returns [] instead of throwing when the
 * database is unavailable (e.g. local build without DATABASE_URL set).
 * Use this in page components so static generation doesn't fail.
 */
export async function safeGetAllProducts(): Promise<Product[]> {
  try {
    return await getAllProducts();
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const sql = getDb();
  const rows = await sql<DbRow[]>`
    SELECT ${sql.unsafe(SELECT_COLS)} FROM products
    WHERE slug = ${slug}
    LIMIT 1
  `;
  return rows[0] ? fromRow(rows[0]) : null;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const sql = getDb();
  const rows = await sql<DbRow[]>`
    INSERT INTO products
      (slug, name, capacity_liters, material, price_idr, warranty_years,
       use_case, image_url, highlight, diameter_cm, height_cm, description,
       features, certifications, sort_order)
    VALUES (
      ${input.slug}, ${input.name}, ${input.capacityLiters}, ${input.material},
      ${input.priceIDR}, ${input.warrantyYears}, ${input.useCase},
      ${input.imageUrl}, ${input.highlight ?? null},
      ${input.diameterCm}, ${input.heightCm}, ${input.description},
      ${sql.json(input.features)}, ${sql.json(input.certifications)},
      ${input.sortOrder}
    )
    RETURNING ${sql.unsafe(SELECT_COLS)}
  `;
  if (!rows[0]) throw new Error("Insert returned no row");
  return fromRow(rows[0]);
}

export async function updateProduct(
  originalSlug: string,
  input: ProductInput,
): Promise<Product> {
  const sql = getDb();
  const rows = await sql<DbRow[]>`
    UPDATE products SET
      slug = ${input.slug},
      name = ${input.name},
      capacity_liters = ${input.capacityLiters},
      material = ${input.material},
      price_idr = ${input.priceIDR},
      warranty_years = ${input.warrantyYears},
      use_case = ${input.useCase},
      image_url = ${input.imageUrl},
      highlight = ${input.highlight ?? null},
      diameter_cm = ${input.diameterCm},
      height_cm = ${input.heightCm},
      description = ${input.description},
      features = ${sql.json(input.features)},
      certifications = ${sql.json(input.certifications)},
      sort_order = ${input.sortOrder}
    WHERE slug = ${originalSlug}
    RETURNING ${sql.unsafe(SELECT_COLS)}
  `;
  if (!rows[0]) throw new Error("Product not found");
  return fromRow(rows[0]);
}

export async function deleteProduct(slug: string): Promise<void> {
  const sql = getDb();
  await sql`DELETE FROM products WHERE slug = ${slug}`;
}
