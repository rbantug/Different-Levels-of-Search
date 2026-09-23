import request from "supertest";
import { describe, expect, it } from "vitest";

import createApp from "../../../src/app.js";
import { getRequiredParam } from "../../../src/services/express/getQueryOrParam.js";

import type makeDeleteSingleRecipe from "../../../src/controllers/deleteSingleRecipe.js";
import type makeGetAllRecipes from "../../../src/controllers/getAllRecipes.js";
import type makeGetSingleRecipe from "../../../src/controllers/getSingleRecipe.js";
import type makePostSingleRecipe from "../../../src/controllers/postSingleRecipe.js";
import type makeUpdateSingleRecipe from "../../../src/controllers/updateSingleRecipe.js";
import type makeGetHybridRecipe from "../../../src/controllers/getHybridRecipes.js";
import type makeGetKeywordSuggestions from "../../../src/controllers/getKeywordSuggestions.js";
import type makeGetSearchRecipe from "../../../src/controllers/getSearchRecipes.js";
import type makeGetHealth from "../../../src/controllers/getHealth.js"

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

    getHealth: notImplementedController as ReturnType<
      typeof makeGetHealth
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

describe("getRequiredParam", () => {
  it("throws when the parameter is missing", () => {
    expect(() =>
      getRequiredParam({
        name: "id",
        params: {},
      }),
    ).toThrow();
  });
});

describe("GET /api/recipes", () => {
  it("returns all recipes", async () => {
    const getAllRecipes: ReturnType<typeof makeGetAllRecipes> = () => ({
      statusCode: 200,
      body: {
        status: "success",
        data: [recipe],
      },
    });

    const app = createApp({
      ...makeDefaultControllers(),
      getAllRecipes,
    });

    const response = await request(app).get("/api/recipes");

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
    });
  });
});

describe("GET /api/recipes/:id", () => {
  it("should return a single recipe", async () => {
    const getSingleRecipe: ReturnType<typeof makeGetSingleRecipe> = ({
      recipeId,
    }) => {
      return {
        statusCode: 200,
        body: {
          status: "success",
          data: recipe,
        },
      };
    };

    const app = createApp({
      ...makeDefaultControllers(),
      getSingleRecipe,
    });

    const response = await request(app).get("/api/recipes/recipe-1");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      status: "success",
      data: {
        ...recipe,
        createdAt: recipe.createdAt.toISOString(),
        updatedAt: recipe.updatedAt.toISOString(),
      },
    });
  });

  it("should pass the recipe id to the controller", async () => {
    let receivedRecipeId: string | undefined;

    const getSingleRecipe: ReturnType<typeof makeGetSingleRecipe> = ({
      recipeId,
    }) => {
      receivedRecipeId = recipeId;

      return {
        statusCode: 200,
        body: {
          status: "success",
          data: recipe,
        },
      };
    };

    const app = createApp({
      ...makeDefaultControllers(),
      getSingleRecipe,
    });

    await request(app).get("/api/recipes/recipe-1");

    expect(receivedRecipeId).toBe("recipe-1");
    expect(receivedRecipeId).not.toBe("recipe");
  });
});

describe("POST /api/recipes", () => {
  it("passes the request body to the controller and creates a recipe that returns a status code 201", async () => {
    let receivedBody: unknown;

    const postSingleRecipe: ReturnType<typeof makePostSingleRecipe> = async ({
      body,
    }) => {
      receivedBody = body;

      return {
        statusCode: 201,
        body: {
          status: "success",
          data: recipe,
        },
      };
    };

    const app = createApp({
      ...makeDefaultControllers(),
      postSingleRecipe,
    });

    const requestBody = {
      recipeName: "Carbonara",
      category: "Pasta",
      area: "Italian",
      instructions: ["Cook pasta"],
      recipeThumbnail: null,
      ingredients: ["Pasta", "Eggs"],
    };

    const response = await request(app).post("/api/recipes").send(requestBody);

    expect(receivedBody).toEqual(requestBody);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      status: "success",
      data: {
        ...recipe,
        createdAt: recipe.createdAt.toISOString(),
        updatedAt: recipe.updatedAt.toISOString(),
      },
    });
  });
});

describe("PATCH /api/recipes/:id", () => {
  it("passes the recipe id and request body to the controller", async () => {
    let receivedRecipeId: string | undefined;
    let receivedBody: unknown;

    const updateSingleRecipe: ReturnType<
      typeof makeUpdateSingleRecipe
    > = async ({ recipeId, body }) => {
      receivedRecipeId = recipeId;
      receivedBody = body;

      return {
        statusCode: 200,
        body: {
          status: "success",
          data: recipe,
        },
      };
    };

    const app = createApp({
      ...makeDefaultControllers(),
      updateSingleRecipe,
    });

    const requestBody = {
      recipeName: "Updated Carbonara",
      category: "Pasta",
    };

    await request(app).patch("/api/recipes/recipe-1").send(requestBody);

    expect(receivedRecipeId).toBe("recipe-1");
    expect(receivedBody).toEqual(requestBody);
  });

  it("updates a recipe and returns 200", async () => {
    const updatedRecipe = {
      ...recipe,
      recipeName: "Updated Carbonara",
    };

    const updateSingleRecipe: ReturnType<
      typeof makeUpdateSingleRecipe
    > = async () => ({
      statusCode: 200,
      body: {
        status: "success",
        data: updatedRecipe,
      },
    });

    const app = createApp({
      ...makeDefaultControllers(),
      updateSingleRecipe,
    });

    const response = await request(app).patch("/api/recipes/recipe-1").send({
      recipeName: "Updated Carbonara",
    });

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      status: "success",
      data: {
        ...updatedRecipe,
        createdAt: updatedRecipe.createdAt.toISOString(),
        updatedAt: updatedRecipe.updatedAt.toISOString(),
      },
    });
  });
});

describe("DELETE /api/recipes/:id", () => {
  it("passes the recipe id to the controller", async () => {
    let receivedRecipeId: string | undefined;

    const deleteSingleRecipe: ReturnType<
      typeof makeDeleteSingleRecipe
    > = async ({ recipeId }) => {
      receivedRecipeId = recipeId;

      return {
        statusCode: 204,
      };
    };

    const app = createApp({
      ...makeDefaultControllers(),
      deleteSingleRecipe,
    });

    await request(app).delete("/api/recipes/recipe-1");

    expect(receivedRecipeId).toBe("recipe-1");
  });

  it("deletes a recipe and returns 204", async () => {
    const deleteSingleRecipe: ReturnType<
      typeof makeDeleteSingleRecipe
    > = async () => ({
      statusCode: 204,
    });

    const app = createApp({
      ...makeDefaultControllers(),
      deleteSingleRecipe,
    });

    const response = await request(app).delete("/api/recipes/recipe-1");

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });
});