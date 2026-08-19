import type makeRecipeDB from "../database/recipeDB.js";
import type { meiliRecipeIndex } from "../services/meilisearch/index.js";
import type makeGenerateEmbedding from "../services/embeddings/generateEmbedding.js";
import type cosineSimilarity from "../utils/vector/cosineSimilarity.js";
interface Dependencies {
  recipeDB: ReturnType<typeof makeRecipeDB>;
  searchRecipeIndex: typeof meiliRecipeIndex.searchRecipe;
  generateEmbedding: ReturnType<typeof makeGenerateEmbedding>;
  cosineSimilarity: typeof cosineSimilarity;
}

export default function makeSearchRecipeHybrid({
  recipeDB,
  searchRecipeIndex,
  generateEmbedding,
  cosineSimilarity,
}: Dependencies) {
  return async function searchRecipeHybrid({
    query,
    limit = 100,
  }: {
    query: string;
    limit?: number;
  }) {
    // search recipes in meilisearch that matches the user provided query
    const fetchedMeiliRecipes = await searchRecipeIndex({ query, limit });

    // convert query string to embedding
    const queryEmbedding = await generateEmbedding(query);

    // fetch full recipes from DB using data from meilisearch
    const recipeIds = fetchedMeiliRecipes.hits.map((recipe: any) => recipe.id);

    if (recipeIds.length === 0) {
      return [];
    }

    const recipes = recipeDB.findRecipesById(recipeIds);

    // compare similarity of query embedding and all recipe embedding from the fetched recipes
    const mapKeywordScores = new Map(
      fetchedMeiliRecipes.hits.map((hit) => [hit.id, hit._rankingScore ?? 0]),
    );

    const results = recipes.map((recipe) => {
      const keywordScore = mapKeywordScores.get(recipe.id) ?? 0;

      const semanticScore = recipe.embedding
        ? cosineSimilarity(queryEmbedding, recipe.embedding)
        : 0;

      const finalScore = keywordScore * 0.7 + semanticScore * 0.3;

      return {
        ...recipe,
        keywordScore,
        semanticScore,
        finalScore,
      };
    });

    results.sort((a, b) => b.finalScore - a.finalScore);

    return results;
  };
}
