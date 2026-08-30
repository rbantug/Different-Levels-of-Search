import type {
  CreateRecipe,
  RecipeValidated,
  RecipeDependencies,
  UpdateRecipe,
} from "./types.js";

import buildRecipeValidation from "./validation.js";

export default function buildMakeRecipe({
  uuid,
  joi,
  slugify,
}: RecipeDependencies) {
  const { validateCreateRecipe, validateUpdateRecipe } = buildRecipeValidation({
    joi,
  });

  function makeRecipe({ data }: { data: CreateRecipe }): RecipeValidated {
    const validatedData = validateCreateRecipe(data);

    const now = new Date();
    now.setSeconds(0,0)

    return Object.freeze({
      id: uuid.makeId(),
      recipeName: validatedData.recipeName,
      category: validatedData.category,
      area: validatedData.area,
      slug: slugify(validatedData.recipeName, { lower: true }),
      instructions: validatedData.instructions,
      recipeThumbnail: validatedData.recipeThumbnail,
      ingredients: validatedData.ingredients,
      keywords: validatedData.keywords,
      embedding: [],
      createdAt: now,
      updatedAt: now,
    });
  }

  function updateRecipe({
    oldRecipe,
    changes,
  }: {
    oldRecipe: RecipeValidated;
    changes: UpdateRecipe;
  }): RecipeValidated {
    const validateChanges = validateUpdateRecipe(changes);

    const recipeNameChanged =
      validateChanges.recipeName &&
      validateChanges.recipeName !== oldRecipe.recipeName;

    const now = new Date()
    now.setSeconds(0,0)

    const updatedRecipe = {
      ...oldRecipe,
      ...validateChanges,
      slug: recipeNameChanged
        ? slugify(validateChanges.recipeName!, { lower: true })
        : oldRecipe.slug,
      updatedAt: now,
    };

    return Object.freeze(updatedRecipe);
  }

  return {
    makeRecipe,
    updateRecipe,
  };
}
