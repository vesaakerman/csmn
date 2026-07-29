import { discoverLifeDatesQuery } from "../sanity/queries";
import { hasSanityConfig, sanityClient } from "../utils/sanity";

const discoverLifeTime = "18:00";
let discoverLifeDateKeysPromise;

export async function getUpcomingDiscoverLifeDates(lang, referenceDate = new Date()) {
  const today = toDateKey(referenceDate);
  const dates = await getDiscoverLifeDates(lang);
  const upcoming = dates.filter((event) => event.date >= today);

  return upcoming;
}

export async function getDefaultDiscoverLifeEvent(lang, referenceDate = new Date()) {
  const upcoming = await getUpcomingDiscoverLifeDates(lang, referenceDate);
  return upcoming[0];
}

export const discoverLifeSignupCopy = {
  en: {
    button: "Join",
    title: "Join Discover Life",
    registrationTemplate: "Register for Discover Life! on {date} starting at {time}.",
    name: "Name",
    email: "Email address",
    countryCode: "Country code",
    phone: "Phone number",
    restrictions: "Food restrictions",
    restrictionsPlaceholder: "Allergies, vegetarian, vegan, halal, or other notes",
    close: "Close",
    submit: "Submit",
    success: "Thank you. Your signup has been sent.",
    error: "Something went wrong. Please try again, or contact CSMN directly.",
    noDates: "No Discover Life dates have been announced yet.",
  },
  zh: {
    button: "报名参加",
    title: "报名参加 Discover Life",
    registrationTemplate: "报名参加 {date} {time} 开始的 Discover Life！",
    name: "姓名",
    email: "电子邮箱",
    countryCode: "国家区号",
    phone: "电话号码",
    restrictions: "饮食限制",
    restrictionsPlaceholder: "过敏、素食、纯素、清真或其他说明",
    close: "关闭",
    submit: "提交",
    success: "谢谢，你的报名已经发送。",
    error: "发送时出现问题。请再试一次，或直接联系 CSMN。",
    noDates: "目前还没有公布 Discover Life 日期。",
  },
  nl: {
    button: "Aanmelden",
    title: "Aanmelden voor Discover Life",
    registrationTemplate: "Meld je aan voor Discover Life op {date}, start om {time}.",
    name: "Naam",
    email: "E-mailadres",
    countryCode: "Landcode",
    phone: "Telefoonnummer",
    restrictions: "Dieetwensen",
    restrictionsPlaceholder: "Allergieën, vegetarisch, vegan, halal of andere opmerkingen",
    close: "Sluiten",
    submit: "Versturen",
    success: "Bedankt. Je aanmelding is verzonden.",
    error: "Er ging iets mis. Probeer het opnieuw of neem direct contact op met CSMN.",
    noDates: "Er zijn nog geen Discover Life-data bekendgemaakt.",
  },
};

export const discoverLifePageCopy = {
  en: {
    title: "Discover Life!",
    fromTemplate: "{date} from {time} until 22:00",
    at: "At",
    location: "CSMN Home",
    contact: "bert@csmn.nl",
    website: "http://fellowship",
    intro: "Our weekly event!",
    body: "We spend time together during a (Chinese) dinner, have a lot of fun, sing, and study. Check out more on our website or register using the button above!",
    upcomingTitle: "Upcoming Discover Life evenings",
    noDates: "No Discover Life dates have been announced yet.",
  },
  zh: {
    title: "Discover Life!",
    fromTemplate: "{date} {time} 至 22:00",
    at: "地点",
    location: "CSMN Home",
    contact: "bert@csmn.nl",
    website: "http://fellowship",
    intro: "我们的每周活动！",
    body: "我们一起吃中式晚餐、享受轻松的时间、唱诗并学习。你可以查看更多信息，也可以使用上方按钮报名参加！",
    upcomingTitle: "即将举行的 Discover Life",
    noDates: "目前还没有公布 Discover Life 日期。",
  },
  nl: {
    title: "Discover Life!",
    fromTemplate: "{date} van {time} tot 22:00",
    at: "Locatie",
    location: "CSMN Home",
    contact: "bert@csmn.nl",
    website: "http://fellowship",
    intro: "Ons wekelijkse event!",
    body: "We eten samen tijdens een Chinese maaltijd, hebben veel plezier, zingen en studeren. Bekijk meer op onze website of meld je aan met de knop hierboven!",
    upcomingTitle: "Komende Discover Life avonden",
    noDates: "Er zijn nog geen Discover Life-data bekendgemaakt.",
  },
};

export async function getDiscoverLifeDates(lang) {
  const dateKeys = await getDiscoverLifeDateKeys();

  return dateKeys.map((date) => ({
    date,
    label: formatDiscoverLifeDateLabel(date, lang),
    time: discoverLifeTime,
  }));
}

export function getDiscoverLifeSignupCopy(lang) {
  return discoverLifeSignupCopy[lang] || discoverLifeSignupCopy.en;
}

export function getDiscoverLifePageCopy(lang) {
  return discoverLifePageCopy[lang] || discoverLifePageCopy.en;
}

export function formatDiscoverLifeDate(template, event) {
  if (!event) return "";

  return template.replace("{date}", event.label).replace("{time}", event.time);
}

async function getDiscoverLifeDateKeys() {
  if (!discoverLifeDateKeysPromise) {
    discoverLifeDateKeysPromise = loadDiscoverLifeDateKeys();
  }

  return discoverLifeDateKeysPromise;
}

async function loadDiscoverLifeDateKeys() {
  if (!hasSanityConfig) return [];

  try {
    const dates = await sanityClient.fetch(discoverLifeDatesQuery);
    return normalizeDateKeys(dates.map((item) => item.date));
  } catch (error) {
    console.warn("Could not load Discover Life dates from Sanity", error);
    return [];
  }
}

function normalizeDateKeys(dates) {
  return [...new Set(dates.filter(isDateKey))].sort();
}

function formatDiscoverLifeDateLabel(dateKey, lang) {
  const [year, month, day] = dateKey.split("-").map(Number);

  if (lang === "zh") {
    return `${year} 年 ${month} 月 ${day} 日`;
  }

  const locale = lang === "nl" ? "nl-NL" : "en-GB";
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function isDateKey(date) {
  return typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date);
}

function toDateKey(date) {
  const value = date instanceof Date ? date : new Date(date);
  return [
    value.getFullYear(),
    String(value.getMonth() + 1).padStart(2, "0"),
    String(value.getDate()).padStart(2, "0"),
  ].join("-");
}
