import AppError from "../errors/AppError.js";
import type makeSearchRecipeHybrid from "../use-cases/searchRecipesHybrid.js";

interface Dependencies {
  searchRecipesHybrid: ReturnType<typeof makeSearchRecipeHybrid>;
}

export default function makeGetHybridRecipe({
  searchRecipesHybrid,
}: Dependencies) {
  return async function getHybridRecipe({
    query,
    limit,
  }: {
    query: string;
    limit?: number | undefined;
  }) {
    const searchQuery = query.trim();

    if (!searchQuery) {
      throw new AppError("A search query is required", 400);
    }

    const getLimit = limit ? Number(limit) : undefined;

    const recipes = await searchRecipesHybrid({
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
