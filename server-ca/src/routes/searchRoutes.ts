import { Router } from "express";

import expressCallback from "../services/express/expressCallback.js";

import type makeGetHybridRecipe from "../controllers/getHybridRecipes.js";
import type makeGetKeywordSuggestions from "../controllers/getKeywordSuggestions.js";
import type makeGetSearchRecipe from "../controllers/getSearchRecipes.js";

import { getRequiredQuery } from "../services/express/getQueryOrParam.js";

interface Dependencies {
  getSearchRecipes: ReturnType<typeof makeGetSearchRecipe>;
  getHybridRecipe: ReturnType<typeof makeGetHybridRecipe>;
  getKeywordSuggestions: ReturnType<typeof makeGetKeywordSuggestions>;
}

export default function makeSearchRoutes({
  getSearchRecipes,
  getHybridRecipe,
  getKeywordSuggestions,
}: Dependencies) {
  const router = Router();

  router.route("/").get(
    expressCallback({
      controller: getSearchRecipes,
      mapRequest: (req) => ({
        query: getRequiredQuery({
          query: req.query,
          name: "q",
        }),
        limit: parseInt(
          getRequiredQuery({
            query: req.query,
            name: "limit",
          }),
        ),
      }),
    }),
  );

  router.route("/hybrid").get(
    expressCallback({
      controller: getHybridRecipe,
      mapRequest: (req) => ({
        query: getRequiredQuery({
          query: req.query,
          name: "q",
        }),
        limit: parseInt(
          getRequiredQuery({
            query: req.query,
            name: "limit",
          }),
        ),
      }),
    }),
  );

  router.route("/suggestion").get(
    expressCallback({
      controller: getKeywordSuggestions,
      mapRequest: (req) => ({
        query: getRequiredQuery({
          query: req.query,
          name: "q",
        }),
      }),
    }),
  );

  return router;
}
