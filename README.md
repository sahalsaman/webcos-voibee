# 🧭 Tripnox

**Travel marketplace & white-label trip reseller platform.**

Operators publish travel packages. Partners (agencies, influencers, community
leaders) resell them through branded white-label links and earn commissions.
Travelers discover and book trips. Built with the Next.js 16 App Router.

---

## ✨ Features

- **Public marketplace** — premium home page, trip search & filters, rich trip
  detail pages with itinerary/gallery/reviews, SEO (dynamic metadata, OpenGraph,
  sitemap, robots, JSON-LD).
- **Role-based auth** (Auth.js v5) — Admin, Partner, Traveler.
- **Admin panel** — dashboard with charts, trip CRUD, booking management,
  partner approval, commission/platform-fee settings, reports with CSV/PDF export.
- **Partner portal** — dashboard, browse & create white-label links, link
  manager, bookings, earnings ledger, profile/branding.
- **Traveler portal** — bookings, wishlist, upcoming/completed trips.
- **White-label pages** — `tripnox.com/p/<partner>/<trip>` with partner branding
  and "Powered by Tripnox".
- **Commission engine** — configurable platform fee; automatic split of every
  booking into partner earnings vs. operator revenue.
- **Razorpay** payments with signature verification (plus a built-in demo mode
  when keys aren't configured).
- **Polished UX** — dark/light mode, glassmorphism, animations, loading
  skeletons, empty & error states, mobile-first responsive design.

## 🧰 Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · MongoDB +
Mongoose · Auth.js v5 · Razorpay · Cloudinary · React Hook Form + Zod · TanStack
Query · Framer Motion · Recharts · shadcn-style UI primitives.

---

## 🚀 Getting started

### 1. Install

```bash
npm install --legacy-peer-deps
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`. The minimum to run locally:

| Variable | Required | Notes |
| --- | --- | --- |
| `MONGODB_URI` | ✅ | Local `mongodb://127.0.0.1:27017/tripnox` or MongoDB Atlas |
| `AUTH_SECRET` | ✅ | `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | ✅ | e.g. `http://localhost:3000` |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | optional | Without these, checkout runs in **demo mode** (bookings auto-confirm) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | optional | Same key id, exposed to the checkout widget |
| `CLOUDINARY_*` | optional | For media uploads (image URLs also work directly) |

### 3. Seed demo data

```bash
npm run seed
```

Creates an admin, partners, travelers, 8 trips, white-label links, bookings,
commissions and reviews. Default password for all demo accounts is
`Password123!` (override with `SEED_PASSWORD`).

| Role | Email |
| --- | --- |
| Admin | `admin@tripnox.com` |
| Partner | `sahal@example.com` → storefront at `/p/sahal/goa-beach-escape` |
| Traveler | `aarav@example.com` |

### 4. Run

```bash
npm run dev      # http://localhost:3000
```

Other scripts: `npm run build`, `npm start`, `npm run lint`, `npm run typecheck`.

---

## 💸 Commission engine

`lib/commission.ts` is the single source of truth (pure & unit-testable).

```
Base price        ₹10,000   (set by operator)
Partner commission ₹1,000   (set by partner per white-label link)
─────────────────────────
Traveler pays     ₹11,000   = base + commission
Partner earns      ₹1,000   = commission − platform fee
Operator receives ₹10,000   = base + platform fee
```

The **platform fee** is configurable in Admin → Settings (a % of the commission
and/or a flat amount per seat) and is taken out of the partner's commission, so
the traveler's price never changes. Direct bookings (no partner) have zero
commission. Every money field scales by seat count.

## 🔗 White-label system

A partner picks a trip, sets a commission, and a `PartnerTrip` record is created
that resolves the public URL `/p/<partnerSlug>/<tripSlug>`. The page renders with
the partner's branding (logo, banner, business name) while keeping "Powered by
Tripnox". Bookings through the link are attributed to the partner and credited to
their earnings ledger automatically on payment.

---

## 🗂️ Project structure

```
app/
  (site)/            Public marketing site (navbar/footer layout)
    page.tsx           Home
    trips/             Listing + [slug] detail
  (auth)/            Login / Register (split-screen layout)
  p/[partner]/[trip] White-label trip pages
  admin/             Admin dashboard (role-guarded layout)
  partner/           Partner portal
  traveler/          Traveler portal
  api/               Route handlers (auth, trips, bookings, payments, …)
  sitemap.ts robots.ts
components/
  ui/                shadcn-style primitives (button, card, input, …)
  site/ home/ trip/ booking/ dashboard/ admin/ partner/
lib/
  db.ts              Cached Mongoose connection
  commission.ts      Pricing engine
  data.ts            Public data access (serialized DTOs)
  dashboard.ts       Dashboard queries & aggregations
  razorpay.ts api.ts session.ts validations.ts utils.ts constants.ts
models/              Mongoose schemas (User, Partner, Trip, PartnerTrip,
                     Booking, Payment, Commission, Review, Wishlist,
                     Notification, Settings)
auth.ts auth.config.ts   Auth.js v5 setup
proxy.ts             Next 16 Proxy (optimistic route protection)
scripts/seed.mjs     Demo data seeder
```

> **Next 16 notes:** `params`/`searchParams`/`cookies()`/`headers()` are async;
> middleware is `proxy.ts`; Tailwind v4 uses `@import "tailwindcss"` + `@theme`.

---

## ☁️ Deployment (Vercel + MongoDB Atlas)

1. **MongoDB Atlas** — create a free cluster, a DB user, allow network access
   (`0.0.0.0/0` for Vercel), and copy the connection string into `MONGODB_URI`.
2. **Push** the repo to GitHub and **import** it into Vercel.
3. **Environment variables** — add everything from `.env.example` in the Vercel
   project settings. Set `NEXT_PUBLIC_APP_URL` to your production domain and
   `AUTH_TRUST_HOST=true`.
4. **Deploy.** Vercel runs `next build` automatically.
5. **Seed (optional, once)** — run `npm run seed` locally against the production
   `MONGODB_URI`, or create the admin account via the register flow and switch
   its `role` to `admin` in the database.
6. **Razorpay** — add live keys and, in the Razorpay dashboard, point the webhook
   to your domain. Until keys are added the app uses demo-mode checkout.

### Production checklist

- [ ] `AUTH_SECRET` set to a strong random value
- [ ] `MONGODB_URI` points at Atlas (not localhost)
- [ ] `NEXT_PUBLIC_APP_URL` = production URL (used by white-label links, OG, sitemap)
- [ ] Razorpay live keys configured
- [ ] Cloudinary configured if using uploads
- [ ] At least one user promoted to `admin`

---

## 🧭 Notes & extension points

- **Demo mode**: with no Razorpay keys, `POST /api/bookings` returns `mock:true`
  and bookings confirm without a real charge — handy for local development.
- **Notifications**: in-app notifications are persisted; wiring email (e.g.
  Resend/Nodemailer) and WhatsApp (e.g. Twilio/Meta) into
  `models/Notification` + the booking/payment flow is a drop-in extension.
- **Media uploads**: trip & branding images accept URLs out of the box; a
  Cloudinary unsigned-upload widget can be added via the configured preset.
- **Payouts**: partner earnings accrue as a ledger (`Commission`); a payout
  processor (Razorpay Payouts/RazorpayX) can settle `pending → paid`.
