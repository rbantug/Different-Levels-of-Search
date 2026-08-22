import type makeRecipeIndex from "../services/meilisearch/recipeIndex.js";

interface Dependencies {
  recipeIndex: {
    searchRecipe: ReturnType<typeof makeRecipeIndex>['searchRecipe'];
  };
}

export default function makeSearchRecipesByKeyword({ recipeIndex }: Dependencies) {
  return async function searchRecipesByKeyword({ query, limit }: { query: string, limit?: number | undefined }) {
    const result = await recipeIndex.searchRecipe({ query, limit });
    return {
      recipes: result.hits,
      count: result.estimatedTotalHits
    };
  };
}
