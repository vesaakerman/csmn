const DETAIL_LIMIT = 520;
const CARD_LIMIT = 180;
const SEARCH_LIMIT = 220;

const bibleReferencePatterns = [
  /\b(?:Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|Samuel|Kings|Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|Corinthians|Galatians|Ephesians|Philippians|Colossians|Thessalonians|Timothy|Titus|Philemon|Hebrews|James|Peter|Jude|Revelation)\s+\d{1,3}:\d{1,3}/i,
  /(?:马太福音|馬太福音|马可福音|馬可福音|路加福音|约翰福音|約翰福音|使徒行传|使徒行傳|罗马书|羅馬書|哥林多前书|哥林多前書|哥林多后书|哥林多後書|加拉太书|加拉太書|以弗所书|以弗所書|腓立比书|腓立比書|歌罗西书|歌羅西書|帖撒罗尼迦前书|帖撒羅尼迦前書|帖撒罗尼迦后书|帖撒羅尼迦後書|提摩太前书|提摩太前書|提摩太后书|提摩太後書|希伯来书|希伯來書|雅各书|雅各書|彼得前书|彼得前書|彼得后书|彼得後書|启示录|啟示錄)\s*(?:[A-Za-z ]+)?\d{1,3}:\d{1,3}/i,
];

const creditPatterns = [
  /背景图片/i,
  /background picture/i,
];

export function getVideoDescriptionDetail(description) {
  return truncateDescription(cleanVideoDescription(description), DETAIL_LIMIT);
}

export function getVideoDescriptionCard(description) {
  return truncateDescription(cleanVideoDescription(description), CARD_LIMIT);
}

export function getVideoDescriptionSearchPreview(description) {
  return truncateDescription(cleanVideoDescription(description), SEARCH_LIMIT);
}

function cleanVideoDescription(description) {
  const text = String(description || "")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!text) return "";

  const cutAt = [
    ...bibleReferencePatterns,
    ...creditPatterns,
  ]
    .map((pattern) => {
      const match = text.match(pattern);
      return match?.index ?? -1;
    })
    .filter((index) => index > 0)
    .sort((first, second) => first - second)[0];

  if (!cutAt) return text;

  const trimmed = text.slice(0, cutAt).trim();
  return trimmed.length >= 24 ? trimmed : text;
}

function truncateDescription(description, limit) {
  const text = String(description || "").trim();
  if (text.length <= limit) return text;

  const excerpt = text.slice(0, limit);
  const breakPoints = [
    excerpt.lastIndexOf("\n\n"),
    excerpt.lastIndexOf("\n"),
    excerpt.lastIndexOf(". "),
    excerpt.lastIndexOf("。"),
    excerpt.lastIndexOf("; "),
    excerpt.lastIndexOf(" "),
  ];
  const breakPoint = breakPoints.find((index) => index >= Math.floor(limit * 0.62));
  const end = breakPoint && breakPoint > 0 ? breakPoint : limit;

  return `${text.slice(0, end).trim()}...`;
}
