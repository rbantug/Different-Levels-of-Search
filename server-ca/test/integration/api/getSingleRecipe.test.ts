import { describe, expect, it } from "vitest";

import makeGetSingleRecipe from "../../../src/controllers/getSingleRecipe.js";

const recipe = {
  id: "recipe-1",
  recipeName: "Carbonara",
  category: "Pasta",
  area: "Italian",
  slug: "carbonara",
  instructions: ["Cook pasta"],
  recipeThumbnail: null,
  ingredients: ["Pasta", "Eggs"],
  keywords: ["pasta"],
  embedding: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("getSingleRecipe controller", () => {
  it("should pass the recipe id to the use-case", () => {
    let receivedRecipeId: string | undefined;

    const recipe = {
      id: "recipe-1",
      recipeName: "Carbonara",
      category: "Pasta",
      area: "Italian",
      slug: "carbonara",
      instructions: ["Cook pasta"],
      recipeThumbnail: null,
      ingredients: ["Pasta", "Eggs"],
      keywords: ["pasta"],
      embedding: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const findRecipeById = ({ recipeId }: { recipeId: string }) => {
      receivedRecipeId = recipeId;
      return recipe;
    };

    const getSingleRecipe = makeGetSingleRecipe({
      findRecipeById,
    });

    getSingleRecipe({
      recipeId: "recipe-1",
    });

    expect(receivedRecipeId).toBe("recipe-1");
  });

  it("should return the recipe in an HTTP response", () => {
    const findRecipeById = () => recipe;

    const getSingleRecipe = makeGetSingleRecipe({
      findRecipeById,
    });

    const result = getSingleRecipe({
      recipeId: "recipe-1",
    });

    expect(result).toEqual({
      statusCode: 200,
      body: {
        status: "success",
        data: recipe,
      },
    });
  });

  it("should throw an error if the recipe id was not provided", () => {
    const findRecipeById = () => recipe;

    const getSingleRecipe = makeGetSingleRecipe({
      findRecipeById,
    });

    expect(() =>
      getSingleRecipe({
        recipeId: "",
      }),
    ).toThrow();
  });
});
