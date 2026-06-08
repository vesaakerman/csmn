const recipeBasePath = "/pdfs/chinese-recipes/";

export const chineseRecipes = [
  { title: "Snow fungus soup with dates", file: "01-snow-fungus-soup-with-dates.pdf" },
  { title: "Egg tart", file: "02-egg-tart.pdf" },
  { title: "Fish soup", file: "03-fish-soup.pdf" },
  { title: "Sticky rice cake - nian dou bao", file: "04-sticky-rice-cake-nian-dou-bao.pdf" },
  { title: "Suan rong xi lan hua - broccoli in the wok", file: "05-suan-rong-xi-lan-hua-broccoli-in-the-wok.pdf" },
  { title: "Fried egg with cucumber", file: "06-fried-egg-with-cucumber.pdf" },
  { title: "Egg - tomato", file: "07-egg-tomato.pdf" },
  { title: "Cucumber salad in Chinese garlic dressing", file: "08-cucumber-salad-in-chinese-garlic-dressing.pdf" },
  { title: "Braised eggplant", file: "09-braised-eggplant.pdf" },
  { title: "Bokchoy and mushrooms", file: "10-bokchoy-and-mushrooms.pdf" },
  { title: "Zhu rou qin cai - pork with celery", file: "11-zhu-rou-qin-cai-pork-with-celery.pdf" },
  { title: "Stir-fried shrimp with eggs and Chinese chives", file: "12-stir-fried-shrimp-with-eggs-and-chinese-chives.pdf" },
  { title: "Spicy lamb with cumin - Sichuan style", file: "13-spicy-lamb-with-cumin-sichuan-style.pdf" },
  { title: "Shui zhu niu rou - beef", file: "14-shui-zhu-niu-rou-beef.pdf" },
  { title: "Mongolian beef", file: "15-mongolian-beef.pdf" },
  { title: "Beef dish", file: "16-beef-dish.pdf" },
  { title: "Beef coca-cola stir fry", file: "17-beef-coca-cola-stir-fry.pdf" },
  { title: "Yu xiang rou si - Sichuan pork", file: "18-yu-xiang-rou-si-sichuan-pork.pdf" },
  { title: "Yu mi zhu rou - ground pork with corn", file: "19-yu-mi-zhu-rou-ground-pork-with-corn.pdf" },
  { title: "Sweet and sour pork ribs", file: "20-sweet-and-sour-pork-ribs.pdf" },
  { title: "Singapore spare ribs - Rou Gu Cha", file: "21-singapore-spare-ribs-rou-gu-cha.pdf" },
  { title: "Potato with belly pork", file: "22-potato-with-belly-pork.pdf" },
  { title: "Muxi Rou - Mushu Pork", file: "23-muxi-rou-mushu-pork.pdf" },
  { title: "Fried pork with black fungus - mu'er zhu rou", file: "24-fried-pork-with-black-fungus-mu-er-zhu-rou.pdf" },
  { title: "Ma Po Tofu", file: "25-ma-po-tofu.pdf" },
  { title: "Lu rou - pig feet", file: "26-lu-rou-pig-feet.pdf" },
  { title: "Gulu rou - ku lo yuk", file: "27-gulu-rou-ku-lo-yuk.pdf" },
  { title: "Gan guo cai hua", file: "28-gan-guo-cai-hua.pdf" },
  { title: "Roasted duck - kao ya", file: "29-roasted-duck-kao-ya.pdf" },
  { title: "Beijing kao ya", file: "30-beijing-kao-ya.pdf" },
  { title: "Xin Jiang da pan ji", file: "31-xin-jiang-da-pan-ji.pdf" },
  { title: "La zi ji - spicy chicken", file: "32-la-zi-ji-spicy-chicken.pdf" },
  { title: "Kou shui ji - mouth watering chicken", file: "33-kou-shui-ji-mouth-watering-chicken.pdf" },
  { title: "Chicken wings cooked in Coca Cola", file: "34-chicken-wings-cooked-in-coca-cola.pdf" },
  { title: "Huang men ji (Chicken)", file: "35-huang-men-ji-chicken.pdf" },
  { title: "Dou ban ji rou", file: "36-dou-ban-ji-rou.pdf" },
  { title: "Beer chicken", file: "37-beer-chicken.pdf" },
  { title: "Noodles", file: "38-noodles.pdf" },
  { title: "Cold blended noodle - Liang ban mian", file: "39-cold-blended-noodle-liang-ban-mian.pdf" },
  { title: "Fried rice", file: "40-fried-rice.pdf" },
  { title: "Dumplings - jiaozi 2", file: "41-dumplings-2-jiaozi.pdf" },
  { title: "Dumplings - jiaozi", file: "42-dumplings-jiaozi.pdf" },
  { title: "Bao bao", file: "43-bao-bao.pdf" },
];

export function getChineseRecipes() {
  return chineseRecipes
    .map((recipe) => ({
      ...recipe,
      href: `${recipeBasePath}${recipe.file}`,
    }))
    .sort((a, b) => a.title.localeCompare(b.title, "en", { sensitivity: "base" }));
}
