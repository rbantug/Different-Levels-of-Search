import {
  makeRecipe,
  updateRecipe as updateRecipeEntity,
} from "../entities/index.js";

import makeAddRecipe from "./addRecipe.js";
import makeListRecipes from "./listRecipes.js";
import makeRemoveRecipe from "./removeRecipe.js";
import makeSearchRecipesByKeyword from "./searchRecipesByKeyword.js";
import makeSearchRecipeHybrid from "./searchRecipesHybrid.js";
import makeUpdateRecipe from "./updateRecipe.js";
import makeFindKeywords from "./findKeywords.js";
import makeSearchRecipeSemantic from "./searchRecipeSemantic.js";

import { recipeDB } from "../database/index.js";
import { generateEmbedding } from "../services/embeddings/index.js";
import buildKeywords from "../utils/recipe/buildKeywords.js";
import buildRecipeEmbeddingText from "../utils/recipe/buildRecipeEmbeddingText.js";
import {
  meiliRecipeIndex,
  meiliKeywordIndex,
} from "../services/meilisearch/index.js";
import cosineSimilarity from "../utils/vector/cosineSimilarity.js";
import makeFindRecipeBySlug from "./findRecipeBySlug.js";

const addRecipe = makeAddRecipe({
  makeRecipe,
  recipeDB,
  buildKeywords,
  generateEmbedding,
  buildRecipeEmbeddingText
});

const findRecipeBySlug = makeFindRecipeBySlug({ recipeDB })

const listRecipes = makeListRecipes({ recipeDB });

const removeRecipe = makeRemoveRecipe({
  recipeDB,
  recipeIndex: meiliRecipeIndex,
  keywordIndex: meiliKeywordIndex,
});

const searchRecipesByKeyword = makeSearchRecipesByKeyword({
  recipeIndex: meiliRecipeIndex,
  recipeDB
});

const searchRecipesHybrid = makeSearchRecipeHybrid({
  recipeDB,
  generateEmbedding,
  cosineSimilarity,
  recipeIndex: meiliRecipeIndex,
});

const updateRecipe = makeUpdateRecipe({
  recipeDB,
  buildKeywords,
  buildRecipeEmbeddingText,
  generateEmbedding,
  updateRecipeEntity,
});

const findKeywords = makeFindKeywords({
  keywordIndex: meiliKeywordIndex,
});

const searchRecipeSemantic = makeSearchRecipeSemantic({ generateEmbedding, recipeDB, recipeIndex: meiliRecipeIndex })

export {
  addRecipe,
  findRecipeBySlug,
  listRecipes,
  removeRecipe,
  searchRecipesByKeyword,
  searchRecipesHybrid,
  searchRecipeSemantic,
  updateRecipe,
  findKeywords,
};
