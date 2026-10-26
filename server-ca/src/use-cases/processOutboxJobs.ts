import type makeRecipeDB from "../database/recipeDB.js";
import type makeRecipeIndex from "../services/meilisearch/recipeIndex.js";
import type makeKeywordIndex from "../services/meilisearch/keywordIndex.js";

type RecipeDB = ReturnType<typeof makeRecipeDB>;
type RecipeIndex = ReturnType<typeof makeRecipeIndex>;
type KeywordIndex = ReturnType<typeof makeKeywordIndex>;

interface Dependencies {
  recipeDB: Pick<
    RecipeDB,
    | "findPendingOutboxJobs"
    | "findRecipeById"
    | "isKeywordInUse"
    | "markOutboxJobCompleted"
    | "recordOutboxJobFailure"
  >;
  recipeIndex: Pick<RecipeIndex, "addRecipe" | "deleteRecipe">;
  keywordIndex: Pick<KeywordIndex, "addKeywords" | "deleteKeywords">;
}

export default function makeProcessOutboxJobs({
  recipeDB,
  recipeIndex,
  keywordIndex,
}: Dependencies) {
  return async function processOutboxJobs() {
    const jobs = recipeDB.findPendingOutboxJobs();

    for (const job of jobs) {
      try {
        if (job.operation === "upsert") {
          const recipe = recipeDB.findRecipeById(job.recipeId);

          // The recipe may have been deleted after this job was created.
          if (recipe) {
            await recipeIndex.addRecipe({
              id: recipe.id,
              recipeName: recipe.recipeName,
              category: recipe.category,
              area: recipe.area,
              ingredients: recipe.ingredients,
              embedding: recipe.embedding,
            });
          }

          if (job.keywordsToAdd.length > 0) {
            await keywordIndex.addKeywords(job.keywordsToAdd);
          }
        } else if (job.operation === "delete") {
          await recipeIndex.deleteRecipe(job.recipeId);
        }

        // Remove keywords only when no recipe still uses them.
        const keywordIdsToDelete: string[] = [];

        for (const keyword of job.keywordsToRemove) {
          if (!recipeDB.isKeywordInUse(keyword)) {
            keywordIdsToDelete.push(keyword);
          }
        }

        if (keywordIdsToDelete.length > 0) {
          await keywordIndex.deleteKeywords(keywordIdsToDelete);
        }

        recipeDB.markOutboxJobCompleted(job.id);
      } catch (error) {
        recipeDB.recordOutboxJobFailure(job.id, error);

        console.error(`Failed to process outbox job ${job.id}:`, error);
      }
    }
  };
}
