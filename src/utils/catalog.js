import { sampleCatalog } from "../data/sampleCatalog";
import { catalogQuery } from "../sanity/queries";
import { hasSanityConfig, sanityClient } from "./sanity";

export const catalogKinds = ["video"];

export function localized(value, lang) {
  if (!value) return "";
  if (typeof value === "string") return value;

  return value[lang] || value.en || value.zh || value.nl || "";
}

export function normalizeSlug(slug) {
  if (!slug) return "";
  if (typeof slug === "string") return slug;
  return slug.current || "";
}

export function labelForLanguage(code) {
  const labels = {
    en: "EN",
    zh: "中文",
    nl: "NL",
    other: "Other",
  };
  return labels[code] || code.toUpperCase();
}

export function normalizeCatalogItem(item, lang) {
  const kind = "video";
  const title = localized(item.title, lang);
  const description = localized(item.description, lang);
  const slug = normalizeSlug(item.slug);

  return {
    id: item._id,
    kind,
    title,
    description,
    slug,
    href: `/${lang}/videos/${slug}`,
    externalUrl: item.videoUrl,
    videoUrl: item.videoUrl || "",
    thumbnailUrl: item.thumbnailUrl || getVideoThumbnail(item.videoUrl) || "/images/hands-together.webp",
    provider: item.provider || inferProvider(item.videoUrl || ""),
    artist: item.artist || item.speaker || "",
    category: item.category || "",
    tags: item.tags || [],
    themes: item.themes || [],
    languages: item.languages || [],
    publishedAt: item.publishedAt || item._createdAt || "",
    featured: Boolean(item.featured),
    submittedBy: item.submittedBy?.name || "",
    searchText: [
      title,
      description,
      item.artist,
      item.speaker,
      item.category,
      ...(item.tags || []),
      ...(item.themes || []),
      ...(item.languages || []),
      item.searchTerms,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

export async function getRawCatalogItems() {
  if (!hasSanityConfig) return sampleCatalog;

  try {
    return await sanityClient.fetch(catalogQuery);
  } catch (error) {
    console.warn("Failed to load Sanity catalog, using sample content.", error);
    return sampleCatalog;
  }
}

export async function getCatalogItems(lang, kind = "all") {
  const rawItems = await getRawCatalogItems();
  return rawItems
    .filter((item) => catalogKinds.includes(item._type))
    .filter((item) => kind === "all" || item._type === kind)
    .map((item) => normalizeCatalogItem(item, lang))
    .filter((item) => item.title && item.slug);
}

export async function getCatalogItemBySlug(lang, kind, slug) {
  const items = await getCatalogItems(lang, kind);
  return items.find((item) => item.slug === slug);
}

export async function getCatalogStaticPaths(kind, languages) {
  const rawItems = await getRawCatalogItems();

  return languages.flatMap(({ code }) =>
    rawItems
      .filter((item) => item._type === kind)
      .map((item) => {
        const normalized = normalizeCatalogItem(item, code);
        return {
          params: {
            lang: code,
            slug: normalized.slug,
          },
          props: {
            item: normalized,
          },
        };
      })
      .filter((entry) => entry.params.slug),
  );
}

export function getEmbedUrl(url) {
  if (!url) return "";
  const youtubeId = getYouTubeId(url);
  if (youtubeId) return `https://www.youtube-nocookie.com/embed/${youtubeId}`;

  const vimeoId = getVimeoId(url);
  if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}`;

  return "";
}

export function inferProvider(url) {
  if (!url) return "";
  if (getYouTubeId(url)) return "youtube";
  if (getVimeoId(url)) return "vimeo";
  return "external";
}

export function getVideoThumbnail(url) {
  const youtubeId = getYouTubeId(url);
  if (youtubeId) return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  return "";
}

function getYouTubeId(url) {
  const match = String(url).match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
  );
  return match?.[1] || "";
}

function getVimeoId(url) {
  const match = String(url).match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  return match?.[1] || "";
}
