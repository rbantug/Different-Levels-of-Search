import { recipeIndex } from "./meilisearch.js";
import { generateEmbedding } from "../embeddings/generateEmbedding.js";
import { cosineSimilarity } from "./cosineSimilarity.js";
import { db } from "../db/index.js";
import { recipes } from "../db/schema.js";
import { inArray } from "drizzle-orm";

export async function hybridSearch(query: string, category: string[]) {
  // keyword retrieval

  const keywordResults = await recipeIndex.search(query, {
    limit: 50,
    filter: category.length > 0 ? category : [],
  });

  const ids = keywordResults.hits.map((hit: any) => hit.id);

  if (!ids.length) return [];

  // convert query string to embedding

  const queryEmbedding = await generateEmbedding(query);

  // fetch recipes from DB

  const fullRecipes = await db
    .select()
    .from(recipes)
    .where(inArray(recipes.id, ids));

  const reranked = fullRecipes.map((recipe: any) => {
    const hit = keywordResults.hits.find((h: any) => h.id === recipe.id);

    const keywordScore = hit?._rankingScore || 0;

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

  /* const queryEmbedding = await generateEmbedding(query) */

  // Reranking the fullRecipes to follow semantic ranking by comparing queryEmbedding to the embedding in each fullRecipes.embedding

  /* const reranked = fullRecipes.map((recipe) => {
        const similarity = recipe.embedding ? cosineSimilarity(queryEmbedding, recipe.embedding) : 0

        return {
            ...recipe,
            semanticScore: similarity
        }
    }) */

  // sort reranked based on the semanticScore

  reranked.sort((a, b) => b.finalScore - a.finalScore);

  return reranked;
}
