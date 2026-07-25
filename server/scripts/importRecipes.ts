import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import slugify from "slugify";

import { db } from "../src/db/index.js";
import { recipes } from "../src/db/schema.js";

import { indexRecipe } from "../src/search/indexRecipe.js";
import { validateCreateRecipe } from "../src/joiValidation.js";
import { buildRecipeEmbeddingText } from "../src/embeddings/buildRecipeEmbeddingText.js";
import { generateEmbedding } from "../src/embeddings/generateEmbedding.js";
import { buildKeywords } from "../src/search/buildKeywords.js";
import { normalizeKeyword } from "../src/search/normalizeKeywords.js";
import { keywordIndex, meili } from "../src/search/meilisearch.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "recipes.json");

const jsonData = fs.readFileSync(filePath, "utf-8");
const recipeData = JSON.parse(jsonData);

export async function runImport() {
  try {
    const meals = recipeData.meals;
    const allKeywords = new Set<string>();

    // import recipes to meili and sqlite
    for (const recipe of meals) {
      const {ingredients: ingArr, ingredientName} = mergeIngredients(recipe) || [];

      const toBeInsertedRecipe = {
        recipeName: recipe.strMeal,
        category: recipe.strCategory,
        area: recipe.strArea,
        slug: slugify(recipe.strMeal),
        instructions: recipe.strInstructions,
        recipeThumbnail: recipe.strMealThumb,
        ingredients: ingArr,
      };

      const validatedRecipe = validateCreateRecipe(toBeInsertedRecipe);

      const embeddingText = buildRecipeEmbeddingText(validatedRecipe);

      const embedding = await generateEmbedding(embeddingText);

      validatedRecipe.embedding = embedding;

      await db.insert(recipes).values(validatedRecipe);

      await indexRecipe({
        id: validatedRecipe.id,
        recipeName: validatedRecipe.recipeName,
        area: validatedRecipe.area,
        category: validatedRecipe.category,
        ingredients: validatedRecipe.ingredients,
        instructions: validatedRecipe.instructions,
      });

      buildKeywords(
        toBeInsertedRecipe.category,
        toBeInsertedRecipe.area,
        ingredientName,
      ).forEach((keyword: string) => {
        allKeywords.add(normalizeKeyword(keyword));
      });
    }

    // insert all keywords to meilisearch
    const keywordDocuments = [...allKeywords].map(keyword => ({
      id: keyword,
      keyword
    }))
    const task = await keywordIndex.addDocuments(keywordDocuments)
  } catch (error: unknown) {
    console.error(error);
  }

  console.log("import completed!");
}

function mergeIngredients(recipe: any) {
  const ingredients = [];
  const ingredientName = [];

  for (let i = 1; i <= 20; i++) {
    const ing = recipe[`strIngredient${i}`]?.trim().replace(/ {2,}/g, " ");
    const measure = recipe[`strMeasure${i}`]?.trim().replace(/ {2,}/g, " ");

    if (ing) {
      const merge = `${measure} ${ing}`;
      ingredients.push(merge);
      ingredientName.push(ing)
    }
  }
  return { ingredients, ingredientName };
}
