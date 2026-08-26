import AppError from "../errors/AppError.js";
import type { UpdateRecipe } from "../entities/types.js";
import type makeUpdateRecipe from "../use-cases/updateRecipe.js";

interface Dependencies {
  updateRecipe: ReturnType<typeof makeUpdateRecipe>;
}

export default function makeUpdateSingleRecipe({ updateRecipe }: Dependencies) {
  return async function updateSingleRecipe({
    recipeId,
    body,
  }: {
    recipeId: string;
    body: UpdateRecipe;
  }) {
    if (!recipeId) {
      throw new AppError("A recipe id is required", 400);
    }

    const recipe = await updateRecipe({ id: recipeId, changes: body });

    return {
      statusCode: 200,
      body: {
        status: "success",
        data: recipe,
      },
    };
  };
}
