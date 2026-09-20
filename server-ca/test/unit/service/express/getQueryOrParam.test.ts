import { describe, expect, it } from "vitest";

import {
  getRequiredParam,
  getRequiredQuery,
} from "../../../../src/services/express/getQueryOrParam.js";

describe("getRequiredParam", () => {
  it("returns the parameter value", () => {
    const result = getRequiredParam({
      name: "id",
      params: {
        id: "recipe-1",
      },
    });

    expect(result).toBe("recipe-1");
  });

  it("throws when the parameter is missing", () => {
    expect(() =>
      getRequiredParam({
        name: "id",
        params: {},
      }),
    ).toThrow();
  });
});

describe("getRequiredQuery", () => {
  it("returns the trimmed query value", () => {
    const result = getRequiredQuery({
      name: "q",
      query: {
        q: "  pasta  ",
      },
    });

    expect(result).toBe("pasta");
  });

  it("throws when the query is missing", () => {
    expect(() =>
      getRequiredQuery({
        name: "q",
        query: {},
      }),
    ).toThrow();
  });

  it("throws when the query contains only whitespace", () => {
    expect(() =>
      getRequiredQuery({
        name: "q",
        query: {
          q: "   ",
        },
      }),
    ).toThrow();
  });

  it("throws when the query is not a string", () => {
    expect(() =>
      getRequiredQuery({
        name: "q",
        query: {
          q: ["pasta", "pizza"],
        },
      }),
    ).toThrow();
  });
});
