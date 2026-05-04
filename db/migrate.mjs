import postgres from "postgres";
import { readdir, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dirname, "migrations");

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("✗ DATABASE_URL is not set.");
  console.error("  Create .env.local and add: DATABASE_URL=postgres://...");
  console.error("  See db/README.md for setup instructions.");
  process.exit(1);
}

const sql = postgres(url, { max: 1, idle_timeout: 5 });

async function ensureMigrationsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS migrations (
      name        TEXT PRIMARY KEY,
      applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

async function getApplied() {
  const rows = await sql`SELECT name FROM migrations`;
  return new Set(rows.map((r) => r.name));
}

async function listMigrationFiles() {
  const files = await readdir(MIGRATIONS_DIR);
  return files.filter((f) => f.endsWith(".sql")).sort();
}

async function applyMigration(name) {
  const path = join(MIGRATIONS_DIR, name);
  const content = await readFile(path, "utf-8");
  await sql.begin(async (tx) => {
    await tx.unsafe(content);
    await tx`INSERT INTO migrations (name) VALUES (${name})`;
  });
}

async function main() {
  console.log("→ Connecting...");
  await ensureMigrationsTable();

  const applied = await getApplied();
  const all = await listMigrationFiles();
  const pending = all.filter((name) => !applied.has(name));

  if (pending.length === 0) {
    console.log("✓ Database is up to date.");
    return;
  }

  for (const name of pending) {
    process.stdout.write(`→ Applying ${name}... `);
    try {
      await applyMigration(name);
      console.log("✓");
    } catch (err) {
      console.log("✗");
      throw err;
    }
  }

  console.log(
    `✓ Applied ${pending.length} migration${pending.length === 1 ? "" : "s"}.`,
  );
}

try {
  await main();
} catch (err) {
  console.error("\nMigration failed:");
  // Log every useful property so we can diagnose connection issues
  if (err && typeof err === "object") {
    if (err.message) console.error("  message  :", err.message);
    if (err.code)    console.error("  code     :", err.code);
    if (err.errno)   console.error("  errno    :", err.errno);
    if (err.address) console.error("  address  :", err.address);
    if (err.port)    console.error("  port     :", err.port);
    if (!err.message) console.error(err);
  } else {
    console.error(err);
  }
  process.exit(1);
} finally {
  await sql.end({ timeout: 5 });
}
