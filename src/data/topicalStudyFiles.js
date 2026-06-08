import { statSync } from "node:fs";
import { join } from "node:path";

const basePath = "/pdfs/topical-studies/";

export const topicalStudyFiles = [
  {
    file: "aboutPrayer.pdf",
    date: "20/12/2025",
    titles: {
      en: "A practical guide towards daily prayer",
      zh: "每日祷告实用指南",
      nl: "Een praktische gids voor dagelijks gebed",
    },
  },
  {
    file: "bibleStudy_fellowship_Acts-17_uk.pdf",
    date: "07/11/2025",
    titles: {
      en: "Acts 17 - Fellowship Bible study",
      zh: "使徒行传 17 - 团契圣经学习",
      nl: "Handelingen 17 - Fellowship Bijbelstudie",
    },
  },
  {
    file: "China-Outreach-Ministries-Bilingual-Foll-68.pdf",
    date: "12/01/2026",
    titles: {
      en: "China-Outreach-Ministries-Bilingual-Foll-68.pdf",
      zh: "China-Outreach-Ministries-Bilingual-Foll-68.pdf",
      nl: "China-Outreach-Ministries-Bilingual-Foll-68.pdf",
    },
  },
  {
    file: "topicalStudy_fellowship_generosity.pdf",
    date: "05/12/2025",
    titles: {
      en: "Generosity",
      zh: "慷慨",
      nl: "Vrijgevigheid",
    },
  },
  {
    file: "bible-study-studies_4-bible-studies-from-the-book-of-jonah.pdf",
    date: "20/12/2025",
    titles: {
      en: "Jonah - Bible study",
      zh: "约拿书 - 圣经学习",
      nl: "Jona - Bijbelstudie",
    },
  },
  {
    file: "Questions-for-Fireproof-movie.pptx",
    date: "20/12/2025",
    titles: {
      en: "Questions-for-Fireproof-movie.pptx",
      zh: "Questions-for-Fireproof-movie.pptx",
      nl: "Questions-for-Fireproof-movie.pptx",
    },
  },
  {
    file: "Teaching-on-Marriage-by-Phil.pdf",
    date: "20/12/2025",
    titles: {
      en: "Teaching-on-Marriage-by-Phil.pdf",
      zh: "Teaching-on-Marriage-by-Phil.pdf",
      nl: "Teaching-on-Marriage-by-Phil.pdf",
    },
  },
];

function formatFileSize(bytes) {
  const unit = bytes >= 1024 * 1024 ? "MB" : "KB";
  const divisor = unit === "MB" ? 1024 * 1024 : 1024;
  return `${(bytes / divisor).toFixed(2).replace(/\.?0+$/, "")} ${unit}`;
}

export function getTopicalStudyFiles(lang) {
  return topicalStudyFiles.map((item) => {
    const filePath = join(process.cwd(), "public", "pdfs", "topical-studies", item.file);
    const bytes = statSync(filePath).size;

    return {
      ...item,
      href: `${basePath}${item.file}`,
      title: item.titles[lang] || item.titles.en,
      size: formatFileSize(bytes),
    };
  });
}
