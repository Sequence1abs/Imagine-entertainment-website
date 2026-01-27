# Why Pages .pages.dev Returns 404 (and how to fix it)

## Root cause

You used **Cloudflare Pages** (Connect to Git → Build output directory `.open-next`).

- Pages **uploads** the contents of `.open-next` as **static assets** (files only).
- It **does not run** the Worker defined in `wrangler.json` (`.open-next/worker.js`).
- Your app is a **Worker + assets**; there is no `index.html` at the root. So every request (including `/`) gets a generic 404.

OpenNext expects to be deployed as a **Cloudflare Worker** via **Wrangler**, not as a static Pages site.

---

## Fix: Deploy as a Worker (not Pages)

Use **Workers Builds** (Git-based Worker deployments), not Pages.

### Option A – Workers Builds (recommended)

1. In Cloudflare: **Workers & Pages** → **Create** → **Workers** (not Pages).
2. Choose **Connect to Git** and connect your repo (e.g. GitHub).
3. In **Build configuration**:
   - **Build command**: `npm run build:worker`
   - **Deploy command**: `npx wrangler deploy`
   - **Root directory**: leave empty (repo root).
4. In **Build** → **Environment variables**, add the same env vars you had in Pages (Supabase, Cloudflare, R2, SMTP, etc.).  
   For Workers Builds you may need to set `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` (or use OAuth) so Wrangler can deploy.
5. Save and trigger a build. When it succeeds, the Worker will be live at:
   - `imagine-entertainment-website.<account>.workers.dev` (or whatever name is in `wrangler.json`).
6. In the Worker’s **Settings** → **Domains & Routes**, add **Custom domain** `www.imaginesl.com` (and keep your root redirect rule in DNS if you use it).

After that, both the workers.dev URL and `www.imaginesl.com` should serve the app (no more 404 from “static .open-next” behaviour).

### Option B – GitHub Actions + Wrangler deploy

If you prefer not to use Workers Builds:

1. Add a GitHub Actions workflow that:
   - runs `npm ci` then `npm run build:worker`
   - runs `npx wrangler deploy` with `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` (or `CLOUDFLARE_API_TOKEN` only, depending on your Wrangler setup).
2. On each push to `main`, the workflow builds and deploys the Worker.
3. Add `www.imaginesl.com` as a custom domain on that Worker in the dashboard.

Your existing `wrangler.json` is already correct for this (Worker + assets + KV + R2).

---

## Summary

- **Pages** = static hosting of the `.open-next` folder → 404 because the Worker never runs.
- **Workers (Builds or Wrangler)** = run `.open-next/worker.js` and serve assets → app works.

Use **Workers Builds** (Option A) or a **GitHub Action** that runs `wrangler deploy` (Option B), then point `www.imaginesl.com` at that Worker.
