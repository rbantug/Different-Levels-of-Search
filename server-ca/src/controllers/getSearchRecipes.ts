import AppError from "../errors/AppError.js";
import type makeSearchRecipeByKeyword from "../use-cases/searchRecipesByKeyword.js";

interface Dependencies {
  searchRecipesByKeyword: ReturnType<typeof makeSearchRecipeByKeyword>;
}

export default function makeGetSearchRecipe({
  searchRecipesByKeyword,
}: Dependencies) {
  return async function getSearchRecipe({
    query,
    limit,
  }: {
    query: string;
    limit: number;
  }) {
    const searchQuery = query.trim();

    if (!searchQuery) {
      throw new AppError("A search query is required", 400);
    }

    const getLimit = limit ? Number(limit) : undefined;

    const recipes = await searchRecipesByKeyword({
      query: searchQuery,
      limit: getLimit,
    });

    return {
      statusCode: 200,
      body: {
        status: "success",
        count: recipes.length,
        data: recipes,
        query
      },
    };
  };
}
