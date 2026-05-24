import { Router } from "express";

import { getAllRecipes, getSingleRecipe } from "../controllers/recipeController.js";

const router = Router()

router
    .route('/')
    .get(getAllRecipes)

router
    .route('/:id')
    .get(getSingleRecipe)


export default router