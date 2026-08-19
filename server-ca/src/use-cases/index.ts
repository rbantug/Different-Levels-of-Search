import {
  makeRecipe,
  updateRecipe as updateRecipeEntity,
} from "../entities/index.js";

import makeAddRecipe from "./addRecipe.js";
import makeFindRecipeById from "./findRecipeById.js";
import makeListRecipes from "./listRecipes.js";
import makeRemoveRecipe from "./removeRecipe.js";
import makeSearchRecipesByKeyword from "./searchRecipesByKeyword.js";
import makeSearchRecipeHybrid from "./searchRecipesHybrid.js";
import makeUpdateRecipe from "./updateRecipe.js";

import { recipeDB } from "../database/index.js";
import { generateEmbedding } from "../services/embeddings/index.js";
import buildKeywords from "../utils/recipe/buildKeywords.js";
import buildRecipeEmbeddingText from "../utils/recipe/buildRecipeEmbeddingText.js";
import {
  meiliRecipeIndex,
  meiliKeywordIndex,
} from "../services/meilisearch/index.js";
import cosineSimilarity from "../utils/vector/cosineSimilarity.js";

const addRecipe = makeAddRecipe({
  makeRecipe,
  recipeDB,
  buildKeywords,
  generateEmbedding,
  buildRecipeEmbeddingText,
  addRecipeIndex: meiliRecipeIndex.addRecipe,
  addKeywordsIndex: meiliKeywordIndex.addKeywords,
});

const findRecipeById = makeFindRecipeById({ recipeDB });

const listRecipes = makeListRecipes({ recipeDB });

const removeRecipe = makeRemoveRecipe({
  recipeDB,
  recipeSearchIndex: meiliRecipeIndex,
  keywordSearchIndex: meiliKeywordIndex,
});

const searchRecipesByKeyword = makeSearchRecipesByKeyword({
  searchRecipeIndex: meiliRecipeIndex.searchRecipe,
});

const searchRecipesHybrid = makeSearchRecipeHybrid({
  recipeDB,
  generateEmbedding,
  cosineSimilarity,
  searchRecipeIndex: meiliRecipeIndex.searchRecipe,
});

const updateRecipe = makeUpdateRecipe({
  recipeDB,
  buildKeywords,
  buildRecipeEmbeddingText,
  generateEmbedding,
  keywordSearchIndex: meiliKeywordIndex,
  recipeSearchIndex: meiliRecipeIndex,
  updateRecipeEntity,
});

export {
  addRecipe,
  findRecipeById,
  listRecipes,
  removeRecipe,
  searchRecipesByKeyword,
  searchRecipesHybrid,
  updateRecipe
};
