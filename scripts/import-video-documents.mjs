import fs from "node:fs";
import { createInterface } from "node:readline/promises";
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

async function readStdin() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });
  const line = await rl.question("");
  rl.close();
  return line.trim();
}

function readDocuments(path) {
  return fs
    .readFileSync(path, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

loadEnvFile();

const importPath = process.argv[2];
if (!importPath) {
  throw new Error("Usage: node scripts/import-video-documents.mjs <videos.ndjson>");
}

const token = await readStdin();
if (!token) {
  throw new Error("Expected a Sanity write token on stdin.");
}

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET || "production";

if (!projectId || projectId === "placeholder" || projectId === "yourprojectid") {
  throw new Error("PUBLIC_SANITY_PROJECT_ID is missing or still set to the placeholder value.");
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-05-01",
  token,
  useCdn: false,
});

const docs = readDocuments(importPath);
const before = await client.fetch('count(*[_type == "video"])');

for (let index = 0; index < docs.length; index += 50) {
  const batch = docs.slice(index, index + 50);
  let transaction = client.transaction();
  for (const doc of batch) transaction = transaction.createOrReplace(doc);
  await transaction.commit();
  console.info(`Imported ${Math.min(index + batch.length, docs.length)} / ${docs.length}`);
}

const after = await client.fetch('count(*[_type == "video"])');
const byCollection = await client.fetch(`*[_type == "video"] {
  collection
} | order(collection asc)`);

const counts = byCollection.reduce((result, item) => {
  const key = item.collection || "none";
  result[key] = (result[key] || 0) + 1;
  return result;
}, {});

console.info(`Before: ${before}`);
console.info(`After: ${after}`);
console.info(JSON.stringify(counts, null, 2));
