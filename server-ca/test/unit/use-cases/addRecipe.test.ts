import { describe, expect, it, vi } from "vitest";

import makeAddRecipe from "../../../src/use-cases/addRecipe.js";

describe("addRecipe use case", () => {
  it("should create and save a recipe", async () => {
    const keywords = ["filipino", "main course", "chicken"];

    const now = new Date()
    now.setSeconds(0,0)

    const recipe = {
      id: "recipe-123",
      recipeName: "Chicken Adobo",
      category: "Main Course",
      area: "Filipino",
      slug: "chicken-adobo",
      instructions: ["Cook the chicken"],
      ingredients: ["1 kg Chicken"],
      ingredientNames: ['Chicken'],
      keywords,
      embedding: [],
      createdAt: now,
      updatedAt: now,
    };

    const embedding = [0.1, 0.2, 0.3];

    const savedRecipe = {
      ...recipe,
      embedding,
    };

    const makeRecipe = vi.fn().mockReturnValue(recipe);

    const buildKeywords = vi.fn().mockReturnValue(keywords);

    const buildRecipeEmbeddingText = vi
      .fn()
      .mockReturnValue("Chicken Adobo Filipino Main Course 1 kg Chicken");

    const generateEmbedding = vi.fn().mockResolvedValue(embedding);

    const insertRecipe = vi.fn().mockReturnValue(savedRecipe);

    const addRecipeToIndex = vi.fn().mockResolvedValue(undefined);

    const addKeywords = vi.fn().mockResolvedValue(undefined);

    const addRecipe = makeAddRecipe({
      makeRecipe,

      recipeDB: {
        insertRecipe,
      },

      generateEmbedding,

      buildKeywords,

      buildRecipeEmbeddingText,

      recipeIndex: {
        addRecipe: addRecipeToIndex,
      },

      keywordsIndex: {
        addKeywords,
      },
    });

    const recipeInfo = {
      recipeName: "Chicken Adobo",
      category: "Main Course",
      area: "Filipino",
      slug: "chicken-adobo",
      instructions: ["Cook the chicken"],
      recipeThumbnail: null,
      ingredients: ["1 kg Chicken"],
      ingredientNames: ["Chicken"],
      keywords: [],
    };

    const result = await addRecipe(recipeInfo);

    // Returns the saved recipe
    expect(result).toBe(savedRecipe);

    // Correct keywords were added to the recipe
    expect(result.keywords).toStrictEqual(keywords);

    // Builds keywords
    expect(buildKeywords).toHaveBeenCalledWith({
      area: "Filipino",
      category: "Main Course",
      ingredients: ["Chicken"],
    });

    // Passes the recipe with generated keywords to the entity
    expect(makeRecipe).toHaveBeenCalledWith({
      data: {...recipeInfo, keywords},
    });

    // Builds embedding text
    expect(buildRecipeEmbeddingText).toHaveBeenCalledWith({
      recipeName: "Chicken Adobo",
      area: "Filipino",
      category: "Main Course",
      ingredients: ["1 kg Chicken"],
      instructions: ["Cook the chicken"],
    });

    // Generates embedding
    expect(generateEmbedding).toHaveBeenCalledWith(
      "Chicken Adobo Filipino Main Course 1 kg Chicken",
    );

    // Saves recipe with generated embedding
    expect(insertRecipe).toHaveBeenCalledWith({
      recipe: {
        ...recipe,
        embedding,
      },
      keywords,
    });

    // Adds recipe to Meilisearch
    expect(addRecipeToIndex).toHaveBeenCalledWith(savedRecipe);

    // Adds keywords to Meilisearch
    expect(addKeywords).toHaveBeenCalledWith(keywords);
  });
});
