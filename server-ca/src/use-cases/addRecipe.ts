import type { makeRecipe } from "../entities/index.js";
import type buildKeywords from "../utils/recipe/buildKeywords.js";
import type buildRecipeEmbeddingText from "../utils/recipe/buildRecipeEmbeddingText.js";
import type makeRecipeDB from "../database/recipeDB.js";
import type makeGenerateEmbedding from "../services/embeddings/generateEmbedding.js";
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
}

type AddRecipeParam = Omit<CreateRecipe, "keywords"> & {
  ingredientNames: string[];
};

export default function makeAddRecipe({
  makeRecipe,
  recipeDB,
  buildKeywords,
  generateEmbedding,
  buildRecipeEmbeddingText,
}: AddRecipeDependencies) {
  return async function addRecipe(recipeInfo: AddRecipeParam) {
    // build keywords and add it to the recipe that will be validated
    const keywords = buildKeywords({
      area: recipeInfo.area,
      category: recipeInfo.category,
      ingredients: recipeInfo.ingredientNames,
    });

    const recipe = makeRecipe({ data: { ...recipeInfo, keywords } });

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
      embedding: createEmbedding,
    };

    // insert to database
    const savedRecipe = recipeDB.insertRecipe({
      recipe: finalRecipe,
      keywords: recipe.keywords,
    });

    return savedRecipe;
  };
}
