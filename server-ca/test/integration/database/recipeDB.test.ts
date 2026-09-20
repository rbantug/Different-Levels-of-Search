import { afterEach, describe, expect, it } from "vitest";

import makeRecipeDB from "../../../src/database/recipeDB.js";
import { createTestDatabase } from "../../helpers/database.js";

describe("recipeDB", () => {
  let sqlite: ReturnType<typeof createTestDatabase>["sqlite"];

  afterEach(() => {
    sqlite.close();
  });

  function createDependencies() {
    const testDatabase = createTestDatabase();

    sqlite = testDatabase.sqlite;

    const recipeDB = makeRecipeDB({
      db: testDatabase.db,
    });

    return {
      recipeDB,
      db: testDatabase.db,
    };
  }

  const now = new Date();
  now.setSeconds(0, 0);

  const testRecipe = {
    id: "recipe-123",
    recipeName: "Chicken Adobo",
    category: "Main Course",
    area: "Filipino",
    slug: "chicken-adobo",
    recipeThumbnail: null,
    instructions: ["Cook the chicken"],
    ingredients: ["1 kg Chicken"],
    keywords: ["filipino", "main course", "chicken"],
    embedding: [0.1, 0.2, 0.3],
    createdAt: now,
    updatedAt: now,
  };

  const testRecipe2 = {
    ...testRecipe,
    id: "recipe-456",
    recipeName: "Beef Caldereta",
    slug: "beef-caldereta",
  };

  describe("insertRecipe", () => {
    it("should insert a recipe", () => {
      const { recipeDB } = createDependencies();

      const result = recipeDB.insertRecipe({
        recipe: testRecipe,
        keywords: testRecipe.keywords,
      });

      // check if recipe was added to recipe table
      expect(result).toEqual(testRecipe);

      const insertedKeywords = recipeDB.findAllKeywords();

      // check if keywords were added to the keyword table
      expect(insertedKeywords).toHaveLength(3);
      expect(insertedKeywords).toEqual([
        { recipeId: testRecipe.id, keyword: "filipino" },
        { recipeId: testRecipe.id, keyword: "main course" },
        { recipeId: testRecipe.id, keyword: "chicken" },
      ]);
    });

    it("should insert a recipe without keywords", () => {
      const { recipeDB } = createDependencies();

      const recipeWithoutKeywords = {
        ...testRecipe,
        keywords: [],
      };

      const result = recipeDB.insertRecipe({
        recipe: recipeWithoutKeywords,
        keywords: [],
      });

      expect(result.id).toBe(recipeWithoutKeywords.id);

      // check if keyword table is empty
      const insertedKeywords = recipeDB.findAllKeywords();

      expect(insertedKeywords).toHaveLength(0);
    });

    it("should roll back the transaction when keyword insertion fails", () => {
      const { recipeDB } = createDependencies();

      const duplicateKeywords = [
        "filipino",
        "main course",
        "chicken",
        "chicken",
      ];

      expect(() =>
        recipeDB.insertRecipe({
          recipe: testRecipe,
          keywords: duplicateKeywords,
        }),
      ).toThrow();

      expect(() => recipeDB.findRecipeById(testRecipe.id)).toBeUndefined;

      expect(() => recipeDB.findAllKeywords).toHaveLength(0);
    });
  });

  describe("findAllRecipes", () => {
    it("should return all recipes", () => {
      const { recipeDB } = createDependencies();

      recipeDB.insertRecipe({
        recipe: testRecipe,
        keywords: testRecipe.keywords,
      });

      recipeDB.insertRecipe({
        recipe: testRecipe2,
        keywords: testRecipe2.keywords,
      });

      const res = recipeDB.findAllRecipes();

      expect(res).toHaveLength(2);

      expect(res).toEqual([testRecipe, testRecipe2]);
    });

    it("should return an empty array when no recipes exist", () => {
      const { recipeDB } = createDependencies();

      const result = recipeDB.findAllRecipes();

      expect(result).toEqual([]);
    });
  });

  describe("findRecipeById", () => {
    it("should return the correct recipe", () => {
      const { recipeDB } = createDependencies();

      recipeDB.insertRecipe({
        recipe: testRecipe,
        keywords: testRecipe.keywords,
      });

      recipeDB.insertRecipe({
        recipe: testRecipe2,
        keywords: testRecipe2.keywords,
      });

      const res = recipeDB.findRecipeById(testRecipe2.id);

      expect(res).toEqual(testRecipe2);
      expect(res?.id).not.toBe(testRecipe.id);
    });
    it("should return undefined when the recipe does not exist", () => {
      const { recipeDB } = createDependencies();

      expect(recipeDB.findRecipeById("foo")).toBeUndefined;
    });
  });

  describe("findRecipesById", () => {
    it("should return the correct recipes", () => {
      const { recipeDB } = createDependencies();

      recipeDB.insertRecipe({
        recipe: testRecipe,
        keywords: testRecipe.keywords,
      });

      recipeDB.insertRecipe({
        recipe: testRecipe2,
        keywords: testRecipe2.keywords,
      });

      const res = recipeDB.findRecipesById([testRecipe.id, testRecipe2.id]);

      expect(res).toEqual([testRecipe, testRecipe2]);
    });

    it("should return an empty array when the recipes does not exist", () => {
      const { recipeDB } = createDependencies();

      const res = recipeDB.findRecipesById([testRecipe.id, testRecipe2.id]);

      expect(res).toHaveLength(0);
    });
  });

  describe("findAllKeywords", () => {
    it("should return all keywords", () => {
      const { recipeDB } = createDependencies();

      recipeDB.insertRecipe({
        recipe: testRecipe,
        keywords: testRecipe.keywords,
      });

      const res = recipeDB.findAllKeywords();

      const compare = testRecipe.keywords.map((k) => ({
        keyword: k,
        recipeId: testRecipe.id,
      }));

      expect(res).toEqual(compare);
    });

    it("should return an empty array when no keywords exist", () => {
      const { recipeDB } = createDependencies();

      const res = recipeDB.findAllKeywords();

      expect(res).toHaveLength(0);
    });
  });

  // Since the scope of this integration test is with recipeDB.ts and the in memory database ONLY, we can't build keywords, slugs or create a list of keywords to add/remove. This is merely testing if the recipe in the database is being updated
  describe("updateRecipe", () => {
    it("should update recipe fields", () => {
      const { recipeDB } = createDependencies();

      recipeDB.insertRecipe({
        recipe: testRecipe,
        keywords: testRecipe.keywords,
      });

      const changes = {
        recipeName: "foo is here",
        area: "The World",
      };

      const compare = {
        ...testRecipe,
        ...changes,
      };

      const res = recipeDB.updateRecipe({
        id: testRecipe.id,
        changes,
        keywordsToAdd: [],
        keywordsToRemove: [],
      });

      expect(res).toEqual(compare);

      const fetchRecipe = recipeDB.findRecipeById(testRecipe.id);

      expect(fetchRecipe).toEqual(compare);
    });

    it("should add keywords", () => {
      const { recipeDB } = createDependencies();

      recipeDB.insertRecipe({
        recipe: testRecipe,
        keywords: testRecipe.keywords,
      });

      const changes = {
        recipeName: "foo is here",
        area: "The World",
      };

      recipeDB.updateRecipe({
        id: testRecipe.id,
        changes,
        keywordsToAdd: ["the world"],
        keywordsToRemove: [],
      });

      const getKeywords = recipeDB.findAllKeywords();

      const compareKeywords = [...testRecipe.keywords, "the world"].map(
        (k) => ({
          keyword: k,
          recipeId: testRecipe.id,
        }),
      );

      expect(getKeywords).toEqual(expect.arrayContaining(compareKeywords));
      expect(getKeywords).toHaveLength(4);
    });

    it("should remove keywords", () => {
      const { recipeDB } = createDependencies();

      recipeDB.insertRecipe({
        recipe: testRecipe,
        keywords: testRecipe.keywords,
      });

      const changes = {
        recipeName: "foo is here",
        area: "The World",
      };

      recipeDB.updateRecipe({
        id: testRecipe.id,
        changes,
        keywordsToAdd: [],
        keywordsToRemove: ["chicken"],
      });

      const getKeywords = recipeDB.findAllKeywords();

      const compareKeywords = [
        { keyword: "filipino", recipeId: testRecipe.id },
        { keyword: "main course", recipeId: testRecipe.id },
      ];

      expect(getKeywords).toEqual(compareKeywords);
    });

    it("should adds and removes keywords in one update", () => {
      const { recipeDB } = createDependencies();

      recipeDB.insertRecipe({
        recipe: testRecipe,
        keywords: testRecipe.keywords,
      });

      const changes = {
        recipeName: "foo is here",
        area: "The World",
      };

      recipeDB.updateRecipe({
        id: testRecipe.id,
        changes,
        keywordsToAdd: ["the world"],
        keywordsToRemove: ["chicken"],
      });

      const getKeywords = recipeDB.findAllKeywords();

      const compareKeywords = [
        { keyword: "filipino", recipeId: testRecipe.id },
        { keyword: "main course", recipeId: testRecipe.id },
        { keyword: "the world", recipeId: testRecipe.id },
      ];

      expect(getKeywords).toEqual(compareKeywords);
    });

    it("should roll back if a keyword operation fails", () => {
      const { recipeDB } = createDependencies();

      recipeDB.insertRecipe({
        recipe: testRecipe,
        keywords: testRecipe.keywords,
      });

      const changes = {
        recipeName: "foo is here",
        area: "The World",
      };

      expect(() =>
        recipeDB.updateRecipe({
          id: testRecipe.id,
          changes,
          keywordsToAdd: ["the world, the world"],
          keywordsToRemove: [],
        }),
      ).toThrow;

      const checkKeyword = recipeDB.findAllKeywords();

      const compareKeywords = testRecipe.keywords.map((k) => ({
        keyword: k,
        recipeId: testRecipe.id,
      }));

      expect(checkKeyword).toHaveLength(3);
      expect(checkKeyword).toEqual(compareKeywords);
    });

    it("should throw an error if it can't find a recipe", () => {
      const { recipeDB } = createDependencies();

      const changes = {
        recipeName: "foo is here",
        area: "The World",
      };

      expect(() =>
        recipeDB.updateRecipe({
          id: testRecipe.id,
          changes,
          keywordsToAdd: [],
          keywordsToRemove: [],
        }),
      ).toThrow(new Error("Recipe not found"));
    });
  });

  describe("findRecipeKeywords", () => {
    const { recipeDB } = createDependencies();

    const testRecipe3 = {
      ...testRecipe,
      id: "test-789",
      slug: "test-me",
      keywords: ["fish", "pork", "vegetables"],
    };

    recipeDB.insertRecipe({
      recipe: testRecipe,
      keywords: testRecipe.keywords,
    });
    recipeDB.insertRecipe({
      recipe: testRecipe3,
      keywords: testRecipe3.keywords,
    });

    const res = recipeDB.findRecipeKeywords(testRecipe.id);
    it("should return keywords from the specified recipe", () => {
      const compare = testRecipe.keywords.map((k) => ({
        keyword: k,
      }));

      expect(res).toEqual(expect.arrayContaining(compare));
      expect(res).toHaveLength(3);
    });

    it("should not return keywords from other recipes", () => {
      expect(res).not.toContainEqual({ keyword: "pork" });
    });
  });

  describe("isKeywordInUse", () => {
    const { recipeDB } = createDependencies();

    recipeDB.insertRecipe({
      recipe: testRecipe,
      keywords: testRecipe.keywords,
    });

    it('should return "true" if at least one recipe uses the specified keyword', () => {
      const res = recipeDB.isKeywordInUse("chicken");

      expect(res).toBe(true);
    });

    it('should return "false" when no recipe uses the specified keyword', () => {
      const res = recipeDB.isKeywordInUse("pork");

      expect(res).toBe(false);
    });
  });

  describe("deleteRecipe", () => {
    const { recipeDB } = createDependencies();

    recipeDB.insertRecipe({
      recipe: testRecipe,
      keywords: testRecipe.keywords,
    });

    it("should delete the recipe", () => {
      recipeDB.deleteRecipe(testRecipe.id);

      const checkRecipeDB = recipeDB.findAllRecipes();

      expect(checkRecipeDB).toHaveLength(0);
    });

    it("check if keywords in recipe_keywords table were deleted", () => {
      const checkKeywordDB = recipeDB.findAllKeywords();

      expect(checkKeywordDB).toHaveLength(0);
    });
  });
});
