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
- The API URL defaults to `https://adegoroyefadareandco.org` if not set

