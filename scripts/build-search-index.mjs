import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import { sampleCatalog } from "../src/data/sampleCatalog.js";
import { catalogQuery } from "../src/sanity/queries.js";

const languages = ["en", "zh", "nl"];
const outputFile = "public/search-index.json";
const textRoot = "src/text-long";

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
      if (!["video", "song"].includes(item._type)) continue;

      const slug = normalizeSlug(item.slug);
      if (!slug) continue;

      const title = localized(item.title, lang);
      const description = localized(item.description, lang);
      const href = `/${lang}/${item._type === "song" ? "songs" : "videos"}/${slug}`;
      const tags = [
        item.category,
        item.artist,
        item.speaker,
        ...(item.tags || []),
        ...(item.themes || []),
        ...(item.languages || []),
        ...(item.audioLanguages || []),
        ...(item.lyricsLanguages || []),
      ].filter(Boolean);

      entries.push({
        kind: item._type,
        lang,
        href,
        title,
        description,
        content: [
          title,
          description,
          item.artist,
          item.speaker,
          item.category,
          item.lyricsText,
          item.searchTerms,
          tags.join(" "),
        ]
          .filter(Boolean)
          .join(" "),
        tags,
      });
    }
  }

  return entries;
}

const entries = [
  ...buildPageEntries(),
  ...buildCatalogEntries(await getCatalogItems()),
];

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, JSON.stringify(entries, null, 2));
console.info(`Wrote ${entries.length} search entries to ${outputFile}`);
