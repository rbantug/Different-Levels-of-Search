import type makeRecipeDB from "../database/recipeDB.js";
import type makeRecipeIndex from "../services/meilisearch/recipeIndex.js";
import type makeKeywordIndex from "../services/meilisearch/keywordIndex.js";

type RecipeDB = ReturnType<typeof makeRecipeDB>;

interface Dependencies {
  recipeDB: {
    findRecipeById: RecipeDB["findRecipeById"];
    deleteRecipe: RecipeDB["deleteRecipe"];
    isKeywordInUse: RecipeDB["isKeywordInUse"];
  };
  recipeIndex: {
    deleteRecipe: ReturnType<typeof makeRecipeIndex>["deleteRecipe"];
  };
  keywordIndex: {
    deleteKeywords: ReturnType<typeof makeKeywordIndex>["deleteKeywords"];
  };
}

export default function makeRemoveRecipe({
  recipeDB,
  recipeIndex,
  keywordIndex,
}: Dependencies) {
  return async function removeRecipe({ recipeId }: { recipeId: string }) {
    const res = recipeDB.findRecipeById(recipeId);

    if (!res) {
      throw new Error("The recipe does not exist");
    }

    const getKeywords = res.keywords;

    // delete recipe in DB. This should also delete the keywords in the DB's keyword table. Check the keyword table schema for more info.
    const deletedRecipe = recipeDB.deleteRecipe(recipeId);

    // delete recipe in meilisearch
    await recipeIndex.deleteRecipe(recipeId);

    // remove orphaned keywords in meilisearch
    const keywordIdsToDelete: string[] = [];

    for (const keyword of getKeywords) {
      const keywordIsStillUsed = recipeDB.isKeywordInUse(keyword);

      if (!keywordIsStillUsed) keywordIdsToDelete.push(keyword);
    }

    if (keywordIdsToDelete.length > 0) {
      await keywordIndex.deleteKeywords(keywordIdsToDelete);
    }

    return deletedRecipe;
  };
}
