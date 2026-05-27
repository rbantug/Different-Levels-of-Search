import { Router } from "express";

import {
  deleteSingleRecipe,
  getAllRecipes,
  getSingleRecipe,
  postSingleRecipe,
  updateSingleRecipe,
} from "../controllers/recipeController.js";

const router = Router();

router.route("/").get(getAllRecipes).post(postSingleRecipe);

router
  .route("/:id")
  .get(getSingleRecipe)
  .patch(updateSingleRecipe)
  .delete(deleteSingleRecipe);

export default router;
