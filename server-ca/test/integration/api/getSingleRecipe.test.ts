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
  it("should pass the slug to the use-case", () => {
    let receivedSlug: string | undefined;

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

    const findRecipeBySlug = ({ slug }: { slug: string }) => {
      receivedSlug = slug;
      return recipe;
    };

    const getSingleRecipe = makeGetSingleRecipe({
      findRecipeBySlug,
    });

    getSingleRecipe({
      slug: "recipe-1",
    });

    expect(receivedSlug).toBe("recipe-1");
  });

  it("should return the recipe in an HTTP response", () => {
    const findRecipeBySlug = () => recipe;

    const getSingleRecipe = makeGetSingleRecipe({
      findRecipeBySlug,
    });

    const result = getSingleRecipe({
      slug: "carbonara",
    });

    expect(result).toEqual({
      statusCode: 200,
      body: {
        status: "success",
        data: recipe,
      },
    });
  });

  it("should throw an error if the slug was not provided", () => {
    const findRecipeBySlug = () => recipe;

    const getSingleRecipe = makeGetSingleRecipe({
      findRecipeBySlug,
    });

    expect(() =>
      getSingleRecipe({
        slug: "",
      }),
    ).toThrow();
  });
});
