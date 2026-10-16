import type makeSearchRecipeSemantic from "../use-cases/searchRecipeSemantic.js";
import AppError from "../errors/AppError.js";

interface Dependencies {
  searchRecipeSemantic: ReturnType<typeof makeSearchRecipeSemantic>;
}

export default function makeGetSemanticRecipes({
  searchRecipeSemantic,
}: Dependencies) {
  return async function getSemanticRecipes({
    query,
    limit,
  }: {
    query: string;
    limit?: number;
  }) {
    const searchQuery = query.trim()

    if (!searchQuery) {
        throw new AppError('A search query is required', 400)
    }

    const getLimit = limit ? Number(limit) : undefined;

    const recipes = await searchRecipeSemantic({
      query: searchQuery,
      limit: getLimit,
    });

    return {
      statusCode: 200,
      body: {
        status: "success",
        count: recipes.length,
        data: recipes,
        query,
      },
    };
  };
}
