import type { RecipeSchema } from "../db/type.js"

export function buildRecipeEmbeddingText(recipe: RecipeSchema) {
    const slicedInstruction = sliceInstruction(recipe.instructions)

    return `
        ${recipe.recipeName}

        ${slicedInstruction}

        ${recipe.category}

        ${recipe.area}

        ${recipe.ingredients.join(', ')}
    `
}

function sliceInstruction(instruction:string) {
    let ins = instruction
    
    if (ins.length > 2500) {
        ins = ins.slice(0, 2500)
    }

    return ins
}