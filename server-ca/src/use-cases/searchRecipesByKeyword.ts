import type makeRecipeIndex from "../services/meilisearch/recipeIndex.js";
import type makeRecipeDB from "../database/recipeDB.js";
import { recipeDB } from "../database/index.js";

interface Dependencies {
  recipeIndex: {
    searchRecipe: ReturnType<typeof makeRecipeIndex>['searchRecipe'];
    recipeDB: {
      findRecipesById: ReturnType<typeof makeRecipeDB>['findRecipesById']
    }
  };
}

export default function makeSearchRecipesByKeyword({ recipeIndex }: Dependencies) {
  return async function searchRecipesByKeyword({ query, limit }: { query: string, limit?: number | undefined }) {
    const result = await recipeIndex.searchRecipe({ query, limit });

    // fetch full recipe from DB using search result
    const ids = result.hits.map(hit => hit.id)

    const rows = recipeDB.findRecipesById(ids)

    // preserve the ranking from the keyword recipe search
    const rowMap = new Map(rows.map((r) => [r.id, r]));

    const finalResult = ids.map((id) => rowMap.get(id)).filter(Boolean);

    return finalResult
  };
}
