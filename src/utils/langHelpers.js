import { defaultLang, languages } from "../text/ui";

const markdownFiles = import.meta.glob("../text-long/**/*.md");

export function getLangStaticPaths() {
  return languages.map((lang) => ({ params: { lang: lang.code } }));
}

export function getStaticPagePaths(pages) {
  return languages.flatMap((lang) =>
    pages.map((page) => ({
      params: {
        lang: lang.code,
        page,
      },
    })),
  );
}

export function normalizeLang(lang) {
  return languages.some((item) => item.code === lang) ? lang : defaultLang;
}

export async function loadMarkdown(lang, path) {
  const normalized = normalizeLang(lang);
  const key = `../text-long/${normalized}/${path}.md`;
  const fallback = `../text-long/${defaultLang}/${path}.md`;

  if (markdownFiles[key]) {
    const mod = await markdownFiles[key]();
    return mod.default;
  }

  if (markdownFiles[fallback]) {
    const mod = await markdownFiles[fallback]();
    return mod.default;
  }

  throw new Error(`Markdown not found: ${path}`);
}

export function replaceLanguageInPath(pathname, nextLang) {
  const parts = pathname.split("/").filter(Boolean);
  if (!parts.length) return `/${nextLang}/`;

  if (languages.some((lang) => lang.code === parts[0])) {
    parts[0] = nextLang;
  } else {
    parts.unshift(nextLang);
  }

  return `/${parts.join("/")}${pathname.endsWith("/") ? "/" : ""}`;
}

export function formatDate(dateValue, lang) {
  if (!dateValue) return "";
  return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : lang, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateValue));
}
