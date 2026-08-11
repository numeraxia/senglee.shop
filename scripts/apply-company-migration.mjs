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

const rawPassword = process.env.SUPABASE_DB_PASSWORD;

if (!projectRef || !rawPassword) {
  console.error("Set SUPABASE_DB_PASSWORD in .env.local (Supabase → Project Settings → Database).");
  process.exit(1);
}

let password = rawPassword;
try {
  password = decodeURIComponent(rawPassword);
} catch {
  password = rawPassword;
}

const encodedPassword = encodeURIComponent(password);

const candidates = [
  process.env.SUPABASE_DB_URL,
  `postgresql://postgres.${projectRef}:${encodedPassword}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`,
  `postgresql://postgres.${projectRef}:${encodedPassword}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`,
  `postgresql://postgres:${encodedPassword}@db.${projectRef}.supabase.co:5432/postgres`,
].filter(Boolean);

const sql = fs.readFileSync(
  path.join(process.cwd(), "supabase/migrations/20260811100000_company_details.sql"),
  "utf8"
);

async function connect() {
  let lastError;

  for (const connectionString of candidates) {
    const client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });

    try {
      await client.connect();
      console.log(`Connected via ${connectionString.replace(encodedPassword, "***").replace(password, "***")}`);
      return client;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

async function main() {
  const client = await connect();
  await client.query(sql);
  await client.query("NOTIFY pgrst, 'reload schema'");
  await client.end();
  console.log("Company details migration applied");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
