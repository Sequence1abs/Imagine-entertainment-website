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

## After deploy: runtime vars, domain, workers.dev

### 1. Runtime environment variables

The Worker needs env vars at **runtime** (not just at build time). `wrangler.json` → `vars` is used by Wrangler on deploy, so it’s the source of truth for the Worker.

- **Already in `wrangler.json` (safe to commit):**  
  `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_CLOUDFLARE_IMAGES_HASH`, `NEXT_PUBLIC_R2_DEV_URL`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, and SMTP_*.
- **Secrets (do not put in `vars` in git):**  
  `SUPABASE_SERVICE_ROLE_KEY`, `CLOUDFLARE_IMAGES_API_TOKEN`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `CLOUDFLARE_API_TOKEN`, `RESEND_API_KEY` (or whatever sends email).

Add secrets in one of these ways:

- **Workers Builds:** In the project’s **Settings** → **Worker** (or **Environment variables** for the Worker), add each secret as a **Variable** or **Secret**. Values set there are injected into the Worker at runtime and are not in the repo.
- **Dashboard:** **Workers & Pages** → your Worker → **Settings** → **Variables and Secrets** → **Add** (plain variable or **Encrypt** for secrets).  
  Note: the next deploy from the repo will **override** Worker config from `wrangler.json` (e.g. `vars`, bindings). Secrets set only in the Dashboard can be overwritten if Wrangler is configured to replace them, so prefer setting secrets via Workers Builds “Worker” env or via encrypted/secret vars that your deploy flow does not overwrite.

### 2. Point production at your domain

1. **Workers & Pages** → **imagine-entertainment-website** → **Settings** (or **Triggers**).
2. Open **Domains & Routes** (or **Custom Domains**).
3. Add **Custom domain**: `www.imaginesl.com`.
4. Save. Cloudflare will create the DNS record if the zone is on Cloudflare; otherwise add a CNAME for `www` to the Worker target they show (e.g. `imagine-entertainment-website.<account>.workers.dev` or the given hostname).

Your root domain (`imaginesl.com` → `https://www.imaginesl.com`) can stay as a redirect rule or CNAME flattening as you have it now.

### 3. workers.dev and Preview URLs

`wrangler.json` includes `"workers_dev": false` and `"preview_urls": false` so the default `*.workers.dev` and preview URLs are disabled for production. Redeploy after changing these so the live Worker matches.

---

## Summary

- **Pages** = static hosting of the `.open-next` folder → 404 because the Worker never runs.
- **Workers (Builds or Wrangler)** = run `.open-next/worker.js` and serve assets → app works.

Use **Workers Builds** (Option A) or a **GitHub Action** that runs `wrangler deploy` (Option B), then:

1. Set runtime **secrets** in Workers Builds “Worker” env or Dashboard Variables and Secrets.
2. Add **www.imaginesl.com** as a custom domain on the Worker.
3. Rely on `workers_dev: false` and `preview_urls: false` in `wrangler.json` so production is only on your domain.
