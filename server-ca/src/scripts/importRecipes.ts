import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { addRecipe } from "../use-cases/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "recipes.json");

const jsonData = fs.readFileSync(filePath, "utf-8");
const recipeData = JSON.parse(jsonData);

export default async function runImport() {
  const meals = recipeData.meals;

  for (const recipe of meals) {
    const { ingredients: ingArr, ingredientName } =
      mergeIngredients(recipe) || [];

    const toBeInsertedRecipe = {
      recipeName: recipe.strMeal,
      category: recipe.strCategory,
      area: recipe.strArea,
      instructions: recipe.strInstructions,
      recipeThumbnail: recipe.strMealThumb,
      ingredients: ingArr,
      ingredientNames: ingredientName,
      keywords: [],
    };

    try {
      await addRecipe(toBeInsertedRecipe);
    } catch (error) {
      console.error(`Failed to import recipe: ${recipe.strMeal}`, error);

      throw error;
    }
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
