import { eq, and, inArray } from "drizzle-orm";

import { recipes } from "./schemas/recipe.js";
import { recipeKeywords } from "./schemas/recipeKeyword.js";

import type { DatabaseClient } from "./client.js";

export interface UpdateRecipeParams {
  id: string;
  changes: Partial<typeof recipes.$inferInsert>;
  keywordsToAdd: string[];
  keywordsToRemove: string[];
}

export default function makeRecipeDB({ db }: { db: DatabaseClient }) {
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

      return createdRecipe;
    });
  }

  function findAllRecipes() {
    return db.select().from(recipes).all();
  }

  function findRecipeById(id: string) {
    return db.select().from(recipes).where(eq(recipes.id, id)).get();
  }

  function findRecipesById(recipeIdArr: string[]) {
    return db.select().from(recipes).where(inArray(recipes.id, recipeIdArr)).all()
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

  function deleteRecipe(id: string) {
    return db.delete(recipes).where(eq(recipes.id, id)).run();
  }

  return {
    insertRecipe,
    findAllRecipes,
    findRecipeById,
    findRecipesById,
    findAllKeywords,
    findRecipeKeywords,
    updateRecipe,
    isKeywordInUse,
    deleteRecipe,
  };
}
