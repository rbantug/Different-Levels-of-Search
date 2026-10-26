import type { validateKeyword } from "../entities/index.js";
import type makeKeywordIndex from "../services/meilisearch/keywordIndex.js";

interface Dependencies {
  validateKeyword: typeof validateKeyword;
  keywordIndex: {
    searchKeywords: ReturnType<typeof makeKeywordIndex>["searchKeywords"];
  };
}

export default function makeFindKeywords({ validateKeyword, keywordIndex }: Dependencies) {
  return async function findKeywords({ query }: { query: string }) {
    const validatedQuery = validateKeyword(query);

    return keywordIndex.searchKeywords(validatedQuery);
  };
}
