import fs from "node:fs";
import { createClient } from "@sanity/client";

function loadEnvFile() {
  if (!fs.existsSync(".env")) return;

  const lines = fs.readFileSync(".env", "utf-8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const rawValue = trimmed.slice(separator + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, "");

    if (!process.env[key]) process.env[key] = value;
  }
}

function englishValue(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.en || value.zh || value.nl || "";
}

loadEnvFile();

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || projectId === "placeholder" || projectId === "yourprojectid") {
  throw new Error("PUBLIC_SANITY_PROJECT_ID is missing or still set to the placeholder value.");
}

if (!token) {
  throw new Error("SANITY_API_TOKEN is required to migrate documents. Add a write token to .env first.");
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-05-01",
  token,
  useCdn: false,
});

const docs = await client.fetch(`*[_type == "video" && (title.en match "*" || description.en match "*")] {
  _id,
  title,
  description
}`);

if (!docs.length) {
  console.info("No video documents need migration.");
  process.exit(0);
}

for (const doc of docs) {
  const patch = {};

  if (doc.title && typeof doc.title !== "string") {
    patch.title = englishValue(doc.title);
  }

  if (doc.description && typeof doc.description !== "string") {
    patch.description = englishValue(doc.description);
  }

  if (Object.keys(patch).length) {
    await client.patch(doc._id).set(patch).commit();
    console.info(`Migrated ${doc._id}`);
  }
}

console.info(`Checked ${docs.length} video document(s).`);
