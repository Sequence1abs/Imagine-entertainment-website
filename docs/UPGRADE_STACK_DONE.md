# Stack upgrade applied – what’s done and what you do next

The repo is wired for **Next 16**, **React 19**, and **OpenNext Cloudflare 1.x**. All changes that can be done in code/config are in place. Follow the steps below on your machine to finish.

---

## What was changed in the repo

1. **package.json**
   - **next** `^14.2.0` → `^16.1.0`
   - **react** / **react-dom** `^18.2.0` → `^19.0.0`
   - **@opennextjs/cloudflare** `^0.5.0` → `^1.16.0`
   - **eslint-config-next** `14.2.0` → `^16.1.0`
   - **@types/react** / **@types/react-dom** `^18` → `^19`
   - Scripts: `build:worker` = `OPENNEXT_DISABLE_OG=1 opennextjs-cloudflare build` (and same env for `preview` / `deploy` / `upload`), plus **postinstall** = `node scripts/patch-opennext-disable-og.js` so `@vercel/og` is never bundled (avoids resvg.wasm deploy error). `cf-typegen` added per OpenNext 1.x.

2. **wrangler.json**
   - **compatibility_flags**: added `global_fetch_strictly_public`
   - **services**: `WORKER_SELF_REFERENCE` → `imagine-entertainment-website`
   - **Cache**: `NEXT_CACHE_WORKERS_KV` removed; `NEXT_CACHE_WORKERS_R2` renamed to **`NEXT_INC_CACHE_R2_BUCKET`** (same bucket `imagine-next-cache`). **ASSETS_BUCKET** unchanged.
   - **d1_databases**: added `NEXT_TAG_CACHE_D1` for on-demand revalidation (dashboard updates). You must create the D1 DB once and set `database_id` in `wrangler.json` — see “D1 for on-demand revalidation” below.

3. **open-next.config.ts** (new)
   - `defineCloudflareConfig({ incrementalCache: r2IncrementalCache, tagCache: d1NextTagCache })` for 1.x R2 incremental cache and **on-demand revalidation** (so dashboard updates show on the deployed site). See “D1 for on-demand revalidation” below.

4. **next.config.mjs**
   - `initOpenNextCloudflareForDev()` from `@opennextjs/cloudflare` added for local dev + bindings.
   - **Worker size (free tier 3 MiB gzip):** `serverExternalPackages: ['@vercel/og']` and `outputFileTracingExcludes: { '/*': ['node_modules/next/dist/compiled/@vercel/og/**'] }` so Next does not trace or bundle `@vercel/og` in the server/worker. This app uses only static OG images via metadata (no `ImageResponse` or `opengraph-image.tsx`), so OpenNext then sets `useOg=false` and externals that code (~2.2 MB saved). That keeps the Worker under Cloudflare’s free-tier limit without upgrading.

5. **public/_headers** (new)
   - `/_next/static/*` → `Cache-Control: public, max-age=31536000, immutable` for static asset caching on Cloudflare.

6. **App code**
   - `app/work/[id]/page.tsx` and `app/(admin)/dashboard/events/[id]/page.tsx` already use `params: Promise<{ id: string }>` and `await params` (Next 15/16 style). No change.

---

## What you must do

### 1. Install dependencies

Use **legacy peer deps** so React 19 and Next 16 install even though some packages (e.g. Radix) still declare React 18:

```bash
npm install --legacy-peer-deps
```

If you prefer strict resolution and get **ERESOLVE** errors, you can try `npm install` first and only switch to `--legacy-peer-deps` if it fails.

### 2. D1 for on-demand revalidation (dashboard updates on deployed site)

If you create/update events or gallery from the **deployed** dashboard and those changes don’t show on the public site, you need the **Tag Cache** (D1). Localhost works because Next.js dev doesn’t use the same cache.

Do this **once**:

