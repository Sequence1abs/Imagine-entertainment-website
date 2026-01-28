#!/usr/bin/env node
/**
 * Postinstall: patch @opennextjs/cloudflare so OPENNEXT_DISABLE_OG=1 forces
 * useOg=false and @vercel/og is aliased to empty shim (avoids resvg.wasm on deploy).
 * Run automatically after npm install.
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

// --- Patch 1: patch-vercel-og-library.js (force useOg=false when env set)
const file1 = path.join(root, "node_modules/@opennextjs/cloudflare/dist/cli/build/patches/ast/patch-vercel-og-library.js");
if (fs.existsSync(file1)) {
  let code = fs.readFileSync(file1, "utf8");
  if (!code.includes("OPENNEXT_DISABLE_OG")) {
    const marker = "export function patchVercelOgLibrary(buildOpts) {";
    const insert = "export function patchVercelOgLibrary(buildOpts) {\n    // Skip @vercel/og when OPENNEXT_DISABLE_OG=1 (avoids resvg.wasm missing file on Cloudflare deploy).\n    if (process.env.OPENNEXT_DISABLE_OG === \"1\" || process.env.OPENNEXT_DISABLE_OG === \"true\") {\n        return false;\n    }\n    const { appBuildOutputPath, outputDir } = buildOpts;";
    if (code.includes(marker) && code.includes("const { appBuildOutputPath, outputDir } = buildOpts;")) {
      code = code.replace(
        marker + "\n    const { appBuildOutputPath, outputDir } = buildOpts;",
        insert
      );
      fs.writeFileSync(file1, code);
      console.log("patch-opennext-disable-og: applied OPENNEXT_DISABLE_OG check (patch-vercel-og-library.js)");
    }
  }
}

// --- Patch 2: bundle-server.js (alias @vercel/og to empty shim when useOg=false so Wrangler never sees resvg.wasm)
const file2 = path.join(root, "node_modules/@opennextjs/cloudflare/dist/cli/build/bundle-server.js");
if (fs.existsSync(file2)) {
  let code = fs.readFileSync(file2, "utf8");
  const externalOld = `...(useOg ? [] : ["next/dist/compiled/@vercel/og/index.edge.js"]),`;
  const externalNew = `...(useOg ? [] : []),`;
  const aliasOld = `"@next/env": path.join(buildOpts.outputDir, "cloudflare-templates/shims/env.js"),`;
  const aliasNew = `...(useOg ? {} : { "next/dist/compiled/@vercel/og/index.edge.js": path.join(buildOpts.outputDir, "cloudflare-templates/shims/empty.js") }),
            "@next/env": path.join(buildOpts.outputDir, "cloudflare-templates/shims/env.js"),`;
  if (code.includes(externalOld) && code.includes(aliasOld) && !code.includes("next/dist/compiled/@vercel/og/index.edge.js\": path.join")) {
    code = code.replace(externalOld, externalNew);
    code = code.replace(aliasOld, aliasNew);
    fs.writeFileSync(file2, code);
    console.log("patch-opennext-disable-og: applied @vercel/og -> empty shim alias (bundle-server.js)");
  }
}
