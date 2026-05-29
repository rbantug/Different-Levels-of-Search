import { db } from "../db/index.js";
import { recipes } from "../db/schema.js";
import { eq } from "drizzle-orm";

import type { Request, Response, NextFunction } from "express";

import catchAsyncError from "../../utils/catchAsyncError.js";
import AppError from "../../utils/appError.js";
import {
  validateCreateRecipe,
  validateUpdateRecipe,
} from "../joiValidation.js";
import { indexRecipe } from "../search/indexRecipe.js";
import { deleteRecipeIndex } from "../search/deleteRecipe.js";

export const getAllRecipes = catchAsyncError(
  async (_: Request, res: Response) => {
    const data = await db.select().from(recipes);

    res.status(200).json({
      status: "success",
      data,
    });
  },
);

export const getSingleRecipe = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    if (!id || typeof id === "object") {
      return next(new AppError("A recipe id is required", 404));
    }

    const recipe = await db.select().from(recipes).where(eq(recipes.id, id));

    if (!recipe.length) {
      return next(new AppError("Recipe not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: recipe[0],
    });
  },
);

export const postSingleRecipe = catchAsyncError(
  async (req: Request, res: Response) => {
    const {
      recipeName,
      category,
      area,
      instructions,
      recipeThumbnail,
      ingredients,
    } = req.body;

    const validateBody = validateCreateRecipe({
      recipeName,
      category,
      area,
      instructions,
      recipeThumbnail,
      ingredients,
    });

    const insertedId = await db
      .insert(recipes)
      .values(validateBody)
      .returning({ insertedId: recipes.id });

    await indexRecipe({
      id: validateBody.id,
      recipeName: validateBody.recipeName,
      area: validateBody.area,
      category: validateBody.category,
      ingredients: validateBody.ingredients,
    });

    res.status(200).json({
      status: "success",
      data: insertedId,
    });
  },
);

export const updateSingleRecipe = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    if (!id || typeof id === "object") {
      return next(new AppError("A recipe id is required", 404));
    }

    const recipe = await db.select().from(recipes).where(eq(recipes.id, id));

    if (!recipe.length) {
      return next(new AppError("Recipe not found", 404));
    }

    const validateBody = validateUpdateRecipe({ ...recipe[0], ...req.body });

    const updatedRecipe = {
      ...validateBody,
      createdAt: recipe[0]?.createdAt,
      updatedAt: new Date(),
    };

    const result = await db
      .update(recipes)
      .set(updatedRecipe)
      .where(eq(recipes.id, id));

    await indexRecipe(updatedRecipe);

    res.status(200).json({
      status: "success",
      result,
    });
  },
);

export const deleteSingleRecipe = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    if (!id || typeof id === "object") {
      return next(new AppError("A recipe id is required", 404));
    }

    const result = await db.delete(recipes).where(eq(recipes.id, id));

    await deleteRecipeIndex(id);

    res.status(200).json({
      status: "success",
      result,
    });
  },
);
