import type makeRecipeDB from "../database/recipeDB.js";
import AppError from "../errors/AppError.js";

type RecipeDB = ReturnType<typeof makeRecipeDB>;

interface Dependencies {
  recipeDB: {
    findRecipeById: RecipeDB["findRecipeById"];
    deleteRecipe: RecipeDB["deleteRecipe"];
    isKeywordInUse: RecipeDB["isKeywordInUse"];
  };
}

export default function makeRemoveRecipe({
  recipeDB,
}: Dependencies) {
  return async function removeRecipe({ recipeId }: { recipeId: string }) {
    const recipe = recipeDB.findRecipeById(recipeId);

    if (!recipe) {
      throw new AppError("The recipe does not exist", 404);
    }

    // delete recipe in DB. This should also delete the keywords in the DB's keyword table. Check the keyword table schema for more info.
    const deletedRecipe = recipeDB.deleteRecipe(recipeId);

    return deletedRecipe;
  };
}
