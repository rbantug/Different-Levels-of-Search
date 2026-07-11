import type { RecipeSchema } from "../db/type.js"

export function buildRecipeEmbeddingText(recipe: RecipeSchema) {

    return `
        ${recipe.recipeName}

        ${recipe.instructions.join(", ")}

        ${recipe.category}

        ${recipe.area}

        ${recipe.ingredients.join(", ")}
    `;
}