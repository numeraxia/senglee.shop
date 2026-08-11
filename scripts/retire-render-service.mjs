import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, ".env.local");

if (!existsSync(envPath)) {
  console.error("Missing .env.local — add RENDER_API_KEY before retiring the Render service.");
  process.exit(1);
}

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
const apiKey = env.get("RENDER_API_KEY");
const serviceId = env.get("RENDER_SERVICE_ID");

if (!apiKey) {
  console.error("RENDER_API_KEY is not set in .env.local");
  process.exit(1);
}

async function listServices() {
  const response = await fetch("https://api.render.com/v1/services?limit=100", {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`List services failed: ${response.status} ${await response.text()}`);
  }

  const payload = await response.json();
  return payload.map((entry) => entry.service ?? entry);
}

async function deleteService(id) {
  const response = await fetch(`https://api.render.com/v1/services/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
  });

  if (response.status === 204) {
    return { id, status: "deleted" };
  }

  if (response.status === 404) {
    return { id, status: "not_found" };
  }

  throw new Error(`Delete ${id} failed: ${response.status} ${await response.text()}`);
}

const services = await listServices();
const targets = services.filter(
  (service) =>
    service.id === serviceId ||
    service.name === "senglee-shop" ||
    service.slug === "senglee-shop",
);

if (targets.length === 0) {
  console.log("No Render service named senglee-shop found. Nothing to delete.");
  process.exit(0);
}

for (const service of targets) {
  const result = await deleteService(service.id);
  console.log(`${service.name} (${service.id}): ${result.status}`);
}
