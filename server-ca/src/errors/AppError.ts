export default class AppError extends Error {
  readonly statusCode: number;
  readonly status: "fail" | "error";
  readonly isOperational: boolean;
  readonly headers?: Record<string, string> | undefined;

  constructor(
    message: string,
    statusCode: number,
    headers?: Record<string, string>,
  ) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.status = statusCode.toString().startsWith("4") ? "fail" : "error";
    this.isOperational = statusCode.toString().startsWith("4");
    this.headers = headers;

    Error.captureStackTrace(this, AppError);
  }
}
