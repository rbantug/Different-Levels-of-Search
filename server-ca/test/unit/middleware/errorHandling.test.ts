import Joi from "joi";
import { describe, expect, it, vi } from "vitest";

import errorHandler from "../../../src/middleware/errorHandler.js";

describe("errorHandler", () => {
  it("returns 400 for a Joi validation error", () => {
    const error = Joi.object({
      name: Joi.string().required(),
    }).validate({}).error;

    const status = vi.fn().mockReturnThis();
    const json = vi.fn();

    const res = {
      status,
      json,
    } as any;

    errorHandler(error, {} as any, res, {} as any);

    expect(status).toHaveBeenCalledWith(400);

    expect(json).toHaveBeenCalledWith({
      status: "fail",
      message: error!.message,
      errors: error!.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      })),
    });
  });

  it("returns 500 for an unexpected error", () => {
    const error = new Error("Something went wrong");

    const status = vi.fn().mockReturnThis();
    const json = vi.fn();

    const res = {
      status,
      json,
    } as any;

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    errorHandler(error, {} as any, res, {} as any);

    expect(status).toHaveBeenCalledWith(500);

    expect(json).toHaveBeenCalledWith({
      status: "error",
      message: "Internal server error",
    });

    expect(consoleError).toHaveBeenCalledWith(
      "This is a programming error",
      error,
    );

    consoleError.mockRestore();
  });
});