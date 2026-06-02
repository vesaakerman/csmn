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

export function labelForVideoLanguage(code) {
  const labels = {
    en: "English",
    zh: "Chinese",
    nl: "Dutch",
  };

  return labels[code] || "";
}

export function normalizeCatalogItem(item, lang) {
  const kind = "video";
  const title = localized(item.title, lang);
  const description = localized(item.description, lang);
  const slug = normalizeSlug(item.slug);
  const language = item.language || item.languages?.[0] || "";
  const languageLabel = labelForVideoLanguage(language);
  const tags = item.tags || [];

  return {
    id: item._id,
    kind,
    title,
    description,
    slug,
    href: `/${lang}/videos/${slug}`,
    externalUrl: item.videoUrl,
    videoUrl: item.videoUrl || "",
    language,
    languageLabel,
    tags,
    thumbnailUrl: item.thumbnailUrl || getVideoThumbnail(item.videoUrl) || "/images/hands-together.webp",
    publishedAt: item.publishedAt || item._createdAt || "",
    featured: Boolean(item.featured),
    submittedBy: item.submittedBy?.name || "",
    searchText: [
      title,
      description,
      languageLabel,
      ...tags,
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
  const youtube = getYouTubeEmbedInfo(url);
  if (youtube.id) {
    const params = new URLSearchParams();
    params.set("feature", "oembed");
    if (youtube.start) params.set("start", String(youtube.start));
    const query = params.toString();

    return `https://www.youtube.com/embed/${youtube.id}${query ? `?${query}` : ""}`;
  }

  const vimeoId = getVimeoId(url);
  if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}`;

  return "";
}

export function getVideoThumbnail(url) {
  const youtubeId = getYouTubeId(url);
  if (youtubeId) return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  return "";
}

function getYouTubeId(url) {
  const match = String(url).match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
  );
  return match?.[1] || "";
}

function getYouTubeEmbedInfo(url) {
  const rawUrl = String(url);

  try {
    const parsed = new URL(rawUrl);
    const host = parsed.hostname.replace(/^www\./, "");
    const pathParts = parsed.pathname.split("/").filter(Boolean);
    let id = "";

    if (host === "youtu.be") {
      id = pathParts[0] || "";
    }

    if (["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)) {
      if (pathParts[0] === "watch") id = parsed.searchParams.get("v") || "";
      if (["embed", "shorts", "live"].includes(pathParts[0])) id = pathParts[1] || "";
    }

    if (id) {
      return {
        id,
        start: parseYouTubeTime(parsed.searchParams.get("start") || parsed.searchParams.get("t")),
      };
    }
  } catch {
    // Fall back to the looser match below for pasted or partially encoded URLs.
  }

  return {
    id: getYouTubeId(rawUrl),
    start: parseYouTubeTime(rawUrl.match(/[?&](?:start|t)=([^&]+)/)?.[1]),
  };
}

function parseYouTubeTime(value) {
  if (!value) return 0;
  const text = decodeURIComponent(String(value)).trim();
  if (/^\d+$/.test(text)) return Number(text);

  const match = text.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (!match) return 0;

  const [, hours = "0", minutes = "0", seconds = "0"] = match;
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
}

function getVimeoId(url) {
  const match = String(url).match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  return match?.[1] || "";
}
