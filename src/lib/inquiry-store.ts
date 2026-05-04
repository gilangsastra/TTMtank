import { getDb } from "@/lib/db";
import type { InquiryInput } from "@/lib/inquiry-schema";

export type StoredInquiry = {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  productSlug: string;
  message: string;
  ip: string;
  userAgent: string | null;
  createdAt: Date;
};

type DbRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  city: string;
  productSlug: string | null;
  message: string;
  ip: string | null;
  userAgent: string | null;
  createdAt: Date;
};

function fromRow(r: DbRow): StoredInquiry {
  return {
    id: r.id,
    name: r.name,
    phone: r.phone,
    email: r.email ?? "",
    city: r.city,
    productSlug: r.productSlug ?? "",
    message: r.message,
    ip: r.ip ?? "unknown",
    userAgent: r.userAgent,
    createdAt: r.createdAt,
  };
}

export async function saveInquiry(
  data: InquiryInput,
  meta: { ip: string; userAgent: string | null },
): Promise<StoredInquiry> {
  const sql = getDb();
  const rows = await sql<DbRow[]>`
    INSERT INTO inquiries
      (name, phone, email, city, product_slug, message, ip, user_agent)
    VALUES (
      ${data.name},
      ${data.phone},
      ${data.email && data.email.length > 0 ? data.email : null},
      ${data.city},
      ${data.productSlug && data.productSlug.length > 0 ? data.productSlug : null},
      ${data.message},
      ${meta.ip},
      ${meta.userAgent}
    )
    RETURNING
      id,
      name,
      phone,
      email,
      city,
      product_slug AS "productSlug",
      message,
      ip,
      user_agent AS "userAgent",
      created_at AS "createdAt"
  `;

  if (!rows[0]) {
    throw new Error("Insert returned no row");
  }
  return fromRow(rows[0]);
}

export async function listInquiries(limit = 100): Promise<StoredInquiry[]> {
  const sql = getDb();
  const rows = await sql<DbRow[]>`
    SELECT
      id,
      name,
      phone,
      email,
      city,
      product_slug AS "productSlug",
      message,
      ip,
      user_agent AS "userAgent",
      created_at AS "createdAt"
    FROM inquiries
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return rows.map(fromRow);
}
