import postgres, { type Sql } from "postgres";

/**
 * Single Postgres client per process.
 *
 * Why globalThis caching: Next.js dev mode hot-reloads modules on every save.
 * Without the cache, every save opens a new pool and leaks connections until
 * Postgres starts refusing them. Caching on globalThis dodges this.
 *
 * Why max:1 in production: each Vercel serverless function instance is
 * effectively short-lived. Sharing one TCP connection per instance keeps the
 * total connection count manageable. For high-traffic apps, point DATABASE_URL
 * at a connection pooler (Neon's `-pooler` host, PgBouncer, etc.).
 */

type GlobalWithDb = typeof globalThis & { __ttmSql?: Sql };
const g = globalThis as GlobalWithDb;

export function getDb(): Sql {
  if (g.__ttmSql) return g.__ttmSql;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. See db/README.md for setup instructions.",
    );
  }

  const client = postgres(url, {
    max: process.env.NODE_ENV === "production" ? 1 : 5,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false, // safer with serverless poolers (PgBouncer in transaction mode)
  });

  if (process.env.NODE_ENV !== "production") {
    g.__ttmSql = client;
  }

  return client;
}
