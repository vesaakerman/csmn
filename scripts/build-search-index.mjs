import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import { sampleCatalog } from "../src/data/sampleCatalog.js";
import { catalogQuery } from "../src/sanity/queries.js";

const languages = ["en", "zh", "nl"];
const outputFile = "public/search-index.json";
const textRoot = "src/text-long";

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

function stripMarkdown(raw) {
  return raw
    .replace(/^---[\s\S]*?---/, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[#>*_`-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pageTitleFromMarkdown(raw, fallback) {
  const heading = raw.match(/^#{1,3}\s+(.+)$/m)?.[1];
  return heading ? heading.trim() : fallback;
}

function localized(value, lang) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[lang] || value.en || value.zh || value.nl || "";
}

function normalizeSlug(slug) {
  if (!slug) return "";
  if (typeof slug === "string") return slug;
  return slug.current || "";
}

function labelForVideoCollection(value) {
  const labels = {
    "chinese-worship": "Chinese Worship",
    "english-worship": "English Worship",
    videos: "Videos",
  };

  return labels[value] || "";
}

function normalizeVideoCollection(value) {
  const clean = String(value || "").trim().toLowerCase();
  const aliases = {
    "chinese worship": "chinese-worship",
    chinese_worship: "chinese-worship",
    chineseworship: "chinese-worship",
    "english worship": "english-worship",
    english_worship: "english-worship",
    englishworship: "english-worship",
    video: "videos",
    videos: "videos",
  };

  return aliases[clean] || clean;
}

function buildPageEntries() {
  const entries = [];

  for (const lang of languages) {
    const dir = path.join(textRoot, lang);
    if (!fs.existsSync(dir)) continue;

    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".md")) continue;

      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      entries.push({
        kind: "page",
        lang,
        href: `/${lang}/${slug}`,
        title: pageTitleFromMarkdown(raw, slug),
        description: stripMarkdown(raw).slice(0, 220),
        content: stripMarkdown(raw),
        tags: [slug],
      });
    }
  }

  return entries;
}

async function getCatalogItems() {
  const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.PUBLIC_SANITY_DATASET || "production";
  const hasSanityConfig =
    projectId && projectId !== "placeholder" && projectId !== "yourprojectid";

  if (!hasSanityConfig) return sampleCatalog;

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion: "2026-05-01",
      useCdn: process.env.PUBLIC_SANITY_USE_CDN === "true",
      token: process.env.SANITY_API_TOKEN,
    });

    return await client.fetch(catalogQuery);
  } catch (error) {
    console.warn("Could not fetch Sanity content for search index; using samples.", error);
    return sampleCatalog;
  }
}

function buildCatalogEntries(rawItems) {
  const entries = [];

  for (const lang of languages) {
    for (const item of rawItems) {
      if (item._type !== "video") continue;

      const slug = normalizeSlug(item.slug);
      if (!slug) continue;

      const title = localized(item.title, lang);
      const description = localized(item.description, lang);
      const href = `/${lang}/videos/${slug}`;
      const collectionLabel = labelForVideoCollection(normalizeVideoCollection(item.collection || item.category));
      const tags = item.tags || [];

      entries.push({
        kind: "video",
        lang,
        href,
        title,
        description,
        content: [
          title,
          description,
          collectionLabel,
          tags.join(" "),
          item.searchTerms,
        ]
          .filter(Boolean)
          .join(" "),
        tags,
      });
    }
  }

  return entries;
}

loadEnvFile();

const entries = [
  ...buildPageEntries(),
  ...buildCatalogEntries(await getCatalogItems()),
];

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, JSON.stringify(entries, null, 2));
console.info(`Wrote ${entries.length} search entries to ${outputFile}`);
