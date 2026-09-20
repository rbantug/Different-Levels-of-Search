import { describe, expect, it, vi } from "vitest";

import makeFindKeywords from "../../../src/use-cases/findKeywords.js";

describe("makeFindKeywords use case", () => {
  const keywords = ["filipino", "main course", "chicken"];

  function createDependencies({ keyword = keywords } = {}) {
    const searchKeywords = vi.fn().mockReturnValue(keyword);

    const findKeywords = makeFindKeywords({ keywordIndex: { searchKeywords } });

    return {
        searchKeywords,
        findKeywords
    }
  }

  it("should search Meilisearch using the provided query", async () => {
    const dependencies = createDependencies()

    await dependencies.findKeywords({ query: "chicken" })

    expect(dependencies.searchKeywords).toHaveBeenCalledWith("chicken")
  });

  it("should return a list of keywords", async () => {
    const dependencies = createDependencies();

    const result = await dependencies.findKeywords({ query: "chicken" });

    expect(result).toEqual(keywords)
  })
});
