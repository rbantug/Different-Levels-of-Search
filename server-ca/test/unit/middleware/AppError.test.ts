import { describe, expect, it } from "vitest";

import AppError from "../../../src/errors/AppError.js";

describe("AppError", () => {
  it("sets status to fail for 4xx errors", () => {
    const error = new AppError("Bad request", 400);

    expect(error.status).toBe("fail");
  });

  it("sets status to error for non-4xx errors", () => {
    const error = new AppError("Internal server error", 500);

    expect(error.status).toBe("error");
  });
});