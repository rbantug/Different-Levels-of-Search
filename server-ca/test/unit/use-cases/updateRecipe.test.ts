import { describe, expect, it, vi } from "vitest";

import makeUpdateRecipe from "../../../src/use-cases/updateRecipe.js";

describe("updateRecipe use case", () => {
  const currentRecipe = {
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

  const createDependencies = ({
    recipe = currentRecipe,
    updatedRecipe = currentRecipe,
    keywords = currentRecipe.keywords,
    embedding = [0.5, 0.6],
  } = {}) => {
    const findRecipeById = vi.fn().mockReturnValue(recipe);

    const updateRecipeEntity = vi.fn().mockReturnValue(updatedRecipe);

    const buildKeywords = vi.fn().mockReturnValue(keywords);

    const buildRecipeEmbeddingText = vi.fn().mockReturnValue("embedding text");

    const generateEmbedding = vi.fn().mockResolvedValue(embedding);

    const updateRecipeDB = vi.fn().mockReturnValue({
      ...updatedRecipe,
      embedding,
    });

    const isKeywordInUse = vi.fn();

    const addRecipe = vi.fn().mockResolvedValue(undefined);
    const addKeywords = vi.fn().mockResolvedValue(undefined);
    const deleteKeywords = vi.fn().mockResolvedValue(undefined);

    const updateRecipe = makeUpdateRecipe({
      recipeDB: {
        findRecipeById,
        updateRecipe: updateRecipeDB,
        isKeywordInUse,
      },
      updateRecipeEntity,
      buildKeywords,
      buildRecipeEmbeddingText,
      generateEmbedding,
      recipeIndex: {
        addRecipe,
      },
      keywordIndex: {
        addKeywords,
        deleteKeywords,
      },
    });

    return {
      updateRecipe,
      findRecipeById,
      updateRecipeEntity,
      buildKeywords,
      buildRecipeEmbeddingText,
      generateEmbedding,
      updateRecipeDB,
      isKeywordInUse,
      addRecipe,
      addKeywords,
      deleteKeywords,
    };
  };

  it("should throw when the recipe does not exist", async () => {
    const findRecipeById = vi.fn().mockReturnValue(undefined);
    const updateRecipeEntity = vi.fn();

    const updateRecipe = makeUpdateRecipe({
      recipeDB: {
        findRecipeById,
        updateRecipe: vi.fn(),
        isKeywordInUse: vi.fn(),
      },
      updateRecipeEntity,
      buildKeywords: vi.fn(),
      buildRecipeEmbeddingText: vi.fn(),
      generateEmbedding: vi.fn(),
      recipeIndex: {
        addRecipe: vi.fn(),
      },
      keywordIndex: {
        addKeywords: vi.fn(),
        deleteKeywords: vi.fn(),
      },
    });

    await expect(
      updateRecipe({
        id: "missing-id",
        changes: {},
      }),
    ).rejects.toThrow("Recipe not found");

    expect(updateRecipeEntity).not.toHaveBeenCalled();
  });

  it("should update a recipe without rebuilding keywords when keyword-related fields are unchanged", async () => {
    const changes = {
      recipeName: "Spicy Chicken Adobo",
    };

    const updatedRecipe = {
      ...currentRecipe,
      recipeName: "Spicy Chicken Adobo",
      slug: "spicy-chicken-adobo",
    };

    const dependencies = createDependencies({
      updatedRecipe,
    });

    const result = await dependencies.updateRecipe({
      id: "recipe-123",
      changes,
    });

    expect(result).toEqual({
      ...updatedRecipe,
      embedding: [0.5, 0.6],
    });

    expect(dependencies.findRecipeById).toHaveBeenCalledWith("recipe-123");

    expect(dependencies.updateRecipeEntity).toHaveBeenCalledWith({
      oldRecipe: currentRecipe,
      changes,
    });

    expect(dependencies.buildKeywords).not.toHaveBeenCalled();

    expect(dependencies.updateRecipeDB).toHaveBeenCalledWith({
      id: "recipe-123",
      changes: {
        ...updatedRecipe,
        embedding: [0.5, 0.6],
      },
      keywordsToAdd: [],
      keywordsToRemove: [],
    });

    expect(dependencies.addRecipe).toHaveBeenCalledWith({
      ...updatedRecipe,
      embedding: [0.5, 0.6],
    });

    expect(dependencies.addKeywords).not.toHaveBeenCalled();
    expect(dependencies.isKeywordInUse).not.toHaveBeenCalled();
    expect(dependencies.deleteKeywords).not.toHaveBeenCalled();
  });

  it("should rebuild keywords when area, category, or ingredientNames changes", async () => {
    const changes = {
      area: "Japanese",
      ingredientNames: ["Chicken", "Soy Sauce"],
    };

    const updatedRecipe = {
      ...currentRecipe,
      area: "Japanese",
    };

    const newKeywords = ["japanese", "main course", "chicken", "soy sauce"];

    const dependencies = createDependencies({
      updatedRecipe,
      keywords: newKeywords,
    });

    await dependencies.updateRecipe({
      id: "recipe-123",
      changes,
    });

    expect(dependencies.buildKeywords).toHaveBeenCalledWith({
      area: "Japanese",
      category: "Main Course",
      ingredients: ["Chicken", "Soy Sauce"],
    });
  });

  it("should use an empty array when ingredientNames is not provided", async () => {
    const changes = {
      area: "Japanese",
    };

    const updatedRecipe = {
      ...currentRecipe,
      area: "Japanese",
    };

    const dependencies = createDependencies({
      updatedRecipe,
      keywords: ["japanese", "main course"],
    });

    await dependencies.updateRecipe({
      id: "recipe-123",
      changes,
    });

    expect(dependencies.buildKeywords).toHaveBeenCalledWith({
      area: "Japanese",
      category: "Main Course",
      ingredients: [],
    });
  });

  it("should add newly generated keywords", async () => {
    const changes = {
      ingredientNames: ["Chicken", "Chili"],
    };

    const updatedRecipe = {
      ...currentRecipe,
      ingredients: ["1 kg Chicken", "2 Chili"],
    };

    const newKeywords = ["filipino", "main course", "chicken", "chili"];

    const dependencies = createDependencies({
      updatedRecipe,
      keywords: newKeywords,
    });

    await dependencies.updateRecipe({
      id: "recipe-123",
      changes,
    });

    expect(dependencies.updateRecipeDB).toHaveBeenCalledWith({
      id: "recipe-123",
      changes: {
        ...updatedRecipe,
        embedding: [0.5, 0.6],
      },
      keywordsToAdd: ["chili"],
      keywordsToRemove: [],
    });

    expect(dependencies.addKeywords).toHaveBeenCalledWith(["chili"]);
  });

  it("should remove keywords that are no longer used", async () => {
    const changes = {
      category: "Dessert",
    };

    const updatedRecipe = {
      ...currentRecipe,
      category: "Dessert",
    };

    const newKeywords = ["filipino", "dessert", "chicken"];

    const dependencies = createDependencies({
      updatedRecipe,
      keywords: newKeywords,
    });

    dependencies.isKeywordInUse.mockReturnValue(false);

    await dependencies.updateRecipe({
      id: "recipe-123",
      changes,
    });

    expect(dependencies.updateRecipeDB).toHaveBeenCalledWith({
      id: "recipe-123",
      changes: {
        ...updatedRecipe,
        embedding: [0.5, 0.6],
      },
      keywordsToAdd: ["dessert"],
      keywordsToRemove: ["main course"],
    });

    expect(dependencies.isKeywordInUse).toHaveBeenCalledWith("main course");

    expect(dependencies.deleteKeywords).toHaveBeenCalledWith(["main course"]);
  });

  it("should not delete a keyword that is still in use", async () => {
    const changes = {
      category: "Dessert",
    };

    const updatedRecipe = {
      ...currentRecipe,
      category: "Dessert",
    };

    const newKeywords = ["filipino", "dessert", "chicken"];

    const dependencies = createDependencies({
      updatedRecipe,
      keywords: newKeywords,
    });

    dependencies.isKeywordInUse.mockReturnValue(true);

    await dependencies.updateRecipe({
      id: "recipe-123",
      changes,
    });

    expect(dependencies.isKeywordInUse).toHaveBeenCalledWith("main course");

    expect(dependencies.deleteKeywords).not.toHaveBeenCalled();
  });
});
