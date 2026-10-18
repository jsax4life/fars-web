# Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the root of the `fars-web-client` directory with the following:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://adegoroyefadareandco.org
```

## For Local Development

1. Copy this file and create `.env.local`:
   ```bash
   cp ENV_SETUP.md .env.local
   ```
   Then edit `.env.local` and add the environment variables above.

2. Or create `.env.local` manually with the content above.

## For Vercel Deployment

Add the environment variable in Vercel Dashboard:
1. Go to your project → Settings → Environment Variables
2. Add `NEXT_PUBLIC_API_BASE_URL` with your API URL
3. Select all environments (Production, Preview, Development)
4. Save and redeploy

## Notes

- `.env.local` is already in `.gitignore` and won't be committed
- `NEXT_PUBLIC_*` prefix is required for client-side access in Next.js
- The web client fallback API URL is `https://fars-api-server-production.up.railway.app` (see `useApi.tsx`)

## Backend (Railway) — required for sessions to stay logged in

If login succeeds but you are kicked out within a second, the API is almost certainly issuing **access tokens with no lifetime** (`exp` equals `iat` in the JWT). Fix this on the **API service**, not in the web client:

1. In Railway → your API service → **Variables**, set for example:
   - `JWT_SECRET` — strong random secret
   - `JWT_EXPIRES_IN` — e.g. `15m` or `1d` (match whatever your Nest auth module reads)
2. Redeploy the API.
3. Verify: after login, `GET /api/auth/profile` with the `accessToken` must return **200**, not 401.




