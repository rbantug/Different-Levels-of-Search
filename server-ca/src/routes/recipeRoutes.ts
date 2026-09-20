import { Router } from "express";

import expressCallback from "../services/express/expressCallback.js";

import type makeDeleteSingleRecipe from "../controllers/deleteSingleRecipe.js";
import type makeGetAllRecipes from "../controllers/getAllRecipes.js";
import makeGetSingleRecipe from "../controllers/getSingleRecipe.js";
import type makePostSingleRecipe from "../controllers/postSingleRecipe.js";
import type makeUpdateSingleRecipe from "../controllers/updateSingleRecipe.js";

import { getRequiredParam } from "../services/express/getQueryOrParam.js";

interface Dependencies {
  deleteSingleRecipe: ReturnType<typeof makeDeleteSingleRecipe>;
  getAllRecipes: ReturnType<typeof makeGetAllRecipes>;
  getSingleRecipe: ReturnType<typeof makeGetSingleRecipe>;
  postSingleRecipe: ReturnType<typeof makePostSingleRecipe>;
  updateSingleRecipe: ReturnType<typeof makeUpdateSingleRecipe>;
}

export default function makeRecipeRoutes({
  deleteSingleRecipe,
  getAllRecipes,
  getSingleRecipe,
  postSingleRecipe,
  updateSingleRecipe,
}: Dependencies) {
  const router = Router();

  router
    .route("/")
    .get(
      expressCallback({
        controller: getAllRecipes,
        mapRequest: () => ({}),
      }),
    )
    .post(
      expressCallback({
        controller: postSingleRecipe,
        mapRequest: (req) => ({
          body: req.body,
        }),
      }),
    );

  router
    .route("/:id")
    .get(
      expressCallback({
        controller: getSingleRecipe,
        mapRequest: (req) => ({
          recipeId: getRequiredParam({ name: "id", params: req.params }),
        }),
      }),
    )
    .delete(
      expressCallback({
        controller: deleteSingleRecipe,
        mapRequest: (req) => ({
          recipeId: getRequiredParam({ name: "id", params: req.params }),
        }),
      }),
    )
    .patch(
      expressCallback({
        controller: updateSingleRecipe,
        mapRequest: (req) => ({
          recipeId: getRequiredParam({ name: "id", params: req.params }),
          body: req.body,
        }),
      }),
    );

  return router;
}
