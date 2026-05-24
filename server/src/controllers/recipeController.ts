import { db } from "../db/index.js";
import { recipes } from "../db/schema.js";
import { eq } from "drizzle-orm";

import type { Request, Response, NextFunction } from "express";

import catchAsyncError from "../../utils/catchAsyncError.js";
import AppError from "../../utils/appError.js";

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
    const id  = req.params.id

    if (!id || typeof id === 'object') {
        return next(new AppError('A recipe id is required', 404))
    }

    const recipe = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, id));

    if (!recipe.length) {
        return next(new AppError('Recipe not found', 404))
    }

    res.status(200).json({
      status: "success",
      data: recipe[0],
    });
  },
);
