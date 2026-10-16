import type makeRecipeDB from "../database/recipeDB.js";
import type makeGenerateEmbedding from "../services/embeddings/generateEmbedding.js";
import makeRecipeIndex from "../services/meilisearch/recipeIndex.js";

interface Dependencies {
  recipeDB: ReturnType<typeof makeRecipeDB>;
  generateEmbedding: ReturnType<typeof makeGenerateEmbedding>;
  recipeIndex: {
    searchRecipeSemantic: ReturnType<
      typeof makeRecipeIndex
    >["searchRecipeSemantic"];
  };
}

export default function makeSearchRecipeSemantic({
  recipeDB,
  recipeIndex,
  generateEmbedding,
}: Dependencies) {
  return async function searchRecipeSemantic({
    query,
    limit = 20,
  }: {
    query: string;
    limit?: number | undefined;
  }) {
    const embedding = await generateEmbedding(query);

    const searchResults = await recipeIndex.searchRecipeSemantic({
      embedding,
      limit,
    });

    const recipeIds = searchResults.hits.map((hit) => hit.id);

    if (recipeIds.length === 0) {
      return [];
    }

    const recipes = recipeDB.findRecipesById(recipeIds);
    const recipesById = new Map(recipes.map((recipe) => [recipe.id, recipe]));

    // Preserve Meilisearch's semantic ranking order.
    return recipeIds.flatMap((id) => {
      const recipe = recipesById.get(id);
      return recipe ? [recipe] : [];
    });
  };
}