import type makeKeywordIndex from "../services/meilisearch/keywordIndex.js";

interface Dependencies {
  keywordIndex: {
    searchKeywords: ReturnType<typeof makeKeywordIndex>["searchKeywords"];
  };
}

export default function makeFindKeywords({ keywordIndex }: Dependencies) {
  return async function findKeywords({ query }: { query: string }) {
    return keywordIndex.searchKeywords(query);
  };
}
