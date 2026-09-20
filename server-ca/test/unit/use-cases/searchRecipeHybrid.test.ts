import { describe, expect, it, vi } from "vitest";

import makeSearchRecipeHybrid from "../../../src/use-cases/searchRecipesHybrid.js";

describe("searchRecipeHybrid use case", () => {
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

  const defaultMeiliResults = {
    hits: [
      {
        id: "recipe-1",
        _rankingScore: 0.8,
      },
      {
        id: "recipe-2",
        _rankingScore: 0.6,
      },
    ],
  };

  const createDependencies = ({
    meiliResults = defaultMeiliResults,
    recipes = [recipeOne, recipeTwo],
    queryEmbedding = [0.5, 0.6],
  } = {}) => {
    const searchRecipe = vi.fn().mockResolvedValue(meiliResults);

    const findRecipesById = vi.fn().mockReturnValue(recipes);

    const generateEmbedding = vi.fn().mockResolvedValue(queryEmbedding);

    const cosineSimilarity = vi.fn();

    const searchRecipeHybrid = makeSearchRecipeHybrid({
      recipeDB: {
        findRecipesById,
      } as any,
      recipeIndex: {
        searchRecipe,
      },
      generateEmbedding,
      cosineSimilarity,
    });

    return {
      searchRecipeHybrid,
      searchRecipe,
      findRecipesById,
      generateEmbedding,
      cosineSimilarity,
    };
  };

  it("should search Meilisearch using the provided query", async () => {
    const dependencies = createDependencies();

    await dependencies.searchRecipeHybrid({
      query: "chicken",
    });

    expect(dependencies.searchRecipe).toHaveBeenCalledWith({
      query: "chicken",
      limit: 100,
    });
  });

  it("should use the provided limit", async () => {
    const dependencies = createDependencies();

    await dependencies.searchRecipeHybrid({
      query: "chicken",
      limit: 10,
    });

    expect(dependencies.searchRecipe).toHaveBeenCalledWith({
      query: "chicken",
      limit: 10,
    });
  });

  it("should return an empty array when Meilisearch finds no recipes", async () => {
    const dependencies = createDependencies({
      meiliResults: {
        hits: [],
      },
    });

    const result = await dependencies.searchRecipeHybrid({
      query: "chicken",
    });

    expect(result).toEqual([]);

    expect(dependencies.generateEmbedding).not.toHaveBeenCalled();

    expect(dependencies.findRecipesById).not.toHaveBeenCalled();

    expect(dependencies.cosineSimilarity).not.toHaveBeenCalled();
  });

  it("should generate an embedding for the query", async () => {
    const dependencies = createDependencies();

    await dependencies.searchRecipeHybrid({
      query: "chicken",
    });

    expect(dependencies.generateEmbedding).toHaveBeenCalledWith("chicken");
  });

  it("should fetch recipes from the database using Meilisearch recipe IDs", async () => {
    const dependencies = createDependencies();

    await dependencies.searchRecipeHybrid({
      query: "chicken",
    });

    expect(dependencies.findRecipesById).toHaveBeenCalledWith([
      "recipe-1",
      "recipe-2",
    ]);
  });

  it("should calculate hybrid scores", async () => {
    const dependencies = createDependencies();

    dependencies.cosineSimilarity
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0.5);

    const result = await dependencies.searchRecipeHybrid({
      query: "chicken",
    });

    expect(dependencies.cosineSimilarity).toHaveBeenCalledWith(
      [0.5, 0.6],
      recipeOne.embedding,
    );

    expect(dependencies.cosineSimilarity).toHaveBeenCalledWith(
      [0.5, 0.6],
      recipeTwo.embedding,
    );

    expect(result).toEqual([
      {
        ...recipeOne,
        keywordScore: 0.8,
        semanticScore: 0.9,
        finalScore: 0.83,
      },
      {
        ...recipeTwo,
        keywordScore: 0.6,
        semanticScore: 0.5,
        finalScore: 0.57,
      },
    ]);
  });

  it("should use zero when a Meilisearch ranking score is missing", async () => {
    const dependencies = createDependencies({
      meiliResults: {
        hits: [
          {
            id: "recipe-1",
          },
        ] as any, // to stop typescript from complaining
      },
      recipes: [recipeOne],
    });

    dependencies.cosineSimilarity.mockReturnValue(0.5);

    const result = await dependencies.searchRecipeHybrid({
      query: "chicken",
    });

    expect(result[0]).toMatchObject({
      id: "recipe-1",
      keywordScore: 0,
      semanticScore: 0.5,
      finalScore: 0.15,
    });
  });

  // Not necessary since all recipes will be added to the database with an embedding. I'll keep it anyway.
  it("should use zero semantic score when a recipe has no embedding", async () => {
    const recipeWithoutEmbedding = {
      ...recipeOne,
      embedding: [],
    };

    const dependencies = createDependencies({
      meiliResults: {
        hits: [
          {
            id: "recipe-1",
            _rankingScore: 0.8,
          },
        ],
      },
      recipes: [recipeWithoutEmbedding],
    });

    const result = await dependencies.searchRecipeHybrid({
      query: "chicken",
    });

    expect(dependencies.cosineSimilarity).not.toHaveBeenCalled();

    expect(result[0]).toMatchObject({
      keywordScore: 0.8,
      semanticScore: 0,
      finalScore: 0.56,
    });
  });

  it("should sort recipes by final score in descending order", async () => {
    const dependencies = createDependencies();

    dependencies.cosineSimilarity
      .mockReturnValueOnce(0.2)
      .mockReturnValueOnce(0.9);

    const result = await dependencies.searchRecipeHybrid({
      query: "chicken",
    });

    expect(result.map((recipe:any) => recipe.id)).toEqual(["recipe-2", "recipe-1"]);
  });
});
