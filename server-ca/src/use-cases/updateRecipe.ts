import type { updateRecipe } from "../entities/index.js";
import type buildKeywords from "../utils/recipe/buildKeywords.js";
import type buildRecipeEmbeddingText from "../utils/recipe/buildRecipeEmbeddingText.js";
import type makeRecipeDB from "../database/recipeDB.js";
import type makeGenerateEmbedding from "../services/embeddings/generateEmbedding.js";

import type { RecipeValidated } from "../entities/types.js";
import AppError from "../errors/AppError.js";

type RecipeDB = ReturnType<typeof makeRecipeDB>;

interface UpdateRecipeDependencies {
  recipeDB: {
    findRecipeById: RecipeDB["findRecipeById"];
    updateRecipe: RecipeDB["updateRecipe"];
    isKeywordInUse: RecipeDB["isKeywordInUse"];
  };

  updateRecipeEntity: typeof updateRecipe;

  buildKeywords: typeof buildKeywords;

  buildRecipeEmbeddingText: typeof buildRecipeEmbeddingText;

  generateEmbedding: ReturnType<typeof makeGenerateEmbedding>;
}

export interface UpdateRecipeParam {
  recipeName?: string;
  category?: string;
  area?: string;
  slug?: string;
  recipeThumbnail?: string | null;
  instructions?: string[];
  ingredients?: string[];
  keywords?: string[];
  ingredientNames?: string[];
}

export default function makeUpdateRecipe({
  updateRecipeEntity,
  recipeDB,
  buildKeywords,
  buildRecipeEmbeddingText,
  generateEmbedding,
}: UpdateRecipeDependencies) {
  return async function updateRecipe({
    id,
    changes,
  }: {
    id: string;
    changes: UpdateRecipeParam;
  }) {
    // get existing recipe from database
    const currentRecipe = recipeDB.findRecipeById(id);

    if (!currentRecipe) {
      throw new AppError("Recipe not found", 404);
    }

    // validate recipe
    const validatedRecipe = updateRecipeEntity({
      oldRecipe: currentRecipe,
      changes,
    });

    // find keywords that will be added and/or removed
    const shouldUpdateKeywords =
      changes.area !== undefined ||
      changes.category !== undefined ||
      changes.ingredientNames !== undefined;

    let keywordsToAdd: string[] = [];
    let keywordsToRemove: string[] = [];

    if (shouldUpdateKeywords) {
      const oldKeywords = new Set(currentRecipe.keywords);

      const newKeywords = new Set(
        buildKeywords({
          area: validatedRecipe.area,
          category: validatedRecipe.category,
          ingredients: changes.ingredientNames ?? [],
        }),
      );

      keywordsToAdd = [...newKeywords].filter(
        (keyword) => !oldKeywords.has(keyword),
      );

      keywordsToRemove = [...oldKeywords].filter(
        (keyword) => !newKeywords.has(keyword),
      );
    }

    // generate embedding for updated recipe
    const currentEmbeddingText = buildRecipeEmbeddingText({
      recipeName: currentRecipe.recipeName,
      area: currentRecipe.area,
      category: currentRecipe.category,
      ingredients: currentRecipe.ingredients,
      instructions: currentRecipe.instructions,
    });

    const updatedEmbeddingText = buildRecipeEmbeddingText({
      recipeName: validatedRecipe.recipeName,
      area: validatedRecipe.area,
      category: validatedRecipe.category,
      ingredients: validatedRecipe.ingredients,
      instructions: validatedRecipe.instructions,
    });

    const embedding =
      currentEmbeddingText === updatedEmbeddingText
        ? currentRecipe.embedding
        : await generateEmbedding(updatedEmbeddingText);

    const finalRecipe: RecipeValidated = {
      ...validatedRecipe,
      embedding,
    };

    // update recipe in database
    const savedRecipe = recipeDB.updateRecipe({
      id,
      changes: finalRecipe,
      keywordsToAdd,
      keywordsToRemove,
    });

    return savedRecipe;
  };
}
