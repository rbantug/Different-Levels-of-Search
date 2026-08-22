import Joi from "joi";
import type { Request, Response, NextFunction } from "express";

import AppError from "../errors/AppError.js";

export default function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (Joi.isError(error)) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
      errors: error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      })),
    });
  }

  if (error instanceof AppError && error.isOperational) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
}
