import type { updateRecipe } from "../entities/index.js";
import type buildKeywords from "../utils/recipe/buildKeywords.js";
import type buildRecipeEmbeddingText from "../utils/recipe/buildRecipeEmbeddingText.js";
import type makeRecipeDB from "../database/recipeDB.js";
import type makeGenerateEmbedding from "../services/embeddings/generateEmbedding.js";
import type makeRecipeIndex from "../services/meilisearch/recipeIndex.js"
import type makeKeywordIndex from "../services/meilisearch/keywordIndex.js"

import type { RecipeValidated, UpdateRecipe } from "../entities/types.js";

interface UpdateRecipeDependencies {
  recipeDB: ReturnType<typeof makeRecipeDB>;

  updateRecipeEntity: typeof updateRecipe;

  buildKeywords: typeof buildKeywords;

  buildRecipeEmbeddingText: typeof buildRecipeEmbeddingText;

  generateEmbedding: ReturnType<typeof makeGenerateEmbedding>;

  recipeSearchIndex: ReturnType<typeof makeRecipeIndex>;

  keywordSearchIndex: ReturnType<typeof makeKeywordIndex>;
}

export default function makeUpdateRecipe({
  updateRecipeEntity,
  recipeDB,
  buildKeywords,
  buildRecipeEmbeddingText,
  generateEmbedding,
  recipeSearchIndex,
  keywordSearchIndex,
}: UpdateRecipeDependencies) {
  return async function updateRecipe({
    id,
    changes,
  }: {
    id: string;
    changes: UpdateRecipe;
  }) {
    // get existing recipe from database
    const currentRecipe = recipeDB.findRecipeById(id);

    if (!currentRecipe) {
      throw new Error("Recipe not found");
    }

    // validate recipe
    const validatedRecipe = updateRecipeEntity({
      oldRecipe: currentRecipe,
      changes,
    });

    // find keywords that will be added and/or removed
    const oldKeywords = new Set(currentRecipe.keywords);

    const newKeywords = new Set(
      buildKeywords({
        area: changes.area || "",
        category: changes.category || "",
        ingredients: changes.ingredientNames || [],
      }),
    );

    const keywordsToAdd = [...newKeywords].filter(
      (keyword) => !oldKeywords.has(keyword),
    );

    const keywordsToRemove = [...oldKeywords].filter(
      (keyword) => !newKeywords.has(keyword),
    );

    // generate embedding for updated recipe
    const embeddingText = buildRecipeEmbeddingText({
      recipeName: validatedRecipe.recipeName,
      area: validatedRecipe.area,
      category: validatedRecipe.category,
      ingredients: validatedRecipe.ingredients,
      instructions: validatedRecipe.instructions,
    });

    const embedding = await generateEmbedding(embeddingText);

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

    // update recipe in meilisearch
    await recipeSearchIndex.addRecipe(finalRecipe);

    // add new keywords in meilisearch
    if (keywordsToAdd.length > 0) {
      await keywordSearchIndex.addKeywords(keywordsToAdd);
    }

    // find unused keywords in keyword index in meilisearch
    const keywordIdsToDelete: string[] = [];

    for (const keyword of keywordsToRemove) {
      const keywordIsStillUsed = recipeDB.isKeywordInUse(keyword);

      if (!keywordIsStillUsed) keywordIdsToDelete.push(keyword);
    }

    if (keywordIdsToDelete.length > 0) {
      await keywordSearchIndex.deleteKeywords(keywordIdsToDelete);
    }

    return savedRecipe;
  };
}
