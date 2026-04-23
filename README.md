# Events BG

A full-stack concierge ticket reselling platform built with Next.js 15, TypeScript, Tailwind CSS, Prisma, Supabase, Stripe, Clerk, Uploadthing, and Resend.

## How It Works

Customers browse events on the site and pay the exact ticket price plus a €5 per-ticket service fee. The admin team then manually purchases the ticket from the official vendor using the customer's provided name, email, and phone. The vendor delivers the ticket directly to the customer's email. We never hold inventory.

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM + Supabase PostgreSQL
- **Auth**: Clerk (admin-only)
- **Payments**: Stripe Checkout
- **Image Uploads**: Uploadthing
- **Email**: Resend + React Email

---

## Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd eventsbg
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

**Required services:**

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | [Supabase](https://supabase.com) → Project → Settings → Database → Connection string (Transaction pooler) |
| `DIRECT_URL` | Supabase → Database → Connection string (Session pooler or direct) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | [Clerk Dashboard](https://dashboard.clerk.com) → API Keys |
| `CLERK_SECRET_KEY` | Clerk Dashboard → API Keys |
| `STRIPE_SECRET_KEY` | [Stripe Dashboard](https://dashboard.stripe.com) → Developers → API Keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API Keys |
| `STRIPE_WEBHOOK_SECRET` | See Stripe webhook setup below |
| `UPLOADTHING_TOKEN` | [Uploadthing Dashboard](https://uploadthing.com) → App → API Keys |
| `RESEND_API_KEY` | [Resend Dashboard](https://resend.com) → API Keys |

### 3. Set up the database

Push the Prisma schema to your Supabase database:

```bash
npm run db:push
```

To generate the Prisma client after schema changes:

```bash
npm run db:generate
```

To open Prisma Studio:

```bash
npm run db:studio
```

### 4. Set up Clerk

1. Create a Clerk application at [dashboard.clerk.com](https://dashboard.clerk.com)
2. Copy the publishable and secret keys to `.env.local`
3. In your Clerk dashboard, add the following redirect URLs:
   - Sign-in URL: `/sign-in`
   - After sign-in URL: `/admin`

### 5. Set up Stripe Webhooks

**For local development:**

Install the Stripe CLI and run:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret printed by the CLI into `STRIPE_WEBHOOK_SECRET`.

**For production:**

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select event: `checkout.session.completed`
4. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/
│   ├── (public pages)
│   │   ├── page.tsx              # Homepage
│   │   ├── events/page.tsx       # Events listing
│   │   ├── events/[slug]/        # Event detail
│   │   ├── checkout/[eventId]/   # Checkout form
│   │   └── checkout/success/     # Post-payment success
│   ├── admin/
│   │   ├── page.tsx              # Admin dashboard
│   │   ├── events/               # Event management
│   │   └── orders/[id]/          # Order detail + actions
│   └── api/
│       ├── webhooks/stripe/      # Stripe webhook handler
│       └── uploadthing/          # Image upload handler
├── actions/                      # Server actions
├── components/                   # React components
├── emails/                       # React Email templates
└── lib/                          # Shared utilities
```

---

## Deploying to Vercel

1. Push your code to a GitHub repository
2. Import the project in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.example`
4. Deploy

**Important Vercel settings:**
- Framework Preset: Next.js
- Node.js Version: 20.x or later

**After deploying:**
- Update `NEXT_PUBLIC_SITE_URL` to your production URL
- Update Stripe webhook endpoint URL to your production domain
- Update Clerk redirect URLs in the dashboard

---

## Admin Access

Navigate to `/admin` — you will be redirected to Clerk's sign-in page. Only signed-in users can access admin routes.

**First-time setup:** Create a user account in your Clerk dashboard, or use Clerk's hosted sign-in flow at `/sign-in`.

---

## Service Fee

The service fee is €5 per ticket (`SERVICE_FEE_CENTS = 500` in `src/lib/stripe.ts`). This fee is non-refundable and covers the cost of manually purchasing tickets from the vendor.

To change the fee, update `SERVICE_FEE_CENTS` in `src/lib/stripe.ts`.
