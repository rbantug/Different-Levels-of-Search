import { describe, expect, it, vi } from "vitest";

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

    await handler(
      {} as any,
      res as any,
      next,
    );

    expect(setHeader).toHaveBeenCalledWith(
      "X-Test",
      "test-value",
    );

    expect(json).toHaveBeenCalledWith({
      status: "success",
    });
  });
});
