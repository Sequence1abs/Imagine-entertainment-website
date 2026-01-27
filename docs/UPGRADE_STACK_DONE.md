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
   - Scripts: `build:worker` = `opennextjs-cloudflare build`, `preview` / `deploy` / `upload` / `cf-typegen` added per OpenNext 1.x

2. **wrangler.json**
   - **compatibility_flags**: added `global_fetch_strictly_public`
   - **services**: `WORKER_SELF_REFERENCE` → `imagine-entertainment-website`
   - **Cache**: `NEXT_CACHE_WORKERS_KV` removed; `NEXT_CACHE_WORKERS_R2` renamed to **`NEXT_INC_CACHE_R2_BUCKET`** (same bucket `imagine-next-cache`). **ASSETS_BUCKET** unchanged.

3. **open-next.config.ts** (new)
   - `defineCloudflareConfig({ incrementalCache: r2IncrementalCache })` for 1.x R2 incremental cache.

4. **next.config.mjs**
   - `initOpenNextCloudflareForDev()` from `@opennextjs/cloudflare` added for local dev + bindings.

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

### 2. Add `.dev.vars` (if you run preview or dev with Cloudflare bindings)

In the project root, create `.dev.vars` (it’s in `.gitignore`):

```
NEXTJS_ENV=development
```

Optional: add other dev-only vars (e.g. `NEXT_PUBLIC_*`, `SMTP_*`) if you want them in local/preview.

### 3. Run a normal Next build

```bash
npm run build
```

Fix any TypeScript or Next 16 breaking-change errors (e.g. deprecated APIs, `experimental` options that moved in Next 16).

### 4. Run the OpenNext worker build

```bash
npm run build:worker
```

Fix any build errors (e.g. missing bindings, wrong paths). The worker entry is `.open-next/worker.js` and assets in `.open-next/assets`.

### 5. Preview locally (optional)

```bash
npm run preview
```

This runs `opennextjs-cloudflare build` then `opennextjs-cloudflare preview`. Test main routes, images, and dashboard.

### 6. Deploy

**Option A – from this repo:**

```bash
npm run deploy
```

(uses `opennextjs-cloudflare build` then `opennextjs-cloudflare deploy`).

**Option B – Cloudflare Workers Builds (Git):**

- **Build command:** `opennextjs-cloudflare build` or `npm run build:worker`
- **Deploy command:** `npx wrangler deploy` (or whatever your dashboard uses)

Make sure the deployed worker **name** in the Cloudflare dashboard matches `"name": "imagine-entertainment-website"` in `wrangler.json`.

### 7. Re-run audit

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
- **Wrangler:** Use Wrangler **3.99+** (you’re on 4.x). Run `npx wrangler --version` if deploy fails.

---

## Short checklist

| Step | Command / action |
|------|-------------------|
| 1 | `npm install --legacy-peer-deps` (recommended for React 19 + Next 16) |
| 2 | Create `.dev.vars` with `NEXTJS_ENV=development` |
| 3 | `npm run build` |
| 4 | `npm run build:worker` |
| 5 | `npm run preview` (optional) |
| 6 | `npm run deploy` or use Workers Builds deploy |
| 7 | `npm audit` |

After that, you’re on the latest stack (Next 16, React 19, OpenNext 1.x) with audit issues addressed in code and config.
