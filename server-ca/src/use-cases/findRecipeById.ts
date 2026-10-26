import type makeRecipeDB from "../database/recipeDB.js";
import AppError from "../errors/AppError.js";

interface Dependencies {
  recipeDB: {
    findRecipeById: ReturnType<typeof makeRecipeDB>["findRecipeById"];
  };
}

export default function makeFindRecipeById({ recipeDB }: Dependencies) {
  return function findRecipeById({ recipeId }: { recipeId: string }) {
    const res = recipeDB.findRecipeById(recipeId);

    if (!res) {
      throw new AppError("The recipe does not exist", 404);
    }

    return res;
  };
}
