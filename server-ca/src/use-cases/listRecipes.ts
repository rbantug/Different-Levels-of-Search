import type makeRecipeDB from "../database/recipeDB.js"

interface Dependencies {
    recipeDB: ReturnType<typeof makeRecipeDB>
}

export default function makeListRecipes({ recipeDB }: Dependencies) {
    return function listRecipes() {
        return recipeDB.findAllRecipes()
    }
}