import { db } from "../db/index.js";
import { recipes } from "../db/schema.js";
import { eq } from "drizzle-orm";
import slugify from "slugify";

import type { Request, Response, NextFunction } from "express";

import catchAsyncError from "../../utils/catchAsyncError.js";
import AppError from "../../utils/appError.js";
import {
  validateCreateRecipe,
  validateUpdateRecipe,
} from "../joiValidation.js";
import { indexRecipe } from "../search/indexRecipe.js";
import { deleteRecipeIndex } from "../search/deleteRecipe.js";
import { generateEmbedding } from "../embeddings/generateEmbedding.js";
import { buildRecipeEmbeddingText } from "../embeddings/buildRecipeEmbeddingText.js";
import { buildKeywords } from "../search/buildKeywords.js";
import { normalizeKeyword } from "../search/normalizeKeywords.js";
import { keywordIndex, meili } from "../search/meilisearch.js";
import { waitForTask } from "../search/waitForTask.js";

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
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      recipeName,
      category,
      area,
      instructions,
      recipeThumbnail,
      ingredients,
      ingredientNames = [],
    } = req.body;

    if (
      ingredientNames.length > 0 &&
      ingredients.length !== ingredientNames.length
    ) {
      return next(
        new AppError("ingredients and ingredientNames are not the same", 400),
      );
    }

    const createSlug = slugify(recipeName);

    const validateBody = validateCreateRecipe({
      recipeName,
      category,
      area,
      slug: createSlug,
      instructions,
      recipeThumbnail,
      ingredients,
      ingredientNames,
    });

    const keywords = buildKeywords({
      category: validateBody.category,
      area: validateBody.area,
      ingredients: validateBody.ingredientNames,
    });

    const embeddingText = buildRecipeEmbeddingText(validateBody);

    const embedding = await generateEmbedding(embeddingText);

    validateBody.embedding = embedding;
    validateBody.keywords = keywords;

    const insertedId = db.transaction((tran) => {
      // insert recipe to DB
      const [recipe] = tran
        .insert(recipes)
        .values(validateBody)
        .returning({ insertedId: recipes.id })
        .all();

      if (!recipe) {
        return next(new AppError("Failed to insert recipe", 400));
      }

      // add keywords to DB
      tran
        .insert(recipeKeywords)
        .values(
          keywords.map((keyword) => ({
            recipeId: recipe.insertedId,
            keyword,
          })),
        )
        .run();

      return recipe.insertedId;
    });

    // add recipe to the recipe index of meilisearch
    await indexRecipe({
      id: validateBody.id,
      recipeName: validateBody.recipeName,
      area: validateBody.area,
      category: validateBody.category,
      ingredients: validateBody.ingredients,
      instructions: validateBody.instructions,
    });

    // add keywords to keyword index of meilisearch
    const keywordDocuments = keywords.map((k) => ({
      id: slugify(k),
      keyword: k,
    }));

    await keywordIndex.addDocuments(keywordDocuments);

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

    const createSlug = slugify(req.body.recipeName);

    const validateBody = validateUpdateRecipe({
      ...recipe[0],
      ...req.body,
      slug: createSlug,
    });

    const updatedRecipe = {
      ...validateBody,
      createdAt: recipe[0]?.createdAt,
      updatedAt: new Date(),
    };

    const embeddingText = buildRecipeEmbeddingText(updatedRecipe);

    const embedding = await generateEmbedding(embeddingText);

    updatedRecipe.embedding = embedding;

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
