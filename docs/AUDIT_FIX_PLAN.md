# Step-by-step plan to fix npm audit vulnerabilities

This doc explains how to address the 17 vulnerabilities reported by `npm audit`. Two parts: a **quick win** (already in place) and the **OpenNext upgrade** (do when you’re ready to test builds and deploy).

**Update:** The full stack upgrade (Next 16, React 19, OpenNext 1.x, wrangler bindings, `open-next.config.ts`, `initOpenNextCloudflareForDev`) has been applied in this repo. Use **docs/UPGRADE_STACK_DONE.md** for the exact "what you do next" checklist (install, build, deploy, audit).

---

## Part 1: Glob override (done)

An **override** was added so the `glob` used by `eslint-config-next` is at least **10.5.0**, which fixes the command-injection issue (GHSA-5j98-mcp5-4vw2).

**What you did:** `package.json` includes:

```json
"overrides": {
  "glob": "^10.5.0"
}
```

**What you do now:**

1. Run: `npm install`
2. Run: `npm audit`
3. You should see fewer vulnerabilities (the glob-related one gone).

No code or config changes are required for this step.

---

## Part 2: Upgrade @opennextjs/cloudflare (fixes the rest)

The remaining advisories (SSRF, esbuild, qs, AWS/smithy, etc.) are all resolved by moving from **@opennextjs/cloudflare@0.5.x** to **@opennextjs/cloudflare@1.14+** (or 1.15.x).

Your app is on **0.5**, which uses different binding names and scripts than **1.x**. Follow the steps below in order.

### Step 2.1 – Upgrade the package

```bash
npm install @opennextjs/cloudflare@^1.15.0 --save-dev
```

(Or `@^1.14.0` if you prefer a slightly older 1.x.)

### Step 2.2 – Update build/deploy scripts

**Current (0.5-style):**

- Build: `npx @opennextjs/cloudflare` or `npm run build:worker`
- Deploy: `npx wrangler deploy`

**1.x style:** The CLI is `opennextjs-cloudflare` with subcommands.

In `package.json`, add or adjust scripts, for example:

```json
"scripts": {
  "build": "next build",
  "build:worker": "opennextjs-cloudflare build",
  "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
  "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy"
}
```

If you use **Workers Builds** (Git connected to Cloudflare):

- **Build command:** `opennextjs-cloudflare build` (or keep `npm run build:worker` and set `build:worker` as above).
- **Deploy command:** `npx wrangler deploy` is still fine.

So the minimal change is: **build command** runs `opennextjs-cloudflare build` instead of `npx @opennextjs/cloudflare`.

### Step 2.3 – Update wrangler config (bindings)

**0.5** uses:

- `NEXT_CACHE_WORKERS_KV`
- `NEXT_CACHE_WORKERS_R2`

**1.x** uses different names. The current [Get Started](https://opennext.js.org/cloudflare/get-started) docs use:

- **Incremental cache:** `NEXT_INC_CACHE_R2_BUCKET` (or KV equivalent in their bindings docs).
- **Service binding:** `WORKER_SELF_REFERENCE` pointing at your worker name.

You must align your `wrangler.json` (or `wrangler.jsonc`) with the **1.x bindings** docs:

- [OpenNext Cloudflare – Bindings](https://opennext.js.org/cloudflare/bindings)
- [OpenNext Cloudflare – Caching](https://opennext.js.org/cloudflare/caching)

In particular:

1. Add a **`services`** entry for `WORKER_SELF_REFERENCE` with your worker **name**.
2. Rename/remap cache bindings to what 1.x expects (e.g. `NEXT_INC_CACHE_*`). If you stay on KV + R2, use the binding names shown in the 1.x caching docs.
3. Keep `assets`, `main`, `compatibility_date`, `compatibility_flags`, `vars`, and any custom `r2_buckets`/`kv_namespaces` that are still valid in 1.x.

Do not delete your existing KV/R2 resources; only change **binding names** in config to match 1.x.

### Step 2.4 – Config file (optional but recommended)

1.x often uses an **`open-next.config.ts`** (or similar) at the project root and sometimes a **`defineCloudflareConfig`** with cache overrides. See:

- [OpenNext Cloudflare – Get Started, steps 3–4](https://opennext.js.org/cloudflare/get-started)

If the 1.x template or docs show `open-next.config.ts` (or `open-next.config.mjs`), add one that matches your setup (e.g. R2 or KV for cache).

### Step 2.5 – Next.js config (local dev)

For **local dev** and bindings, 1.x suggests calling `initOpenNextCloudflareForDev()` from `@opennextjs/cloudflare` inside your Next config. See “Develop locally” in the [Get Started](https://opennext.js.org/cloudflare/get-started) guide.

Add that only when you’re ready to run and test `next dev` with the new adapter.

### Step 2.6 – Wrangler version

The Get Started docs say you need **Wrangler 3.99.0 or later**. You’re on 4.x, so you’re fine. After upgrading OpenNext, run:

```bash
npx wrangler --version
```

and fix any compatibility issues mentioned in the 1.x docs or release notes.

### Step 2.7 – Test build and deploy

1. **Build:**  
   `npm run build:worker`  
   (or whatever script runs `opennextjs-cloudflare build`).

2. **Preview:**  
   `npm run preview`  
   (or `opennextjs-cloudflare build && opennextjs-cloudflare preview`).

3. **Deploy:**  
   `npx wrangler deploy`  
   (or your Workers Builds deploy command).

4. **Smoke-test** the deployed site (navigation, images, contact, dashboard, etc.).

### Step 2.8 – Re-run audit

```bash
npm audit
```

After a successful upgrade to 1.14+ and correct bindings, OpenNext-related advisories should be gone or greatly reduced.

---

## Summary table

| Step | Action | Fixes |
|------|--------|--------|
| 1 | Use `overrides.glob` and run `npm install` | Glob command-injection (eslint chain) |
| 2 | Upgrade to @opennextjs/cloudflare@^1.14 or ^1.15 | SSRF, esbuild, qs, AWS/smithy, etc. |
| 2 | Update scripts, wrangler bindings, and (optional) open-next config | Ensures 1.x build and deploy work |

Do **Part 1** first (install with the existing override, confirm audit improves). Schedule **Part 2** when you can test build, preview, and production deploy end-to-end.
