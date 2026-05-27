import { recipeIndex } from "./meilisearch.js";

export async function setupSearchIndex() {
  await recipeIndex.updateSearchableAttributes([
    "recipeName",
    "category",
    "area",
    "instructions",
    "ingredient1",
    "ingredient2",
    "ingredient3",
    "ingredient4",
    "ingredient5",
    "ingredient6",
    "ingredient7",
    "ingredient8",
    "ingredient9",
    "ingredient10",
    "ingredient11",
    "ingredient12",
    "ingredient13",
    "ingredient14",
    "ingredient15",
    "ingredient16",
    "ingredient17",
    "ingredient18",
    "ingredient19",
    "ingredient20",
  ]);

  await recipeIndex.updateFilterableAttributes(["category", "area"]);

  await recipeIndex.updateSortableAttributes(["recipeName"]);

  await recipeIndex.updateRankingRules([
    "words",
    "typo",
    "proximity",
    "attribute",
    "sort",
    "exactness",
  ]);

  console.log("Meilisearch configured");
}
