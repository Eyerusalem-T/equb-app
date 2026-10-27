# Equb · እቁብ

A transparent savings-circle (equb/ekub) manager for Ethiopian students and small traders.
One honest record of who has paid, whose turn it is, and how much is in the pot, with an optional read-only page members can check.

**Live URL:** _add after deploying_

## Run from a fresh clone
```bash
git clone <repo-url> && cd equb
npm install
cp .env.example .env.local   # then set AUTH_SECRET (openssl rand -base64 32)
npm run dev                  # http://localhost:3000
```

## Environment variables
| Name | Purpose |
|---|---|
| `AUTH_SECRET` | Signs session cookies. Required in production. |
| `SITE_URL` | Public origin for absolute og:image, sitemap, canonical URLs. |

## Next.js features used
App Router, nested layouts and route groups `(auth)` `(app)`, server and client components, Server Actions with `useActionState`, `useOptimistic`, middleware, dynamic routes, `loading.tsx` `error.tsx` `not-found.tsx`, `generateMetadata`, `opengraph-image`, `sitemap`, `robots`, ISR (`revalidate`), `generateStaticParams`, route handler (`/api/health`), security headers.

## Deploy
Push to GitHub, import in Vercel, set the two variables. **Storage note:** the JSON store lives in `/tmp` on Vercel and resets. Swap `lib/db.ts` for Postgres (Neon/Supabase) before real use. See FUTURE.md.
