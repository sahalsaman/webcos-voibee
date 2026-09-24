@AGENTS.md

# Voibee — project guide for Claude

Public travel marketplace & white-label trip reseller. Operators publish trips in
the separate Travels Portal;
partners resell them via branded links (`/p/<partner>/<trip>`) for commission;
travelers book. Roles: **admin · partner · traveler**.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Travels Portal API ·
Auth.js client · Razorpay checkout client · Cloudinary · React Hook Form + Zod ·
Framer Motion · Recharts. Path alias `@/*` → repo root (no `src/`).

## Commands

```bash
npm run dev            # dev server (Turbopack)
npm run build          # production build
npm run typecheck      # tsc --noEmit  (run after changes)
npm run lint
npm install --legacy-peer-deps   # peer deps need this flag
```

Demo accounts (password `Password123!`): `admin@voibee.com`,
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
app/{partner,traveler}/   User dashboards (server layout = requireRole guard)
lib/portal-client.ts      Server RPC/session client for Travels Portal
lib/data.ts, dashboard.ts Typed portal-client wrappers
lib/             client utilities, validation, formatting and constants
components/ui/   shadcn-style primitives;  components/{dashboard,admin,partner,trip,booking,home,site}/
auth.ts          Remote Travels Portal session adapter
```

## Conventions (follow these)

- **Data/API access**: browser `/api/*` calls are rewritten by `proxy.ts` to Travels
  Portal. Server components call typed wrappers backed by `lib/portal-client.ts`.
  Never add database models, auth secrets, payment secrets, or local API handlers.
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

- Payment credentials and verification live in Travels Portal. There is no mock
  payment-success mode.
- Booking confirmation (`/api/payments/verify`) is idempotent, decrements seats
  atomically, and writes the partner Commission ledger + earnings.
- `.env.example` is force-tracked (`.gitignore` has `!.env.example`); `.env*` ignored.
- Home (`app/(site)/page.tsx`) uses `export const revalidate = 60`.
