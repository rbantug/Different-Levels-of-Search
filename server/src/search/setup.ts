import { recipeIndex } from "./meilisearch.js";

export async function setupSearchIndex() {
  await recipeIndex.updateSearchableAttributes([
    "recipeName",
    "category",
    "area",
    "ingredients",
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
