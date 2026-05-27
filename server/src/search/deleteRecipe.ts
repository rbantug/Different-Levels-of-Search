import { recipeIndex } from "./meilisearch.js";

export async function deleteRecipeIndex(id: string) {
    await recipeIndex.deleteDocument(id)
}