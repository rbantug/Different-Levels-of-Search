import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import slugify from "slugify";

import { addRecipe } from "../src/use-cases/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "recipes.json");

const jsonData = fs.readFileSync(filePath, "utf-8");
const recipeData = JSON.parse(jsonData);

export default async function runImport() {
  try {
    const meals = recipeData.meals;

    // import recipes to meili and sqlite
    for (const recipe of meals) {
      const { ingredients: ingArr, ingredientName } =
        mergeIngredients(recipe) || [];

      const toBeInsertedRecipe = {
        recipeName: recipe.strMeal,
        category: recipe.strCategory,
        area: recipe.strArea,
        slug: slugify(recipe.strMeal, { lower: true }),
        instructions: recipe.strInstructions,
        recipeThumbnail: recipe.strMealThumb,
        ingredients: ingArr,
        ingredientNames: ingredientName,
        keywords: []
      };

      await addRecipe(toBeInsertedRecipe)
    }
  } catch (error: unknown) {
    throw new Error(error.message);
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
      ingredientName.push(ing);
    }
  }
  return { ingredients, ingredientName };
}
