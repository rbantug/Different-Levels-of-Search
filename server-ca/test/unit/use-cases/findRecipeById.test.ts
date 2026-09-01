import { describe, expect, it, vi } from "vitest";

import makeFindRecipeById from "../../../src/use-cases/findRecipeById.js";

describe("findRecipeById use case", () => {
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

  interface CreateDependencies {
    foundRecipe?: typeof recipeOne | null;
  }

  function createDependencies({
    foundRecipe = recipeOne,
  }: CreateDependencies = {}) {
    const dbFindRecipeById = vi.fn().mockReturnValue(foundRecipe);

    const usecaseFindRecipeById = makeFindRecipeById({
      recipeDB: {
        findRecipeById: dbFindRecipeById,
      },
    });

    return {
      dbFindRecipeById,
      usecaseFindRecipeById,
    };
  }

  it("should return an error if the recipe does not exist", () => {
    const dependencies = createDependencies({ foundRecipe: null });

    expect(() =>
      dependencies.usecaseFindRecipeById({ recipeId: "no-id" }),
    ).toThrow("The recipe does not exist");
  });

  it("should return the recipe", () => {
    const dependencies = createDependencies();

    const result = dependencies.usecaseFindRecipeById({ recipeId: 'recipe-1' })

    expect(result).toEqual(recipeOne)
  });
});
