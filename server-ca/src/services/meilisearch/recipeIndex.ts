import type { Meilisearch } from "meilisearch";
import type { RecipeSearchDocument } from "./types.js";

export default function makeRecipeIndex({ client }: { client: Meilisearch }) {
  const index = client.index("recipes");

  async function setupRecipeIndex() {
    await index.updateSearchableAttributes([
      "recipeName",
      "category",
      "area",
      "ingredients",
    ]);

    await index.updateFilterableAttributes(["category", "area"]);

    await index.updateSortableAttributes(["recipeName"]);

    await index.updateRankingRules([
      "words",
      "typo",
      "proximity",
      "attribute",
      "sort",
      "exactness",
    ]);

    console.log("Meilisearch configured");
  }

  async function addRecipe(recipe: RecipeSearchDocument) {
    return index.addDocuments([
      {
        id: recipe.id,
        recipeName: recipe.recipeName,
        category: recipe.category,
        area: recipe.area,
        ingredients: recipe.ingredients,
      },
    ]);
  }

  async function deleteRecipe(id: string) {
    return index.deleteDocument(id);
  }

  return { setupRecipeIndex, addRecipe, deleteRecipe };
}
