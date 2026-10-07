import type makeRecipeDB from "../database/recipeDB.js";
import AppError from "../errors/AppError.js";

interface Dependencies {
  recipeDB: {
    findRecipeBySlug: ReturnType<typeof makeRecipeDB>["findRecipeBySlug"];
  };
}

export default function makeFindRecipeBySlug({ recipeDB }: Dependencies) {
  return function findRecipeBySlug({ slug }: { slug: string }) {
    const res = recipeDB.findRecipeBySlug(slug);

    if (!res) {
      throw new AppError("The recipe does not exist", 404);
    }

    return res;
  };
}
