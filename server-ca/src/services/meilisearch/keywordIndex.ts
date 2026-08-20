import slugify from "slugify";
import type { Meilisearch } from "meilisearch";

import type { KeywordSearchDocument } from "./types.js";

export default function makeKeywordIndex({ client }: { client: Meilisearch }) {
  const index = client.index("keywords");

  async function setupKeywordIndex() {
    return index.updateSettings({
      searchableAttributes: ["keyword"],
      displayedAttributes: ["id", "keyword"],
    });
  }

  async function addKeywords(keywords: string[]) {
    if (keywords.length === 0) return;

    const documents: KeywordSearchDocument[] = keywords.map((keyword) => ({
      id: slugify(keyword, { lower: true }),
      keyword,
    }));

    return index.addDocuments(documents);
  }

  async function deleteKeywords(keywords: string[]) {
    if (keywords.length === 0) return;

    const ids = keywords.map((keyword) => slugify(keyword, { lower: true }));

    return index.deleteDocuments(ids);
  }

  async function searchKeywords(keyword: string) {
    return index.search(keyword, {
      limit: 5,
      attributesToRetrieve: ["keyword"],
    });
  }

  return { setupKeywordIndex, addKeywords, deleteKeywords, searchKeywords };
}
