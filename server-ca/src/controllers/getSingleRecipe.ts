import AppError from "../errors/AppError.js";
import type makeFindRecipeById from "../use-cases/findRecipeById.js";

interface Dependencies {
  findRecipeById: ReturnType<typeof makeFindRecipeById>;
}

export default function makeGetSingleRecipe({ findRecipeById }: Dependencies) {
  return function getSingleRecipe({ recipeId }: { recipeId: string }) {
    if (!recipeId) {
      throw new AppError("A recipe id is required", 400);
    }

    const recipe = findRecipeById({ recipeId });

    return {
      statusCode: 200,
      status: "success",
      data: recipe,
    };
  };
}
