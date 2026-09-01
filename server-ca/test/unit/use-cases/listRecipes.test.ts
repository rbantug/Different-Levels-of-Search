import { describe, expect, it, vi } from "vitest";

import makeListRecipes from "../../../src/use-cases/listRecipes.js";

describe("listRecipe use-case", () => {
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

  function createDependencies({ rows = [recipeOne, recipeTwo] } = {}) {
    const findAllRecipes = vi.fn().mockReturnValue(rows);

    const listRecipes = makeListRecipes({
      recipeDB: {
        findAllRecipes,
      },
    });

    return {
      listRecipes,
      findAllRecipes,
    };
  }

  it("should list all the recipes", () => {
    const dependencies = createDependencies();

    const result = dependencies.listRecipes();

    expect(dependencies.findAllRecipes).toHaveBeenCalled();

    expect(result).toEqual([recipeOne, recipeTwo]);
  });
});
