import type makeRecipeDB from "../database/recipeDB.js";

interface Dependencies {
  recipeDB: ReturnType<typeof makeRecipeDB>;
}

export default function makeFindRecipeById({ recipeDB }: Dependencies) {
  return function findRecipeById({ recipeId }: { recipeId: string }) {
    const res = recipeDB.findRecipeById(recipeId);

    if (!res) {
      throw new Error("The recipe does not exist");
    }

    return res;
  };
}
