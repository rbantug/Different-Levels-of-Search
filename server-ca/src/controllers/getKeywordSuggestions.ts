import AppError from "../errors/AppError.js";
import type makeFindKeywords from "../use-cases/findKeywords.js";

interface Dependencies {
  findKeywords: ReturnType<typeof makeFindKeywords>;
}

export default function makeGetKeywordSuggestions({
  findKeywords,
}: Dependencies) {
  return async function getKeywordSuggestions({ query }: { query: string }) {
    if (!query) {
      throw new AppError("A query is required", 400);
    }

    const getQuery = query.trim();

    const { hits, query: queryStr } = await findKeywords({ query: getQuery });

    return {
      statusCode: 200,
      body: {
        status: "success",
        data: hits,
        query: queryStr,
        count: hits.length
      },
    };
  };
}
