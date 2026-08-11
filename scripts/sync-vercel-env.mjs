import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const vercelCli = join(root, "node_modules", "vercel", "dist", "index.js");
const envPath = join(root, ".env.local");

if (!existsSync(envPath)) {
  console.error("Missing .env.local — copy .env.example and fill in your credentials first.");
  process.exit(1);
}

const skipKeys = new Set([
  "SUPABASE_DB_PASSWORD",
  "RENDER_API_KEY",
  "RENDER_SERVICE_ID",
  "ADMIN_PASSWORD",
  "VERCEL_OIDC_TOKEN",
]);

const overrides = {
  NEXT_PUBLIC_APP_URL: "https://senglee-shop.vercel.app",
};

function parseEnv(content) {
  const entries = new Map();
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    entries.set(key, value);
  }
  return entries;
}

const env = parseEnv(readFileSync(envPath, "utf8"));

for (const [key, overrideValue] of Object.entries(overrides)) {
  env.set(key, overrideValue);
}

for (const key of skipKeys) {
  env.delete(key);
}

const environments = ["production", "preview", "development"];

for (const [key, value] of env.entries()) {
  let failed = false;

  for (const environment of environments) {
    const result = spawnSync(
      process.execPath,
      [vercelCli, "env", "add", key, environment, "--force"],
      {
        cwd: root,
        input: value,
        encoding: "utf8",
      },
    );

    if (result.status !== 0) {
      console.error(
        `Failed ${key} (${environment}): ${result.stderr || result.stdout || "unknown error"}`,
      );
      failed = true;
      process.exitCode = 1;
    }
  }

  if (!failed) {
    console.log(`Synced ${key}`);
  }
}
