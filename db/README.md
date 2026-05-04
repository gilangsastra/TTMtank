# Database

PostgreSQL persistence for inquiries.

## Quick start (recommended): Neon

Neon offers serverless Postgres with a generous free tier and no credit card.

1. Sign up at https://neon.tech
2. Create a project — region: pick the closest to your users (Singapore is good for Indonesia)
3. Copy the connection string. Use the **pooled** version (host ends in `-pooler`) for application use:
   ```
   postgres://user:password@ep-xxxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
4. Add to `.env.local`:
   ```
   DATABASE_URL=postgres://...
   ```
5. Run migrations:
   ```bash
   npm run migrate
   ```

## Alternative: Supabase

Same flow as Neon. Use the **Connection Pooling** string (Transaction mode, port 6543) for application use.

## Alternative: local Postgres (Windows)

1. Install Postgres via the official installer: https://www.postgresql.org/download/windows/
2. Create a database (using the bundled `psql` or pgAdmin):
   ```sql
   CREATE DATABASE ttm_tank;
   ```
3. Add to `.env.local`:
   ```
   DATABASE_URL=postgres://postgres:yourpassword@localhost:5432/ttm_tank
   ```
4. Run migrations:
   ```bash
   npm run migrate
   ```

## Migrations

Plain SQL files in `db/migrations/`, applied in lexical order. Tracked in a
`migrations` table so each is applied exactly once.

### Creating a new migration

Name it `NNNN_description.sql` where `NNNN` increments — e.g. `0002_add_products_table.sql`.
Use `IF NOT EXISTS` guards on `CREATE TABLE` / `CREATE INDEX` for safety.

### Running

```bash
npm run migrate
```

The script reads `DATABASE_URL` from `.env` or `.env.local` (whichever exists).
Each migration runs inside a transaction — if it fails, nothing is partially applied.

### Production deployment

Run `npm run migrate` against your production `DATABASE_URL` once per release.
You can do this manually before `git push` to main, via a CI step, or via Vercel's
post-build hook. Decision deferred to Step 8 (deployment) so we can choose the
cleanest path for the real production setup.

## Inspecting data

```bash
# Connect with psql
psql "$DATABASE_URL"

# Or via Neon's web SQL editor (Tables → inquiries → Browse)
```

Useful queries:

```sql
-- Recent leads
SELECT created_at, name, phone, city, product_slug
FROM inquiries
ORDER BY created_at DESC
LIMIT 20;

-- Leads per product
SELECT product_slug, COUNT(*) AS n
FROM inquiries
WHERE product_slug IS NOT NULL
GROUP BY product_slug
ORDER BY n DESC;
```
