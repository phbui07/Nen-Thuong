# Nến Thương

The online store for Nến Thương, a student-led social enterprise that makes and sells handmade scented candles and donates the profits. The site is in Vietnamese and English and includes its own admin dashboard at `/admin`.

## Getting Started

```bash
git clone https://github.com/phbui07/Nen-Thuong
cd Nen-Thuong
cp .env.example .env.local   # then add your Clerk secret key
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Locally you don't need a database: without `DATABASE_URL`, the site uses a built-in development database stored in `.data/` (gitignored). Delete that folder to start fresh.

### Prerequisites

- Node.js 24 or later (also used for Vercel deployments via `engines` in `package.json`)
- A [Clerk](https://clerk.com) application for sign-in

### Environment variables

See [.env.example](.env.example). `.env.local` is gitignored and is loaded by `next dev`, `next build` and `next start`. Never commit real keys.

| Variable | Needed | What it's for |
| --- | --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Yes | Sign-in |
| `DATABASE_URL` | In production | Postgres for products, photos, orders and settings |
| `ADMIN_EMAILS` | No | Comma-separated admin emails. Defaults to `ph.bui07@gmail.com` |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | No | Card payments. Without them, card payment isn't offered |
| `NEXT_PUBLIC_API_URL` | No | The old admin's API, only for "Import from the old admin" |

## Deploying on Vercel

Every push to `main` deploys to production.

1. **Connect a database (once).** In the Vercel project, open **Storage → Create Database → Neon (Postgres)** on the free plan and connect it to the project. Vercel adds `DATABASE_URL` for you. Then **Deployments → Redeploy** the latest deployment. The tables create themselves on first use.
2. **Sign in at `/admin`** with a verified `ph.bui07@gmail.com` Clerk account (or an address in `ADMIN_EMAILS`).
3. **Set up the shop** from the dashboard checklist: categories, sizes, products with photos, then payments under **Settings**.

### Payments

Turn each method on or off in **Admin → Settings**:

- **Bank transfer (VietQR):** choose the bank and enter the account number and name. After ordering, customers see a QR code with the amount and order code filled in. Mark the order as paid in **Admin → Orders** once the money arrives.
- **Cash on delivery:** on by default. Mark orders as paid when they're delivered.
- **Card (Stripe):** add `STRIPE_SECRET_KEY` in Vercel. Prices are charged in VND. Also create a Stripe webhook for `checkout.session.completed` pointing to `https://<your-site>/api/webhooks/stripe`, and add its signing secret as `STRIPE_WEBHOOK_SECRET`. Orders are also confirmed when customers return from Stripe, so the webhook is a backup.

## Scripts

```bash
npm run dev     # development server
npm run build   # production build
npm run start   # production server (after build)
npm run lint    # ESLint
```

## Project structure

- `app/(routes)` – store pages: home, about, products, cart, checkout, orders
- `app/admin` – admin dashboard; `app/admin/actions.ts` holds its server actions
- `app/api` – product photos, photo uploads and the Stripe webhook
- `lib/db` – database access (schema in `lib/db/schema.ts`)
- `lib/i18n/dictionaries.ts` – all site text in Vietnamese and English
- `lib/auth.ts` – signed-in user and admin checks

## Technologies Used

- **Next.js 15** and **React 19** with **TypeScript**
- **Clerk** for sign-in, with Vietnamese translations from `@clerk/localizations`
- **Postgres** (Neon in production via `postgres`; PGlite locally)
- **Stripe** for optional card payments and **VietQR** for bank transfer QR codes
- **Tailwind CSS**, **Radix UI**, **Lucide** icons and **react-hot-toast**
- **Zustand** for the cart and favorites saved in the browser
