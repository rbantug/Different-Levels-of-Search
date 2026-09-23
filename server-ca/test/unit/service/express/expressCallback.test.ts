import { describe, expect, it, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";

import expressCallback from "../../../../src/services/express/expressCallback.js";

describe("expressCallback", () => {
  it("sets response headers returned by the controller", async () => {
    const controller = vi.fn().mockReturnValue({
      statusCode: 200,
      headers: {
        "X-Test": "test-value",
      },
      body: {
        status: "success",
      },
    });

    const setHeader = vi.fn();
    const json = vi.fn();

    const res = {
      setHeader,
      status: vi.fn().mockReturnThis(),
      json,
    };

    const next = vi.fn();

    const handler = expressCallback({
      controller,
      mapRequest: () => ({}),
    });

    await handler({} as any, res as any, next);

    expect(setHeader).toHaveBeenCalledWith("X-Test", "test-value");

    expect(json).toHaveBeenCalledWith({
      status: "success",
    });
  });

  it("calls the controller without a request mapper", async () => {
    const controller = vi.fn().mockReturnValue({
      statusCode: 200,
      body: { status: "ok" },
    });

    const handler = expressCallback({
      controller,
    });

    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    await handler(req, res, next);

    expect(controller).toHaveBeenCalledWith(undefined);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
