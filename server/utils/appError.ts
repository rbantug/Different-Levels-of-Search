export default class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  headers?: Record<string, string>;

  constructor(
    message: string,
    statusCode: number,
    headers?: Record<string, string>,
  ) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = `${statusCode}`.startsWith("4");
    if (headers) {
      this.headers = headers;
    }

    Error.captureStackTrace(this, this.constructor);
  }
}
