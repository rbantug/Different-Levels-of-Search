import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { db } from "../src/db/index.js";
import { recipes } from "../src/db/schema.js";

import { indexRecipe } from "../src/search/indexRecipe.js";
import type { RecipeSchema } from "../src/db/type.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "recipes.json");

const jsonData = fs.readFileSync(filePath, "utf-8");
const recipeData = JSON.parse(jsonData);

export async function runImport() {
  try {
    const meals = recipeData.meals;
    for (const recipe of meals) {
      const now = new Date();

      const toBeInsertedRecipe = {
        id: crypto.randomUUID(),
        recipeName: recipe.strMeal,
        category: recipe.strCategory,
        area: recipe.strArea,
        instructions: recipe.strInstructions,
        recipeThumbnail: recipe.strMealThumb,
        ingredient1: recipe.strIngredient1 || "",
        ingredient2: recipe.strIngredient2 || "",
        ingredient3: recipe.strIngredient3 || "",
        ingredient4: recipe.strIngredient4 || "",
        ingredient5: recipe.strIngrewdient5 || "",
        ingredient6: recipe.strIngredient6 || "",
        ingredient7: recipe.strIngredient7 || "",
        ingredient8: recipe.strIngredient8 || "",
        ingredient9: recipe.strIngredient9 || "",
        ingredient10: recipe.strIngredient10 || "",
        ingredient11: recipe.strIngredient11 || "",
        ingredient12: recipe.strIngredient12 || "",
        ingredient13: recipe.strIngredient13 || "",
        ingredient14: recipe.strIngredient14 || "",
        ingredient15: recipe.strIngredient15 || "",
        ingredient16: recipe.strIngredient16 || "",
        ingredient17: recipe.strIngredient17 || "",
        ingredient18: recipe.strIngredient18 || "",
        ingredient19: recipe.strIngredient19 || "",
        ingredient20: recipe.strIngredient20 || "",
        measure1: recipe.strMeasure1 || "",
        measure2: recipe.strMeasure2 || "",
        measure3: recipe.strMeasure3 || "",
        measure4: recipe.strMeasure4 || "",
        measure5: recipe.strMeasure5 || "",
        measure6: recipe.strMeasure6 || "",
        measure7: recipe.strMeasure7 || "",
        measure8: recipe.strMeasure8 || "",
        measure9: recipe.strMeasure9 || "",
        measure10: recipe.strMeasure10 || "",
        measure11: recipe.strMeasure11 || "",
        measure12: recipe.strMeasure12 || "",
        measure13: recipe.strMeasure13 || "",
        measure14: recipe.strMeasure14 || "",
        measure15: recipe.strMeasure15 || "",
        measure16: recipe.strMeasure16 || "",
        measure17: recipe.strMeasure17 || "",
        measure18: recipe.strMeasure18 || "",
        measure19: recipe.strMeasure19 || "",
        measure20: recipe.strMeasure20 || "",
        embedding: {},
        createdAt: now,
        updatedAt: now,
      };

      await db.insert(recipes).values(toBeInsertedRecipe);

      await indexRecipe(toBeInsertedRecipe)
    }
  } catch (error: unknown) {
    console.error(error);
  }

  console.log("import completed!");
}

function extractIngredients(recipe:any) {
  const ingredients = []

  for (let i = 1; i <= 20; i++) {
    const ing = recipe[`ingredient${i}`]?.trim()
    const measure = recipe[`measure${i}`]?.trim()

    if (ing) {
      const merge = `${measure} ${ing}`
      ingredients.push(merge)
    } 

    return ingredients
  }
}