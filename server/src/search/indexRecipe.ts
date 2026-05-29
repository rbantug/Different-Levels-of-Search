import { recipeIndex } from "./meilisearch.js";
import type { RecipeSearchDocument } from "./types.js";

export async function indexRecipe(recipe: RecipeSearchDocument) {
  await recipeIndex.addDocuments([
    {
      id: recipe.id,
      recipeName: recipe.recipeName,
      category: recipe.category,
      area: recipe.area,
      ingredients: recipe.ingredients,
    },
  ]);
}
