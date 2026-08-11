import type {
  CreateRecipe,
  RecipeValidated,
  RecipeDependencies,
  UpdateRecipe,
} from "./types.js";

import buildRecipeValidation from "./validation.js";

export default function buildMakeRecipe({ uuid, joi }: RecipeDependencies) {
  const { validateCreateRecipe, validateUpdateRecipe } = buildRecipeValidation({
    joi,
  });

  function makeRecipe(data: CreateRecipe): RecipeValidated {
    const validatedData = validateCreateRecipe(data);

    const now = new Date();

    return Object.freeze({
      recipeId: uuid.makeId(),
      recipeName: validatedData.recipeName,
      category: validatedData.category,
      area: validatedData.area,
      slug: validatedData.slug,
      instructions: validatedData.instructions,
      recipeThumbnail: validatedData.recipeThumbnail,
      ingredients: validatedData.ingredients,
      ingredientNames: validatedData.ingredientNames,
      embedding: [],
      createdAt: now,
      updatedAt: now,
    });
  }

  function updateRecipe(
    oldRecipe: RecipeValidated,
    changes: UpdateRecipe,
  ): RecipeValidated {
    const validateChanges = validateUpdateRecipe(changes);

    return Object.freeze({
      ...oldRecipe,
      ...validateChanges,
      updatedAt: new Date(),
    });
  }

  return {
    makeRecipe,
    updateRecipe,
  };
}
