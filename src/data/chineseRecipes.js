import { chineseRecipesQuery } from "../sanity/queries";
import { hasSanityConfig, sanityClient } from "../utils/sanity";

export async function getChineseRecipes() {
  if (!hasSanityConfig) return [];

  try {
    const recipes = await sanityClient.fetch(chineseRecipesQuery);
    return recipes
      .map((recipe) => ({
        ...recipe,
        href: recipe.fileUrl,
        file: recipe.fileName || "",
      }))
      .filter((recipe) => recipe.title && recipe.href)
      .sort((a, b) => a.title.localeCompare(b.title, "en", { sensitivity: "base" }));
  } catch (error) {
    console.warn("Could not load Chinese recipes from Sanity", error);
    return [];
  }
}
