import type { makeRecipe } from "../entities/index.js";
import type buildKeywords from "../utils/recipe/buildKeywords.js";
import type buildRecipeEmbeddingText from "../utils/recipe/buildRecipeEmbeddingText.js";
import type makeRecipeDB from "../database/recipeDB.js";
import type makeGenerateEmbedding from "../services/embeddings/generateEmbedding.js";
import type {
  meiliRecipeIndex,
  meiliKeywordIndex,
} from "../services/meilisearch/index.js";
import type { CreateRecipe } from "../entities/types.js";

type RecipeDB = ReturnType<typeof makeRecipeDB>;
type GenerateEmbedding = ReturnType<typeof makeGenerateEmbedding>;

interface AddRecipeDependencies {
  makeRecipe: typeof makeRecipe;

  recipeDB: RecipeDB;

  generateEmbedding: GenerateEmbedding;

  buildKeywords: typeof buildKeywords;

  buildRecipeEmbeddingText: typeof buildRecipeEmbeddingText;

  addRecipeIndex: typeof meiliRecipeIndex.addRecipe;

  addKeywordsIndex: typeof meiliKeywordIndex.addKeywords;
}

export default function makeAddRecipe({
  makeRecipe,
  recipeDB,
  buildKeywords,
  generateEmbedding,
  buildRecipeEmbeddingText,
  addRecipeIndex,
  addKeywordsIndex,
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

    recipe.embedding = createEmbedding;

    // insert to database
    const savedRecipe = recipeDB.insertRecipe({
      recipe,
      keywords: recipe.keywords,
    });

    // insert recipe and keywords to meilisearch
    await addRecipeIndex(savedRecipe);
    await addKeywordsIndex(recipe.keywords);

    return savedRecipe;
  };
}
