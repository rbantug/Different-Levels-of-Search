import type {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";

import AppError from "../utils/appError.js";

export default function (
  err: AppError,
  req: Request,
  res: Response,
  _: NextFunction,
) {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        headers: err.headers,
        status: err.status,
        statusCode: err.statusCode,
        message: err.message,
      });
    } else {
      console.error("This is a programming error", err);

      res.status(500).json({
        status: "error",
        message: "Something went wrong",
      });
    }
  }
}
