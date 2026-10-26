import { eq, and, inArray, asc, sql, lt } from "drizzle-orm";

import { recipes } from "./schemas/recipe.js";
import { recipeKeywords } from "./schemas/recipeKeyword.js";
import { searchOutbox } from "./schemas/searchOutbox.js";

import type { DatabaseClient } from "./client.js";

export interface UpdateRecipeParams {
  id: string;
  changes: Partial<typeof recipes.$inferInsert>;
  keywordsToAdd: string[];
  keywordsToRemove: string[];
}

export default function makeRecipeDB({ db }: { db: DatabaseClient }) {
  // This will add a new recipe in "recipes" table and a new job in "searchOutbox" table
  function insertRecipe({
    recipe,
    keywords,
  }: {
    recipe: typeof recipes.$inferInsert;
    keywords: string[];
  }) {
    return db.transaction((trans) => {
      const [createdRecipe] = trans
        .insert(recipes)
        .values(recipe)
        .returning()
        .all();

      if (!createdRecipe) {
        throw new Error("Failed to create recipe");
      }

      if (keywords.length > 0) {
        trans
          .insert(recipeKeywords)
          .values(
            keywords.map((keyword) => ({
              recipeId: createdRecipe.id,
              keyword,
            })),
          )
          .run();
      }

      trans
        .insert(searchOutbox)
        .values({
          recipeId: createdRecipe.id,
          operation: "upsert",
          keywordsToAdd: keywords,
          keywordsToRemove: [],
        })
        .run();

      return createdRecipe;
    });
  }

  function findAllRecipes() {
    return db.select().from(recipes).all();
  }

  function findRecipeById(id: string) {
    return db.select().from(recipes).where(eq(recipes.id, id)).get();
  }

  function findRecipeBySlug(slug: string) {
    return db.select().from(recipes).where(eq(recipes.slug, slug)).get();
  }

  function findRecipesById(recipeIdArr: string[]) {
    return db
      .select()
      .from(recipes)
      .where(inArray(recipes.id, recipeIdArr))
      .all();
  }

  function findAllKeywords() {
    return db.select().from(recipeKeywords).all();
  }

  function findRecipeKeywords(recipeId: string) {
    return db
      .select({ keyword: recipeKeywords.keyword })
      .from(recipeKeywords)
      .where(eq(recipeKeywords.recipeId, recipeId))
      .all();
  }

  // This will update the recipe in "recipes" table and add a job in "searchOutbox" table
  function updateRecipe({
    id,
    changes,
    keywordsToAdd,
    keywordsToRemove,
  }: UpdateRecipeParams) {
    return db.transaction((trans) => {
      // update recipe
      const [updatedRecipe] = trans
        .update(recipes)
        .set(changes)
        .where(eq(recipes.id, id))
        .returning()
        .all();

      if (!updatedRecipe) {
        throw new Error("Recipe not found");
      }

      if (keywordsToRemove.length > 0) {
        trans
          .delete(recipeKeywords)
          .where(
            and(
              eq(recipeKeywords.recipeId, id),
              inArray(recipeKeywords.keyword, keywordsToRemove),
            ),
          )
          .run();
      }

      if (keywordsToAdd.length > 0) {
        trans
          .insert(recipeKeywords)
          .values(
            keywordsToAdd.map((keyword) => ({
              recipeId: id,
              keyword,
            })),
          )
          .run();
      }

      trans
        .insert(searchOutbox)
        .values({
          recipeId: id,
          operation: "upsert",
          keywordsToAdd,
          keywordsToRemove,
        })
        .run();

      return updatedRecipe;
    });
  }

  function isKeywordInUse(keyword: string) {
    const result = db
      .select({ recipeId: recipeKeywords.recipeId })
      .from(recipeKeywords)
      .where(eq(recipeKeywords.keyword, keyword))
      .limit(1)
      .all();

    return result.length > 0;
  }

  /**
   * This will: 
   * - Retrieve all the keywords in the recipe that will be deleted. 
   * - Next, it will delete the recipe itself. 
   * - Finally, it will create a job in "outboxSearch" table
  */
  function deleteRecipe(id: string) {
    return db.transaction((trans) => {
      const keywords = trans
        .select({ keyword: recipeKeywords.keyword })
        .from(recipeKeywords)
        .where(eq(recipeKeywords.recipeId, id))
        .all()
        .map(({ keyword }) => keyword);

      const result = trans.delete(recipes).where(eq(recipes.id, id)).run();

      if (result.changes > 0) {
        trans
          .insert(searchOutbox)
          .values({
            recipeId: id,
            operation: "delete",
            keywordsToAdd: [],
            keywordsToRemove: keywords,
          })
          .run();
      }

      return result;
    });
  }
  /////////////////////////////////////
  // Transactional Outbox related code
  /////////////////////////////////////

  // Fetch jobs oldest-first so retries and normal processing are predictable.
  function findPendingOutboxJobs(limit = 100) {
    return db
      .select()
      .from(searchOutbox)
      .where(eq(searchOutbox.status, "pending"))
      .orderBy(asc(searchOutbox.id))
      .limit(limit)
      .all();
  }

  function markOutboxJobCompleted(id: number) {
    return db
      .update(searchOutbox)
      .set({
        status: "completed",
        processedAt: new Date(),
        lastError: null,
      })
      .where(eq(searchOutbox.id, id))
      .run();
  }

  // Failed jobs remain pending so the worker can retry them.
  function recordOutboxJobFailure(id: number, error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    return db
      .update(searchOutbox)
      .set({
        attempts: sql`${searchOutbox.attempts} + 1`,
        lastError: message,
      })
      .where(eq(searchOutbox.id, id))
      .run();
  }

  // Remove only completed jobs whose processing date is older than the cutoff.
  function deleteOldCompletedJobs(days = 7) {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    return db
      .delete(searchOutbox)
      .where(
        and(
          eq(searchOutbox.status, "completed"),
          lt(searchOutbox.processedAt, cutoff),
        ),
      )
      .run();
  }

  return {
    insertRecipe,
    findAllRecipes,
    findRecipeById,
    findRecipeBySlug,
    findRecipesById,
    findAllKeywords,
    findRecipeKeywords,
    updateRecipe,
    isKeywordInUse,
    deleteRecipe,
    findPendingOutboxJobs,
    markOutboxJobCompleted,
    recordOutboxJobFailure,
    deleteOldCompletedJobs,
  };
}
