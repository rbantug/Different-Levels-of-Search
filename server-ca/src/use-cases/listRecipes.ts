import type makeRecipeDB from "../database/recipeDB.js"

interface Dependencies {
  recipeDB: {
    findAllRecipes: ReturnType<typeof makeRecipeDB>['findAllRecipes'];
  };
}

export default function makeListRecipes({ recipeDB }: Dependencies) {
    return function listRecipes() {
        return recipeDB.findAllRecipes()
    }
}