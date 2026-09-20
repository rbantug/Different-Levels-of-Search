import { describe, expect, it } from "vitest";
import Joi from "joi";
import slugify from "slugify";

import buildMakeRecipe from "../../../src/entities/recipe.js";

const uuid = {
  makeId: () => "test-recipe-id",
};

const recipeEntity = buildMakeRecipe({
  uuid,
  slugify,
  joi: Joi,
});

const testRecipe = {
  recipeName: "Chicken Adobo",
  category: "Main Course",
  area: "Filipino",
  instructions: ["Cook the chicken", "Add soy sauce"],
  recipeThumbnail: "https:meals/04axct1763793018.jpg",
  ingredients: ["1 kg Chicken", "1/2 cup Soy Sauce"],
  keywords: ['filipino', 'main course', 'chicken', 'soy sauce'],
};

describe("recipe entity", () => {
  it("should create a validated recipe", () => {
    const recipe = recipeEntity.makeRecipe({ data: testRecipe });

    const now = new Date()
    now.setSeconds(0,0)

    expect(recipe).toEqual({
      id: "test-recipe-id",
      recipeName: "Chicken Adobo",
      category: "Main Course",
      area: "Filipino",
      slug: "chicken-adobo",
      instructions: ["Cook the chicken", "Add soy sauce"],
      recipeThumbnail: "https:meals/04axct1763793018.jpg",
      ingredients: ["1 kg Chicken", "1/2 cup Soy Sauce"],
      keywords: ["filipino", "main course", "chicken", "soy sauce"],
      embedding: [],
      createdAt: now,
      updatedAt: now,
    });
  });

  it("should return an immutable recipe", () => {
    const recipe = recipeEntity.makeRecipe({
      data: testRecipe,
    });

    expect(Object.isFrozen(recipe)).toBe(true);
  });

  it("should throw when creating an invalid recipe", () => {
    let invalidRecipe = {
      ...testRecipe,
      recipeName: "",
    };

    expect(() =>
      recipeEntity.makeRecipe({
        data: invalidRecipe,
      }),
    ).toThrow();

    invalidRecipe = {
      ...testRecipe,
      category: 1,
    } as any;

    expect(() =>
      recipeEntity.makeRecipe({
        data: invalidRecipe,
      }),
    ).toThrow();
  });

  it("should reject a recipe with a missing required property", () => {
    const { recipeName, ...invalidRecipe } = testRecipe;

    expect(() =>
      recipeEntity.makeRecipe({
        data: invalidRecipe as any,
      }),
    ).toThrow();
  });

  it("should update only the provided fields", () => {
    const oldRecipe = recipeEntity.makeRecipe({
      data: testRecipe,
    });

    const updatedRecipe = recipeEntity.updateRecipe({
      oldRecipe,
      changes: {
        category: "Dinner",
      },
    });

    expect(updatedRecipe.category).toBe("Dinner");

    expect(updatedRecipe.recipeName).toBe(oldRecipe.recipeName);

    expect(updatedRecipe.area).toBe(oldRecipe.area);

    expect(updatedRecipe.slug).toBe(oldRecipe.slug);

    expect(updatedRecipe.id).toBe(oldRecipe.id);
  });

  it("should update the slug when the recipe name changes", () => {
    const oldRecipe = recipeEntity.makeRecipe({
      data: testRecipe,
    });

    const updatedRecipe = recipeEntity.updateRecipe({
      oldRecipe,
      changes: {
        recipeName: "Pork Adobo",
      },
    });

    expect(updatedRecipe.recipeName).toBe("Pork Adobo");

    expect(updatedRecipe.slug).toBe("pork-adobo");
  });

  it("should preserve the slug when the recipe name does not change", () => {
    const oldRecipe = recipeEntity.makeRecipe({
      data: testRecipe,
    });

    const updatedRecipe = recipeEntity.updateRecipe({
      oldRecipe,
      changes: {
        category: "Lunch",
      },
    });

    expect(updatedRecipe.slug).toBe(oldRecipe.slug);
  });
});
