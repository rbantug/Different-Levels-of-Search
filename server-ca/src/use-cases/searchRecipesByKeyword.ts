import { meiliRecipeIndex } from "../services/meilisearch/index.js";

interface Param {
  searchRecipeIndex: typeof meiliRecipeIndex.searchRecipe;
}

export default function makeSearchRecipesByKeyword({
  searchRecipeIndex,
}: Param) {
  return async function searchRecipesByKeyword({ query }: { query: string }) {
    return await searchRecipeIndex({ query });
  };
}
