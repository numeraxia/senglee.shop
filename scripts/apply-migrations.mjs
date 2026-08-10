import fs from "node:fs";
import path from "node:path";
import pg from "pg";

const { Client } = pg;

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const projectRef = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "")
  .replace("https://", "")
  .replace(".supabase.co", "");

const password = process.env.SUPABASE_DB_PASSWORD;

if (!projectRef || !password) {
  console.error("Set SUPABASE_DB_PASSWORD in .env.local (Supabase → Project Settings → Database).");
  process.exit(1);
}

const candidates = [
  process.env.SUPABASE_DB_URL,
  `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`,
  `postgresql://postgres:${encodeURIComponent(password)}@db.${projectRef}.supabase.co:5432/postgres`,
].filter(Boolean);

const migrationFiles = [
  "supabase/migrations/20260810100000_initial_schema.sql",
  "supabase/migrations/20260810220000_admin.sql",
];

async function connect() {
  let lastError;

  for (const connectionString of candidates) {
    const client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });

    try {
      await client.connect();
      console.log(`Connected via ${connectionString.replace(password, "***")}`);
      return client;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

async function main() {
  const client = await connect();

  for (const file of migrationFiles) {
    const sql = fs.readFileSync(path.join(process.cwd(), file), "utf8");
    console.log(`Applying ${file}...`);
    await client.query(sql);
    console.log(`Applied ${file}`);
  }

  const { rows } = await client.query(
    "select (select count(*)::int from products) as products, (select count(*)::int from categories) as categories, (select count(*)::int from site_settings) as settings"
  );
  console.log("Counts:", rows[0]);
  await client.end();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
