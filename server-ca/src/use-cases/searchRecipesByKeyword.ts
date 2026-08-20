import type makeRecipeIndex from "../services/meilisearch/recipeIndex.js";

interface Dependencies {
  recipeIndex: {
    searchRecipe: ReturnType<typeof makeRecipeIndex>['searchRecipe'];
  };
}

export default function makeSearchRecipesByKeyword({ recipeIndex }: Dependencies) {
  return async function searchRecipesByKeyword({ query }: { query: string }) {
    return await recipeIndex.searchRecipe({ query });
  };
}
