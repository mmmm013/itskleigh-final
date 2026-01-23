This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Deployment (Best Practices)

1. Copy environment template and fill secrets locally:

```bash
cp .env.example .env.local
# edit .env.local and add keys (Supabase, Stripe, etc.)
```

2. Run a local production build to verify:

```bash
npm ci
npm run build
```

3. CI: this repo includes a GitHub Actions workflow at `.github/workflows/ci.yml` that runs lint and build on push/PR. To enable automatic Vercel deploys from CI, add the following repository secrets in GitHub: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

4. Manual deploy (CLI):

```bash
npx vercel login
npx vercel --prod
```

If you want, I can initialize a Git repo in this folder (so CI and standard Vercel flows work) and commit these changes — say the word and I'll do it.

## Supabase Migrations

This repo includes a Supabase migration to enforce idempotent entitlements created by Stripe webhooks. The migration SQL is at:

- `supabase/migrations/20260123170000_add_entitlements_unique_session.sql`

Apply it in one of these ways:

- Use the Supabase Dashboard: open your project → SQL editor → paste the SQL file contents and run.
- Or run with `psql` against your Postgres instance:

```bash
psql "postgresql://<user>:<password>@<host>:5432/<db>" -f supabase/migrations/20260123170000_add_entitlements_unique_session.sql
```

Note: Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in your environment for the webhook route to insert rows.
