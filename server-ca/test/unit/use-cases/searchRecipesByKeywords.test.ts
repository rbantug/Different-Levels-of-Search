import { describe, expect, it, vi } from "vitest";

import makeSearchRecipesByKeyword from "../../../src/use-cases/searchRecipesByKeyword.js";

describe("searchRecipesByKeyword use case", () => {
  const recipeOne = {
    id: "recipe-1",
    recipeName: "Chicken Adobo",
    category: "Main Course",
    area: "Filipino",
    slug: "chicken-adobo",
    recipeThumbnail: null,
    instructions: ["Cook chicken"],
    ingredients: ["Chicken"],
    keywords: ["filipino", "chicken"],
    embedding: [0.1, 0.2],
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };

  const recipeTwo = {
    id: "recipe-2",
    recipeName: "Beef Curry",
    category: "Main Course",
    area: "Indian",
    slug: "beef-curry",
    recipeThumbnail: null,
    instructions: ["Cook beef"],
    ingredients: ["Beef"],
    keywords: ["indian", "beef"],
    embedding: [0.3, 0.4],
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };

  const createDependencies = ({
    hits = [
      { id: "recipe-1" },
      { id: "recipe-2" },
    ],
    rows = [recipeOne, recipeTwo],
  } = {}) => {
    const searchRecipe = vi.fn().mockResolvedValue({
      hits,
    });

    const findRecipesById = vi
      .fn()
      .mockReturnValue(rows);

    const searchRecipesByKeyword =
      makeSearchRecipesByKeyword({
        recipeIndex: {
          searchRecipe,
        },
        recipeDB: {
          findRecipesById,
        },
      });

    return {
      searchRecipesByKeyword,
      searchRecipe,
      findRecipesById,
    };
  };

  it("should search Meilisearch using the provided query and limit", async () => {
    const dependencies = createDependencies();

    await dependencies.searchRecipesByKeyword({
      query: "chicken",
      limit: 10,
    });

    expect(
      dependencies.searchRecipe,
    ).toHaveBeenCalledWith({
      query: "chicken",
      limit: 10,
    });
  });

  it("should fetch recipes from the database using the Meilisearch IDs", async () => {
    const dependencies = createDependencies();

    await dependencies.searchRecipesByKeyword({
      query: "chicken",
    });

    expect(
      dependencies.findRecipesById,
    ).toHaveBeenCalledWith([
      "recipe-1",
      "recipe-2",
    ]);
  });

  it("should preserve the ranking order from Meilisearch", async () => {
    const dependencies = createDependencies({
      hits: [
        { id: "recipe-2" },
        { id: "recipe-1" },
      ],
      rows: [
        recipeOne,
        recipeTwo,
      ],
    });

    const result =
      await dependencies.searchRecipesByKeyword({
        query: "chicken",
      });

    expect(result).toEqual([
      recipeTwo,
      recipeOne,
    ]);
  });

  it("should exclude recipes that are missing from the database", async () => {
    const dependencies = createDependencies({
      hits: [
        { id: "recipe-1" },
        { id: "recipe-2" },
      ],
      rows: [recipeOne],
    });

    const result =
      await dependencies.searchRecipesByKeyword({
        query: "chicken",
      });

    expect(result).toEqual([recipeOne]);
  });

  it("should return an empty array when Meilisearch returns no hits", async () => {
    const dependencies = createDependencies({
      hits: [],
      rows: [],
    });

    const result =
      await dependencies.searchRecipesByKeyword({
        query: "pizza",
      });

    expect(result).toEqual([]);

    expect(dependencies.findRecipesById).not.toHaveBeenCalled()
  });
});
