import axios from "axios";

import type { NextFunction, Request, Response } from "express";

import catchAsyncError from "../../utils/catchAsyncError.js";


export const getHealth = (_: Request, res: Response) => {
  res.json({
    status: "ok",
  });
};

export const getEmbeddingTest = catchAsyncError(async (_: Request, res: Response) => {
  const model = process.env.OLLAMA_MODEL;
    const response = await axios.post("http://ollama:11434/api/embeddings", {
      model,
      prompt: "healthy filipino soup",
    });

    res.status(200).json({
      status: "success",
      data: response.data,
    });
  });