1. Create a D1 database (same account as the Worker). **If you get an authentication error**, see the troubleshooting below:
   ```bash
   npx wrangler d1 create imagine-next-tag-cache
   ```
   **If the command fails with "Authentication error [code: 10000]"**, your `CLOUDFLARE_API_TOKEN` doesn't have D1 permissions. Options:
   - **Option A (recommended):** Use OAuth login instead:
     ```bash
     # Temporarily unset the API token to use OAuth
     unset CLOUDFLARE_API_TOKEN
     npx wrangler login
     npx wrangler d1 create imagine-next-tag-cache
     ```
   - **Option B:** Create via Cloudflare Dashboard:
     1. Go to https://dash.cloudflare.com → Workers & Pages → D1
     2. Click "Create database"
     3. Name: `imagine-next-tag-cache`
     4. Copy the **Database ID** from the database details page
2. In the command output (or dashboard), copy the **`database_id`** (a UUID).
3. In **wrangler.json**, find `d1_databases` and replace `"REPLACE_WITH_YOUR_D1_DATABASE_ID"` with that UUID:
   ```json
   "d1_databases": [
     {
       "binding": "NEXT_TAG_CACHE_D1",
       "database_id": "<paste-your-uuid-here>",
       "database_name": "imagine-next-tag-cache"
     }
   ],
   ```
4. Deploy with **`npm run deploy`** (or your normal deploy). The deploy step runs `populateCache`, which creates the `revalidations` table in D1.

After this, `revalidatePath('/work')`, `revalidatePath('/gallery')`, etc. (called from your API routes when you create/update events or gallery) will invalidate the cache on the Worker, and the next visit to `/work` or `/gallery` will show the new data.

### 3. Add `.dev.vars` (if you run preview or dev with Cloudflare bindings)

In the project root, create `.dev.vars` (it’s in `.gitignore`):

```
NEXTJS_ENV=development
```

Optional: add other dev-only vars (e.g. `NEXT_PUBLIC_*`, `SMTP_*`) if you want them in local/preview.

### 4. Run a normal Next build

```bash
npm run build
```

Fix any TypeScript or Next 16 breaking-change errors (e.g. deprecated APIs, `experimental` options that moved in Next 16).

### 5. Run the OpenNext worker build

```bash
npm run build:worker
```

Fix any build errors (e.g. missing bindings, wrong paths). The worker entry is `.open-next/worker.js` and assets in `.open-next/assets`.

### 6. Preview locally (optional)

```bash
npm run preview
```

This runs `opennextjs-cloudflare build` then `opennextjs-cloudflare preview`. Test main routes, images, and dashboard.

### 7. Deploy

**Option A – from this repo:**

```bash
npm run deploy
```

(uses `opennextjs-cloudflare build` then `opennextjs-cloudflare deploy`).

**Option B – Cloudflare Workers Builds (Git):**

- **Build command:** `opennextjs-cloudflare build` or `npm run build:worker`
- **Deploy command:** `npx wrangler deploy` (or whatever your dashboard uses)

Make sure the deployed worker **name** in the Cloudflare dashboard matches `"name": "imagine-entertainment-website"` in `wrangler.json`.

### 8. Re-run audit

```bash
npm audit
```

OpenNext-related and glob-related advisories should be gone or greatly reduced. Address any remaining ones per your policy (e.g. `npm audit fix` only when you’re sure it doesn’t change major versions).

---

## If something breaks

- **`EPERM: operation not permitted, symlink` during `npm run build:worker` (Windows):** OpenNext creates symlinks when bundling; Windows blocks that by default.
  1. **Preferred:** Enable **Developer Mode** so symlinks work without admin:
     - **Settings → Privacy & security → For developers → Developer Mode** → turn **On**.
     - Restart the terminal and run `npm run build:worker` again.
  2. **Alternative:** Run the build in **WSL** (OpenNext recommends WSL on Windows):
     - Open the project in WSL (e.g. `\\wsl$\…` or clone inside WSL), install deps there, and run `npm run build:worker` from a WSL terminal.
  If you use **Cloudflare Workers Builds (Git)** and builds run in the cloud (Linux), they won’t hit this; only local Windows runs do.
