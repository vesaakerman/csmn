export const discoverLifeDates = {
  en: [
    { date: "2026-06-05", label: "05 June 2026", time: "18:00" },
    { date: "2026-06-12", label: "12 June 2026", time: "18:00" },
    { date: "2026-06-19", label: "19 June 2026", time: "18:00" },
    { date: "2026-06-26", label: "26 June 2026", time: "18:00" },
  ],
  zh: [
    { date: "2026-06-05", label: "2026 年 6 月 05 日", time: "18:00" },
    { date: "2026-06-12", label: "2026 年 6 月 12 日", time: "18:00" },
    { date: "2026-06-19", label: "2026 年 6 月 19 日", time: "18:00" },
    { date: "2026-06-26", label: "2026 年 6 月 26 日", time: "18:00" },
  ],
  nl: [
    { date: "2026-06-05", label: "05 juni 2026", time: "18:00" },
    { date: "2026-06-12", label: "12 juni 2026", time: "18:00" },
    { date: "2026-06-19", label: "19 juni 2026", time: "18:00" },
    { date: "2026-06-26", label: "26 juni 2026", time: "18:00" },
  ],
};

export function getUpcomingDiscoverLifeDates(lang, referenceDate = new Date()) {
  const today = toDateKey(referenceDate);
  const dates = getDiscoverLifeDates(lang);
  const upcoming = dates.filter((event) => event.date >= today);

  return upcoming.length ? upcoming : dates;
}

export function getDefaultDiscoverLifeEvent(lang, referenceDate = new Date()) {
  return getUpcomingDiscoverLifeDates(lang, referenceDate)[0];
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
  },
};

export function getDiscoverLifeDates(lang) {
  return discoverLifeDates[lang] || discoverLifeDates.en;
}

export function getDiscoverLifeSignupCopy(lang) {
  return discoverLifeSignupCopy[lang] || discoverLifeSignupCopy.en;
}

export function getDiscoverLifePageCopy(lang) {
  return discoverLifePageCopy[lang] || discoverLifePageCopy.en;
}

export function formatDiscoverLifeDate(template, event) {
  return template.replace("{date}", event.label).replace("{time}", event.time);
}

function toDateKey(date) {
  const value = date instanceof Date ? date : new Date(date);
  return [
    value.getFullYear(),
    String(value.getMonth() + 1).padStart(2, "0"),
    String(value.getDate()).padStart(2, "0"),
  ].join("-");
}
