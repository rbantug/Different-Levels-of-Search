import request from "supertest";
import { describe, expect, it } from "vitest";

import createApp from "../../../src/app.js";
import AppError from "../../../src/errors/AppError.js";

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
    deleteSingleRecipe:
      notImplementedController as ReturnType<typeof makeDeleteSingleRecipe>,

    getAllRecipes:
      notImplementedController as ReturnType<typeof makeGetAllRecipes>,

    getSingleRecipe:
      notImplementedController as ReturnType<typeof makeGetSingleRecipe>,

    postSingleRecipe:
      notImplementedController as ReturnType<typeof makePostSingleRecipe>,

    updateSingleRecipe:
      notImplementedController as ReturnType<typeof makeUpdateSingleRecipe>,

    getHybridRecipe:
      notImplementedController as ReturnType<typeof makeGetHybridRecipe>,

    getKeywordSuggestions:
      notImplementedController as ReturnType<typeof makeGetKeywordSuggestions>,

    getSearchRecipes:
      notImplementedController as ReturnType<typeof makeGetSearchRecipe>,
  };
}

describe("API error handling", () => {
  it("returns the controller AppError as an HTTP error response", async () => {
    const getSingleRecipe: ReturnType<
      typeof makeGetSingleRecipe
    > = () => {
      throw new AppError("Recipe not found", 404);
    };

    const app = createApp({
      ...makeDefaultControllers(),
        getSingleRecipe
    });

    const response = await request(app)
      .get("/api/recipes/recipe-1");

    expect(response.status).toBe(404);

    expect(response.body).toMatchObject({
      status: "error",
      message: "Recipe not found",
    });
  });

  it("returns 404 for an unknown route", async () => {
    const app = createApp(makeDefaultControllers());

    const response = await request(app)
      .get("/api/does-not-exist");

    expect(response.status).toBe(404);

    expect(response.body).toMatchObject({
      status: "error",
    });
  });
});