- **`ENOTEMPTY` or `rmdir` errors during `npm install` (Windows):** npm is failing to overwrite/remove an existing `node_modules` path. Fix: delete `node_modules` and reinstall.
  1. Close other terminals/editors using the project, then remove deps:
     - **PowerShell / CMD:** `rmdir /s /q node_modules`
     - **Git Bash:** `rm -rf node_modules`
  2. Run `npm install --legacy-peer-deps` again.
  If it still fails, also delete `package-lock.json` and run `npm install --legacy-peer-deps` (you’ll get a new lockfile).
- **Next 16:** Check [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16) and [Next.js 15 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-15) for async `cookies()`/`headers()`, `params`/`searchParams` as Promises, and any `experimental` renames.
- **OpenNext 1.x:** See [OpenNext Cloudflare Get Started](https://opennext.js.org/cloudflare/get-started), [Bindings](https://opennext.js.org/cloudflare/bindings), [Caching](https://opennext.js.org/cloudflare/caching).
- **Dashboard updates (new events, gallery changes) don't show on the deployed site:** The deployed Worker uses R2 incremental cache. On-demand invalidation (`revalidatePath`) only works if a **Tag Cache** (D1) is configured. Follow step **"2. D1 for on-demand revalidation"** above: create the D1 DB, set `database_id` in `wrangler.json`, and redeploy. Localhost works because dev doesn't use that cache.
- **"Missing file or directory: ...resvg.wasm?module" during deploy:** This happens when the Worker bundle still references `@vercel/og`’s WASM (exclusions stop the file from being copied, but the code path can still reference it). **Solid fix (already in this repo):** (1) `build:worker` / `deploy` / `upload` / `preview` run with **`OPENNEXT_DISABLE_OG=1`** (via `cross-env`) so OpenNext never bundles `@vercel/og`. (2) A **postinstall** script (`scripts/patch-opennext-disable-og.js`) patches `@opennextjs/cloudflare` to respect that env and return `useOg=false`. After `npm install`, run `npm run deploy` (or `npm run build:worker` then `npx wrangler deploy`). If you ever see the error again, ensure you’re using `npm run deploy` (not raw `opennextjs-cloudflare build` without the env) and that postinstall ran (e.g. re-run `npm install`).
- **Wrangler:** Use Wrangler **3.99+** (you’re on 4.x). Run `npx wrangler --version` if deploy fails.
- **“Your Worker exceeded the size limit of 3 MiB”:** Cloudflare’s free plan limits each Worker to **3 MiB (gzipped)**. The limit uses the **gzipped** size (e.g. “Total Upload … gzip: … KiB” in the deploy log).
  1. **Primary fix (no upgrade):** This project uses **static** OG images only. The config above (`serverExternalPackages` + `outputFileTracingExcludes` for `node_modules/next/dist/compiled/@vercel/og/**`) makes OpenNext treat `@vercel/og` as unused and externalize it, removing ~2.2 MB from the bundle. Do a clean `npm run build:worker` and redeploy; that alone should bring you under 3 MiB.
  2. **If still over 3 MiB:** Confirm there are no `opengraph-image.tsx` / `twitter-image.tsx` or `ImageResponse` usage, then re-check the deploy log gzip size. Only if it remains over 3 MiB after that, consider the **Workers Paid** plan ($5/month, 10 MiB limit) as a last resort — see [Workers plan limits](https://developers.cloudflare.com/workers/platform/limits/#worker-size).

---

## Short checklist

| Step | Command / action |
|------|-------------------|
| 1 | `npm install --legacy-peer-deps` (recommended for React 19 + Next 16) |
| 2 | **D1 for dashboard updates on prod:** `npx wrangler d1 create imagine-next-tag-cache` → put `database_id` in `wrangler.json` under `d1_databases` |
| 3 | Create `.dev.vars` with `NEXTJS_ENV=development` |
| 4 | `npm run build` |
| 5 | `npm run build:worker` |
| 6 | `npm run preview` (optional) |
| 7 | `npm run deploy` or use Workers Builds deploy |
| 8 | `npm audit` |

After that, you’re on the latest stack (Next 16, React 19, OpenNext 1.x) with audit issues addressed in code and config.
