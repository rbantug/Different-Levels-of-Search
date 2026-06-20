import type { NextFunction, Request, Response } from "express";

import { db } from "../db/index.js";
import { recipes } from "../db/schema.js";
import { recipeIndex } from "../search/meilisearch.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import { inArray } from "drizzle-orm";
import { hybridSearch } from "../search/hybridSearch.js";

export const getSearch = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = String(req.query.q || "");
    const limit = Number(req.query.limit || 20);

    const category = req.query.category as string;

    const filters = [];

    if (category) {
      filters.push(`category = "${category}"`);
    }

    const results = await recipeIndex.search(query, {
      limit,
      filter: filters.length > 0 ? filters : [],
    });

    const ids = results.hits.map((hit: any) => hit.id);

    if (ids.length === 0) {
      res.status(200).json({
        status: "success",
        count: 0,
        data: [],
      });
      return;
    }

    // fetch records from database using id array from Meilisearch
    const rows = await db
      .select()
      .from(recipes)
      .where(inArray(recipes.id, ids));

    // preserve the ranking order from Meilisearch
    const rowMap = new Map(rows.map((r) => [r.id, r]));

    const finalResult = ids.map((id) => rowMap.get(id)).filter(Boolean);

    res.status(200).json({
      status: "success",
      count: finalResult.length,
      data: finalResult,
      query
    });
  },
);

export const getHybridSearch = catchAsyncError(
  async (req: Request, res: Response) => {
    const query = String(req.query.q || "");

    const category = req.query.category as string;

    const filters = [];

    if (category) {
      filters.push(`category = "${category}"`);
    }

    const finalResult = await hybridSearch(query, filters);

    res.status(200).json({
      status: "success",
      count: finalResult.length,
      data: finalResult,
      query
    });
  },
);
