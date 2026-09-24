# Voibee website

Voibee's public travel website, with its original page design, traveler area, partner storefronts and quotations. Administration, authentication, business logic, payments and APIs live in the separate `travels-portal` application.

## Development

Use Node 20.19+. Run `npm ci`, copy `.env.example` to `.env.local`, and configure the portal connection. Start Travels Portal on port 3001 and this website with `npm run dev -- --port 3000`.

- `PORTAL_API_URL`: server-only portal base URL (use `http://127.0.0.1:3001` locally to avoid IPv4/IPv6 resolution differences).
- `PORTAL_BUSINESS_SLUG`: fixed agency slug, `voibee`.
- `NEXT_PUBLIC_PORTAL_URL`: browser URL for Voibee administration (for example `http://voibee.localhost:3001`).
- Keep `NEXT_PUBLIC_APP_URL` and the existing WhatsApp configuration.

This application has no local API handlers, database connection, model layer or payment secrets. The Next.js proxy forwards browser `/api/*` requests to Travels Portal. Server-rendered pages read the portal's validated storefront API. Login cookies are served through the same-origin proxy; backend sessions are bound to Voibee's business ID. Old `/admin/*` links redirect to the agency management portal.

See the Travels Portal README for database registration, the platform owner bootstrap, payment configuration and deployment cutover. The portal must be deployed and configured before this website is switched over. Restart after changing server environment variables; rebuild after changing `NEXT_PUBLIC_*` variables.

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run build
```
