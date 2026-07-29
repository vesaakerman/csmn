import { topicalStudiesQuery } from "../sanity/queries";
import { hasSanityConfig, sanityClient } from "../utils/sanity";

function formatFileSize(bytes = 0) {
  if (!bytes) return "";
  const unit = bytes >= 1024 * 1024 ? "MB" : "KB";
  const divisor = unit === "MB" ? 1024 * 1024 : 1024;
  return `${(bytes / divisor).toFixed(2).replace(/\.?0+$/, "")} ${unit}`;
}

function formatDate(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

export async function getTopicalStudyFiles() {
  if (!hasSanityConfig) return [];

  try {
    const files = await sanityClient.fetch(topicalStudiesQuery);
    return files
      .map((item) => ({
        ...item,
        href: item.fileUrl,
        file: item.fileName || "",
        sortDate: item.date || "",
        date: formatDate(item.date),
        size: formatFileSize(item.fileSize),
      }))
      .filter((item) => item.title && item.href)
      .sort((a, b) => {
        const dateCompare = String(b.sortDate || "").localeCompare(String(a.sortDate || ""));
        return dateCompare || a.title.localeCompare(b.title, "en", { sensitivity: "base" });
      });
  } catch (error) {
    console.warn("Could not load topical studies from Sanity", error);
    return [];
  }
}
