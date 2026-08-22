import { Router } from "express";

import expressCallback from "../services/express/expressCallback.js";

import {
  getSearchRecipes,
  getHybridRecipe,
  getKeywordSuggestions,
} from "../controllers/index.js";

import { getRequiredQuery } from "../services/express/getQueryOrParam.js";

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

export default router;
