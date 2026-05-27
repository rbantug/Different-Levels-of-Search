import type { NextFunction, Request, Response } from "express";

import { recipeIndex } from "../search/meilisearch.js";
import catchAsyncError from "../../utils/catchAsyncError.js";

export const getSearch = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = String(req.query.q || '')
    const limit = Number(req.query.limit || 20)

    const category = req.query.category as string;

    const filters = [];

    if (category) {
      filters.push(`category = "${category}"`);
    }

    const results = await recipeIndex.search(query, {
      limit,
      filter: filters.length > 0 ? filters : [],
    });

    res.status(200).json({
      status: "success",
      data: results,
    });
  },
);

// TODO:
// commit changes first
// delete "sqlite.db" to reset all data and then run "db:migrate"