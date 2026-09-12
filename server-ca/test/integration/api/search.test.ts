import request from "supertest";
import { describe, expect, it } from "vitest";

import createApp from "../../../src/app.js";

import type makeDeleteSingleRecipe from "../../../src/controllers/deleteSingleRecipe.js";
import type makeGetAllRecipes from "../../../src/controllers/getAllRecipes.js";
import type makeGetSingleRecipe from "../../../src/controllers/getSingleRecipe.js";
import type makePostSingleRecipe from "../../../src/controllers/postSingleRecipe.js";
import type makeUpdateSingleRecipe from "../../../src/controllers/updateSingleRecipe.js";
import type makeGetHybridRecipe from "../../../src/controllers/getHybridRecipes.js";
import type makeGetKeywordSuggestions from "../../../src/controllers/getKeywordSuggestions.js";
import type makeGetSearchRecipe from "../../../src/controllers/getSearchRecipes.js";

function notImplementedController(): never {
  throw new Error("This controller should not be called in this test");
}

function makeDefaultControllers() {
  return {
    deleteSingleRecipe: notImplementedController as ReturnType<
      typeof makeDeleteSingleRecipe
    >,

    getAllRecipes: notImplementedController as ReturnType<
      typeof makeGetAllRecipes
    >,

    getSingleRecipe: notImplementedController as ReturnType<
      typeof makeGetSingleRecipe
    >,

    postSingleRecipe: notImplementedController as ReturnType<
      typeof makePostSingleRecipe
    >,

    updateSingleRecipe: notImplementedController as ReturnType<
      typeof makeUpdateSingleRecipe
    >,

    getHybridRecipe: notImplementedController as ReturnType<
      typeof makeGetHybridRecipe
    >,

    getKeywordSuggestions: notImplementedController as ReturnType<
      typeof makeGetKeywordSuggestions
    >,

    getSearchRecipes: notImplementedController as ReturnType<
      typeof makeGetSearchRecipe
    >,
  };
}

const now = new Date();
now.setSeconds(0, 0);

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
  createdAt: now,
  updatedAt: now,
};

describe("GET /api/search", () => {
  it("passes the search parameters to the controller", async () => {
    let receivedInput: unknown;

    const getSearchRecipes: ReturnType<typeof makeGetSearchRecipe> = async (
      input,
    ) => {
      receivedInput = input;

      return {
        statusCode: 200,
        body: {
          status: "success",
          data: [],
          query: "hey",
          count: 0,
        },
      };
    };

    const app = createApp({
      ...makeDefaultControllers(),
      getSearchRecipes,
    });

    await request(app).get("/api/search").query({
      q: "pasta",
      limit: "10",
    });

    expect(receivedInput).toEqual({
      query: "pasta",
      limit: 10,
    });
  });

  it("returns search results", async () => {
    const getSearchRecipes: ReturnType<
      typeof makeGetSearchRecipe
    > = async () => ({
      statusCode: 200,
      body: {
        status: "success",
        data: [recipe],
        count: 1,
        query: "pasta",
      },
    });

    const app = createApp({
      ...makeDefaultControllers(),
      getSearchRecipes,
    });

    const response = await request(app).get("/api/search/").query({
      q: "pasta",
      limit: 10,
    });

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      status: "success",
      data: [
        {
          ...recipe,
          createdAt: recipe.createdAt.toISOString(),
          updatedAt: recipe.updatedAt.toISOString(),
        },
      ],
      count: 1,
      query: "pasta",
    });
  });
});

describe("GET /api/search/hybrid", () => {
  it("passes the search parameters to the controller", async () => {
    let receivedInput: unknown;

    const getHybridRecipe: ReturnType<typeof makeGetHybridRecipe> = async (
      input,
    ) => {
      receivedInput = input;

      return {
        statusCode: 200,
        body: {
          status: "success",
          data: [],
          count: 0,
          query: "hey",
        },
      };
    };

    const app = createApp({
      ...makeDefaultControllers(),
      getHybridRecipe,
    });

    await request(app).get("/api/search/hybrid").query({
      q: "creamy pasta",
      limit: "5",
    });

    expect(receivedInput).toEqual({
      query: "creamy pasta",
      limit: 5,
    });
  });

  it("returns hybrid search results", async () => {
    const hybridRecipe = {
      ...recipe,
      keywordScore: 0,
      semanticScore: 0,
      finalScore: 0,
    };

    const getHybridRecipe: ReturnType<
      typeof makeGetHybridRecipe
    > = async () => ({
      statusCode: 200,
      body: {
        status: "success",
        data: [hybridRecipe],
        count: 1,
        query: "creamy pasta",
      },
    });

    const app = createApp({
      ...makeDefaultControllers(),
      getHybridRecipe,
    });

    const response = await request(app).get("/api/search/hybrid").query({
      q: "creamy pasta",
      limit: 10,
    });

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      status: "success",
      data: [
        {
          ...hybridRecipe,
          createdAt: hybridRecipe.createdAt.toISOString(),
          updatedAt: hybridRecipe.updatedAt.toISOString(),
        },
      ],
      count: 1,
      query: "creamy pasta"
    });
  });
});

describe("GET /api/search/suggestion", () => {
  it("passes the search query to the controller", async () => {
    let receivedInput: unknown;

    const getKeywordSuggestions: ReturnType<
      typeof makeGetKeywordSuggestions
    > = async (input) => {
      receivedInput = input;

      return {
        statusCode: 200,
        body: {
          status: "success",
          data: [],
          query: 'bob',
          count: 0
        },
      };
    };

    const app = createApp({
      ...makeDefaultControllers(),
      getKeywordSuggestions,
    });

    await request(app).get("/api/search/suggestion").query({
      q: "pas",
    });

    expect(receivedInput).toEqual({
      query: "pas",
    });
  });

  it("returns keyword suggestions", async () => {
    const getKeywordSuggestions: ReturnType<
      typeof makeGetKeywordSuggestions
    > = async () => ({
      statusCode: 200,
      body: {
        status: "success",
        data: [
          { id: "1", keyword: "pasta" },
          { id: "1", keyword: "pastrami" },
        ],
        query: "pas",
        count: 1,
      },
    });

    const app = createApp({
      ...makeDefaultControllers(),
      getKeywordSuggestions,
    });

    const response = await request(app).get("/api/search/suggestion").query({
      q: "pas",
    });

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      status: "success",
      data: [
        { id: "1", keyword: "pasta" },
        { id: "1", keyword: "pastrami" },
      ],
      query: "pas",
      count: 1,
    });
  });
});
