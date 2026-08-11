# BulkMart - Wholesale Retail Website

A full-stack wholesale e-commerce platform inspired by [99 Bulksales](https://www.99bulksales.my/). Built with **Next.js 15**, **Supabase**, and **Stripe**.

## Features

- **Homepage** — Hero search, categories, promotions carousel, new arrivals, how-it-works, benefits, FAQ
- **Product catalog** — Browse, search, and filter by category
- **Product detail pages** — Individual product views with add-to-cart
- **Shopping cart** — Persistent cart (localStorage), RM500 minimum order threshold, delivery progress bar
- **Checkout** — Stripe payment integration (falls back to demo orders without keys)
- **Authentication** — Supabase Auth login/register and account dashboard
- **Database** — Supabase Postgres with RLS policies for categories, products, and orders

## Quick Start (no secrets required)

The app runs with built-in mock product data when Supabase is not configured:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server only) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_APP_URL` | Public app URL (e.g. `https://senglee-shop.vercel.app`) |
| `MIN_ORDER_AMOUNT` | Fallback minimum checkout when DB is unavailable (default: 500) |
| `ADMIN_EMAILS` | Comma-separated emails allowed to access `/admin` |
| `SUPABASE_DB_PASSWORD` | Database password — migration scripts only, not synced to Vercel |

## Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Add your Supabase URL and keys to `.env.local`
3. Run all migrations: `npm run db:setup`
4. Enable Email auth in Supabase Authentication settings

## Stripe Webhooks

After checkout, Stripe notifies the app to mark orders as **paid**. The webhook endpoint is:

`/api/webhooks/stripe`

### Local development

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the `whsec_...` signing secret into `.env.local` as `STRIPE_WEBHOOK_SECRET`, then restart the dev server.

### Production (Vercel)

1. In [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks), add endpoint: `https://senglee-shop.vercel.app/api/webhooks/stripe`
2. Enable events: `checkout.session.completed`, `checkout.session.expired`
3. Reveal the **Signing secret** and set it as `STRIPE_WEBHOOK_SECRET` on Vercel

## Deploy to Vercel

The store is hosted on Vercel at **https://senglee-shop.vercel.app**.

1. Push this repo to GitHub (`numeraxia/senglee.shop`) — Vercel auto-deploys from `main`
2. Environment variables are managed in the [Vercel project settings](https://vercel.com/numeraxias-projects/senglee-shop/settings/environment-variables)
3. To sync local env vars to Vercel after changes: `npm run vercel:env`
4. Manual production deploy: `node node_modules/vercel/dist/index.js deploy --prod --yes`
5. Optional: add custom domain `senglee.shop` in Vercel → Domains
6. After confirming Vercel is live, retire the old Render service: `npm run render:retire`

## NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start local dev server |
| `npm run db:setup` | Apply all Supabase migrations |
| `npm run db:migrate:company` | Apply company details migration only |
| `npm run vercel:env` | Sync `.env.local` → Vercel env vars |
| `npm run render:retire` | Delete the old Render web service |

## Project Structure

```
app/                  # Next.js App Router pages
components/           # React UI components
lib/                  # Data, cart context, Supabase clients
supabase/migrations/  # Database schema + seed data
legacy/               # Original static HTML prototype
```

## Minimum Order

RM 500.00 — Checkout is disabled until the cart meets this threshold.
