# Vercel Deployment Guide

This guide will help you deploy the FARS Web Client to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Environment Variables

Before deploying, you need to set up environment variables in Vercel:

1. Go to your Vercel project settings
2. Navigate to **Settings** → **Environment Variables**
3. Add the following environment variable:

   ```
   NEXT_PUBLIC_API_BASE_URL=https://adegoroyefadareandco.org
   ```

   **Note:** Replace the URL with your actual API base URL if different.

## Step 2: Deploy via Vercel Dashboard

### Option A: Import from Git Repository

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Vercel will automatically detect it's a Next.js project
4. Configure the project:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `fars-web-client` (if your project is in a subdirectory)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)
5. Add environment variables (see Step 1)
6. Click **Deploy**

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI globally:
   ```bash
   npm i -g vercel
   ```

2. Navigate to your project directory:
   ```bash
   cd fars-web-client
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```

4. Deploy:
   ```bash
   vercel
   ```

5. Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No** (for first deployment)
   - Project name? (Enter a name or press Enter for default)
   - Directory? `./` (or `fars-web-client` if running from parent directory)
   - Override settings? **No**

6. For production deployment:
   ```bash
   vercel --prod
   ```

## Step 3: Configure Environment Variables in Vercel

After deployment, make sure to add environment variables:

1. Go to your project on Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add:
   - **Key:** `NEXT_PUBLIC_API_BASE_URL`
   - **Value:** `https://adegoroyefadareandco.org`
   - **Environment:** Select all (Production, Preview, Development)
4. Click **Save**
5. Redeploy your application for changes to take effect

## Step 4: Verify Deployment

1. Visit your deployment URL (provided by Vercel)
2. Check that the application loads correctly
3. Test API connectivity
4. Verify authentication flow

## Troubleshooting

### Build Errors

- **Error:** "Module not found"
  - Solution: Ensure all dependencies are in `package.json` and run `npm install` locally to verify

- **Error:** "Environment variable not found"
  - Solution: Verify environment variables are set in Vercel dashboard and redeploy

### Runtime Errors

- **CORS Issues:** Ensure your API server allows requests from your Vercel domain
- **API Connection Issues:** Verify `NEXT_PUBLIC_API_BASE_URL` is correctly set

### Performance

- Vercel automatically optimizes Next.js applications
- Enable Edge Functions if needed for better performance
- Monitor performance in Vercel Analytics

## Custom Domain

To add a custom domain:

1. Go to **Settings** → **Domains**
2. Add your domain
3. Follow DNS configuration instructions
4. SSL certificates are automatically provisioned

## Continuous Deployment

Vercel automatically deploys:
- **Production:** Pushes to your main branch (usually `main` or `master`)
- **Preview:** Pull requests and other branches

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Environment Variables in Vercel](https://vercel.com/docs/concepts/projects/environment-variables)

