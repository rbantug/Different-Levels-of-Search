import { describe, expect, it, vi } from "vitest";

import makeRemoveRecipe from "../../../src/use-cases/removeRecipe.js";

describe("removeRecipe use case", () => {
  const recipe = {
    id: "recipe-123",
    recipeName: "Chicken Adobo",
    category: "Main Course",
    area: "Filipino",
    slug: "chicken-adobo",
    recipeThumbnail: null,
    instructions: ["Cook the chicken"],
    ingredients: ["1 kg Chicken"],
    keywords: ["filipino", "main course", "chicken"],
    embedding: [0.1, 0.2],
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };

  interface CreateDependencies {
    foundRecipe?: typeof recipe | null;
    deletedRecipe?: typeof recipe;
    keywordInUse?: boolean;
  }

  const createDependencies = ({
    foundRecipe = recipe,
    deletedRecipe = recipe,
    keywordInUse = true,
  }: CreateDependencies = {}) => {
    const findRecipeById = vi.fn().mockReturnValue(foundRecipe);

    const deleteRecipe = vi.fn().mockReturnValue(deletedRecipe);

    const isKeywordInUse = vi
      .fn()
      .mockReturnValue(keywordInUse);

    const deleteRecipeFromIndex = vi
      .fn()
      .mockResolvedValue(undefined);

    const deleteKeywords = vi
      .fn()
      .mockResolvedValue(undefined);

    const removeRecipe = makeRemoveRecipe({
      recipeDB: {
        findRecipeById,
        deleteRecipe,
        isKeywordInUse,
      },
      recipeIndex: {
        deleteRecipe: deleteRecipeFromIndex,
      },
      keywordIndex: {
        deleteKeywords,
      },
    });

    return {
      removeRecipe,
      findRecipeById,
      deleteRecipe,
      isKeywordInUse,
      deleteRecipeFromIndex,
      deleteKeywords,
    };
  };

  it("should throw when the recipe does not exist", async () => {
    const dependencies = createDependencies({
      foundRecipe: null,
    });

    await expect(
      dependencies.removeRecipe({
        recipeId: "missing-id",
      }),
    ).rejects.toThrow("The recipe does not exist");

    expect(dependencies.findRecipeById).toHaveBeenCalledWith(
      "missing-id",
    );

    expect(dependencies.deleteRecipe).not.toHaveBeenCalled();
    expect(
      dependencies.deleteRecipeFromIndex,
    ).not.toHaveBeenCalled();
    expect(
      dependencies.isKeywordInUse,
    ).not.toHaveBeenCalled();
    expect(
      dependencies.deleteKeywords,
    ).not.toHaveBeenCalled();
  });

  it("should delete the recipe from the database and Meilisearch", async () => {
    const dependencies = createDependencies();

    const result = await dependencies.removeRecipe({
      recipeId: "recipe-123",
    });

    expect(result).toEqual(recipe);

    expect(dependencies.findRecipeById).toHaveBeenCalledWith(
      "recipe-123",
    );

    expect(dependencies.deleteRecipe).toHaveBeenCalledWith(
      "recipe-123",
    );

    expect(
      dependencies.deleteRecipeFromIndex,
    ).toHaveBeenCalledWith("recipe-123");
  });

  it("should delete orphaned keywords from Meilisearch", async () => {
    const dependencies = createDependencies();

    dependencies.isKeywordInUse.mockImplementation(
      (keyword: string) => keyword === "filipino",
    );

    await dependencies.removeRecipe({
      recipeId: "recipe-123",
    });

    expect(
      dependencies.isKeywordInUse,
    ).toHaveBeenCalledWith("filipino");

    expect(
      dependencies.isKeywordInUse,
    ).toHaveBeenCalledWith("main course");

    expect(
      dependencies.isKeywordInUse,
    ).toHaveBeenCalledWith("chicken");

    expect(
      dependencies.deleteKeywords,
    ).toHaveBeenCalledWith([
      "main course",
      "chicken",
    ]);
  });

  it("should not delete keywords that are still in use", async () => {
    const dependencies = createDependencies({
      keywordInUse: true,
    });

    await dependencies.removeRecipe({
      recipeId: "recipe-123",
    });

    expect(
      dependencies.isKeywordInUse,
    ).toHaveBeenCalledTimes(recipe.keywords.length);

    expect(
      dependencies.deleteKeywords,
    ).not.toHaveBeenCalled();
  });

  it("should not check for keyword usage when the recipe has no keywords", async () => {
    const recipeWithoutKeywords = {
      ...recipe,
      keywords: [],
    };

    const dependencies = createDependencies({
      foundRecipe: recipeWithoutKeywords,
      deletedRecipe: recipeWithoutKeywords,
    });

    await dependencies.removeRecipe({
      recipeId: "recipe-123",
    });

    expect(
      dependencies.isKeywordInUse,
    ).not.toHaveBeenCalled();

    expect(
      dependencies.deleteKeywords,
    ).not.toHaveBeenCalled();
  });
});
;
