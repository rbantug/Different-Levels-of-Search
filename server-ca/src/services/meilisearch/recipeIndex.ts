import type { Meilisearch } from "meilisearch";
import type { RecipeSearchDocument } from "./types.js";

export default function makeRecipeIndex({ client }: { client: Meilisearch }) {
  const index = client.index("recipes");

  async function setupRecipeIndex() {
    await index.updateSearchableAttributes([
      "recipeName",
      "category",
      "area",
      "ingredients",
    ]);

    await index.updateFilterableAttributes(["category", "area"]);

    await index.updateSortableAttributes(["recipeName"]);

    await index.updateRankingRules([
      "words",
      "typo",
      "proximity",
      "attribute",
      "sort",
      "exactness",
    ]);

    await index.updateEmbedders({
      default: {
        source: "userProvided",
        dimensions: 768,
      },
    });

    console.log("Meilisearch configured");
  }

  async function addRecipe(recipe: RecipeSearchDocument) {
    return index.addDocuments([
      {
        id: recipe.id,
        recipeName: recipe.recipeName,
        category: recipe.category,
        area: recipe.area,
        ingredients: recipe.ingredients,
        _vectors: {
          default: recipe.embedding,
        },
      },
    ]);
  }

  async function deleteRecipe(id: string) {
    return index.deleteDocument(id);
  }

  async function searchRecipe({
    query,
    limit = 20,
  }: {
    query: string;
    limit?: number | undefined;
  }) {
    return index.search(query, { limit, showRankingScore: true });
  }

  async function searchRecipeSemantic({
    embedding,
    limit = 20,
  }: {
    embedding: number[];
    limit?: number;
  }) {
    return index.search("", {
      vector: embedding,
      limit,
      showRankingScore: true,
      hybrid: {
        embedder: "default",
        semanticRatio: 1
      }
    });
  }

  return {
    setupRecipeIndex,
    addRecipe,
    deleteRecipe,
    searchRecipe,
    searchRecipeSemantic,
  };
}
