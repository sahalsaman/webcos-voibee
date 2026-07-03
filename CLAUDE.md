@AGENTS.md

# Tripnox — project guide for Claude

Travel marketplace & white-label trip reseller. Operators publish trips;
partners resell them via branded links (`/p/<partner>/<trip>`) for commission;
travelers book. Roles: **admin · partner · traveler**.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · MongoDB/Mongoose ·
Auth.js v5 · Razorpay · Cloudinary · React Hook Form + Zod · TanStack Query ·
Framer Motion · Recharts. Path alias `@/*` → repo root (no `src/`).

## Commands

```bash
npm run dev            # dev server (Turbopack)
npm run build          # production build
npm run typecheck      # tsc --noEmit  (run after changes)
npm run lint
npm run seed           # scripts/seed.mjs — wipes & loads demo data
npm install --legacy-peer-deps   # peer deps need this flag
```

Demo accounts (password `Password123!`): `admin@tripnox.com`,
`sahal@example.com` (partner, storefront `/p/sahal/goa-beach-escape`),
`aarav@example.com` (traveler).

## ⚠️ This is Next.js 16, NOT 14/15

- `params`, `searchParams`, `cookies()`, `headers()` are **async Promises** — always `await`.
- Middleware is **`proxy.ts`** (root), exporting `proxy()` + `config.matcher`.
- Tailwind v4: `@import "tailwindcss"` + `@theme` in `app/globals.css`; class-based
  dark mode via `@custom-variant dark`. No `tailwind.config`.
- Turbopack is the default bundler. Read `node_modules/next/dist/docs/` before
  using unfamiliar APIs.

## Architecture

```
app/(site)/      Public site (navbar/footer layout): home, trips, trips/[slug]
app/(auth)/      login, register (split-screen layout)
app/p/[partner]/[trip]   White-label trip pages (partner-branded)
app/{admin,partner,traveler}/   Role dashboards (server layout = requireRole guard)
app/api/         Route handlers
models/          Mongoose schemas + models/index.ts barrel (registers all)
lib/             db, commission, data (public), dashboard (queries), razorpay,
                 api (route helpers), session, validations, utils, constants
components/ui/   shadcn-style primitives;  components/{dashboard,admin,partner,trip,booking,home,site}/
auth.ts          Auth.js (Node, has DB/bcrypt)   auth.config.ts (edge-safe base)
```

## Conventions (follow these)

- **DB access**: server components/data fns call `connectDB()` then query with
  `.lean()`, wrap in `lib/data.ts`'s `safe()` (returns fallback if DB down) and
  `serialize()` before passing to client. `import "@/models"` before any `populate`.
- **API routes**: use helpers in `lib/api.ts` — `ok()`, `fail()`, `handleError(err)`
  (in the `catch`; passes Zod→422, dup-key→409, thrown auth Response through),
  `requireApiRole([...])` (throws a Response), `currentUser()`. Validate input with
  Zod schemas from `lib/validations.ts` **before** DB work.
- **Auth guards**: pages/layouts use `requireRole([...])` / `requireUser()` from
  `lib/session.ts`. `proxy.ts` is only an optimistic cookie check.
- **Pricing**: never hand-roll money math — use `calculateCommission()` /
  `sellingPrice()` from `lib/commission.ts`. Platform fee comes out of the
  partner's commission (traveler price unaffected); configurable in Settings.
- **Server → client boundary**: don't pass functions (e.g. Lucide icon
  components) across it. Dashboard navs live in `components/dashboard/role-shell.tsx`
  (client); server layouts pass only serializable props.
- **UI**: `cn()` for classes; `formatINR` / `formatDate` / `tripDuration` from
  `lib/utils.ts`; provide loading/empty/error states (`Skeleton`, `EmptyState`).
  Mobile-first, dark-mode-aware, glassmorphism (`.glass`, `.text-gradient`,
  `.bg-brand-gradient`).
- **Money**: stored in rupees (Razorpay amounts ×100 to paise at the gateway only).

## Gotchas

- No Razorpay keys → checkout runs in **demo mode** (`/api/bookings` returns
  `mock:true`, `/api/payments/verify` confirms without a charge).
- Booking confirmation (`/api/payments/verify`) is idempotent, decrements seats
  atomically, and writes the partner Commission ledger + earnings.
- `.env.example` is force-tracked (`.gitignore` has `!.env.example`); `.env*` ignored.
- Home (`app/(site)/page.tsx`) uses `export const revalidate = 60`.
