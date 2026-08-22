import { Router } from "express";

import expressCallback from "../services/express/expressCallback.js";
import {
  deleteSingleRecipe,
  getAllRecipes,
  getSingleRecipe,
  postSingleRecipe,
  updateSingleRecipe,
} from "../controllers/index.js";

import { getRequiredParam } from "../services/express/getQueryOrParam.js";

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
  .route(":/id")
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

export default router;
