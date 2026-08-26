import type { makeRecipe } from "../entities/index.js";
import type buildKeywords from "../utils/recipe/buildKeywords.js";
import type buildRecipeEmbeddingText from "../utils/recipe/buildRecipeEmbeddingText.js";
import type makeRecipeDB from "../database/recipeDB.js";
import type makeGenerateEmbedding from "../services/embeddings/generateEmbedding.js";
import type makeRecipeIndex from "../services/meilisearch/recipeIndex.js";
import type makeKeywordIndex from "../services/meilisearch/keywordIndex.js";
import type { CreateRecipe } from "../entities/types.js";

type RecipeDB = ReturnType<typeof makeRecipeDB>;
type GenerateEmbedding = ReturnType<typeof makeGenerateEmbedding>;

interface AddRecipeDependencies {
  makeRecipe: typeof makeRecipe;

  recipeDB: {
    insertRecipe: RecipeDB["insertRecipe"];
  };

  generateEmbedding: GenerateEmbedding;

  buildKeywords: typeof buildKeywords;

  buildRecipeEmbeddingText: typeof buildRecipeEmbeddingText;

  recipeIndex: {
    addRecipe: ReturnType<typeof makeRecipeIndex>["addRecipe"];
  };

  keywordsIndex: {
    addKeywords: ReturnType<typeof makeKeywordIndex>["addKeywords"];
  };
}

export default function makeAddRecipe({
  makeRecipe,
  recipeDB,
  buildKeywords,
  generateEmbedding,
  buildRecipeEmbeddingText,
  recipeIndex,
  keywordsIndex,
}: AddRecipeDependencies) {
  return async function addRecipe(recipeInfo: CreateRecipe) {
    // build keywords and add it to the recipe that will be validated
    const keywords = buildKeywords({
      area: recipeInfo.area,
      category: recipeInfo.category,
      ingredients: recipeInfo.ingredientNames,
    });

    recipeInfo.keywords = keywords;

    const recipe = makeRecipe({ data: recipeInfo });

    // create the embedding and add it to the validated recipe
    const embeddingText = buildRecipeEmbeddingText({
      recipeName: recipe.recipeName,
      area: recipe.area,
      category: recipe.category,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
    });

    const createEmbedding = await generateEmbedding(embeddingText);

    const finalRecipe = {
      ...recipe,
      embedding: createEmbedding
    }

    // insert to database
    const savedRecipe = recipeDB.insertRecipe({
      recipe: finalRecipe,
      keywords: recipe.keywords,
    });

    // insert recipe and keywords to meilisearch
    await recipeIndex.addRecipe(savedRecipe);
    await keywordsIndex.addKeywords(recipe.keywords);

    return savedRecipe;
  };
}
