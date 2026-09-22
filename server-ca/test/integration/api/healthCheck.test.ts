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
import type makeGetHealth from "../../../src/controllers/getHealth.js";

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

    getHealth: notImplementedController as ReturnType<typeof makeGetHealth>,
  };
}

describe("GET /api/health", () => {
  it("returns a healthy status", async () => {
    const getHealth: ReturnType<typeof makeGetHealth> = () => ({
      statusCode: 200,
      body: {
        status: "ok",
      },
    });

    const app = createApp({
      ...makeDefaultControllers(),
      getHealth,
    });

    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
    });
  });
});
