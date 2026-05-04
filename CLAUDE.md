# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Development server (Turbopack, hot reload)
npm run build        # Production build — must pass before deploying
npm run typecheck    # TypeScript check without emitting
npm run lint         # ESLint
npm run migrate      # Apply pending SQL migrations against DATABASE_URL in .env.local
npm run hash-password "pw"  # Generate bcrypt hash for ADMIN_PASSWORD_HASH env var
```

No test suite exists yet. Use `npm run typecheck && npm run build` as the validation gate.

## Environment variables (.env.local)

```
DATABASE_URL             # Postgres connection string (pooled for Neon/PgBouncer)
SESSION_SECRET           # ≥32-byte hex string for JWT signing
ADMIN_PASSWORD_HASH      # bcrypt hash — generate with npm run hash-password
NEXT_PUBLIC_SITE_URL     # Full origin, no trailing slash
NEXT_PUBLIC_WHATSAPP_NUMBER  # International format without +, e.g. 6281327001001
```

## Architecture

### Request flow

Public pages are server components that call `src/lib/products-repo.ts` directly. Pages use `safeGetAllProducts()` (returns `[]` on DB error) so static prerendering doesn't fail when `DATABASE_URL` is unset at build time. Interactive behaviour (comparison bar, inquiry form) uses client components wired to Server Actions.

Admin routes (`/admin/*`) are gated by `src/middleware.ts` — Edge runtime, JWT-verified on every request before any page code runs.

### Key files and their roles

| File | Role |
|---|---|
| `src/config/site.ts` | Single source of truth for brand name, WhatsApp number, contact info, nav links. Edit here — nowhere else. |
| `src/lib/db.ts` | Lazy singleton `getDb()`. Caches on `globalThis` in dev to survive hot-reload without leaking connections. `max:1` in prod for serverless. `prepare:false` required for PgBouncer transaction-pool mode. |
| `src/lib/products-repo.ts` | All product DB queries. `getAllProducts()` throws; `safeGetAllProducts()` returns `[]`. Use the safe variant in page components. |
| `src/lib/inquiry-store.ts` | Inquiry DB queries. Same `getDb()` pattern. |
| `src/lib/auth.ts` | JWT sign/verify (jose, HS256, 8h TTL) + cookie helpers. Cookie is httpOnly + SameSite=lax + Secure in prod. |
| `src/middleware.ts` | Edge middleware — checks `ttm_session` JWT on every `/admin/*` except `/admin/login`. |
| `src/lib/rate-limit.ts` | In-memory token bucket per IP. Works per-instance in dev; swap to Upstash Redis for multi-instance production. |
| `src/lib/whatsapp.ts` | Builds `wa.me/` deep-links with prefilled Indonesian messages. `buildProductInquiryMessage()` and `buildProductQuoteMessage()` produce product-aware copy. |
| `src/lib/format.ts` | `formatRupiah()` and `formatLiter()` using `Intl.NumberFormat("id-ID")`. Always use these — never format numbers manually. |
| `src/lib/compare.ts` | URL serialization for the product comparison feature (`?p=slug1&p=slug2`). `parseCompareSlugsRaw()` deduplicates and caps at `MAX_COMPARE=4`. |
| `src/components/products/ProductsProvider.tsx` | Client-side Context. Layout fetches products once and provides to client components (CompareBar, InquiryForm dropdown). Server components call the repo directly. |
| `src/components/compare/CompareProvider.tsx` | Client-side selection state with `localStorage` persistence. Key: `ttm:compare`. |
| `db/migrate.mjs` | Plain Node migration runner. Reads `db/migrations/*.sql` in lexical order, tracks in `migrations` table, wraps each in a transaction. |

### Design system

Tailwind v4 CSS-first config in `src/app/globals.css` under `@theme`. Design tokens to use:

- `var(--color-paper)` — background (#faf8f4)
- `var(--color-ink)` — primary text (#0e1216)
- `var(--color-ink-soft)` — secondary text (#4a5159)
- `var(--color-line)` — borders (#e7e2d8)
- `var(--color-accent)` — deep teal (#1f3a4d)
- `var(--color-accent-soft)` — tint surface (#eef2f5)
- `var(--radius-sm/md/lg)` — 4/6/10px

All classnames that reference these use `[var(--color-xxx)]` syntax. Do not introduce new colours without adding a token here.

### Data mutations pattern

All writes go through Server Actions (`"use server"` files). The pattern is:
1. Validate with Zod schema from `src/lib/*-schema.ts`
2. Sanitize (Zod trims, transforms phone to `62...`)
3. Call repo function (parameterized queries via postgres.js template literals — never string concatenation)
4. Call `revalidatePath()` on affected routes
5. Return a typed state object (`{ ok, error, fieldErrors, values }`) — `values` echoes input back so forms re-populate on error

### Database migrations

Add new migrations as `db/migrations/NNNN_description.sql` where `NNNN` increments. Use `IF NOT EXISTS` guards. Run `npm run migrate` locally and against the production `DATABASE_URL` separately — migrations are never auto-run at deploy time.

Current tables: `inquiries`, `products`, `migrations`.
