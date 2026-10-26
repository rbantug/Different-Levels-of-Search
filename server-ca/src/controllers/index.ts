import makeDeleteSingleRecipe from "./deleteSingleRecipe.js";
import makeGetAllRecipes from "./getAllRecipes.js";
import makeGetHybridRecipe from "./getHybridRecipes.js";
import makeGetKeywordSuggestions from "./getKeywordSuggestions.js";
import makeGetSearchRecipe from "./getSearchRecipes.js";
import makeGetSingleRecipe from "./getSingleRecipe.js";
import makePostSingleRecipe from "./postSingleRecipe.js";
import makeUpdateSingleRecipe from "./updateSingleRecipe.js";
import makeGetSemanticRecipes from "./getSemanticRecipes.js";
import makeGetHealth from "./getHealth.js";

import {
  removeRecipe,
  listRecipes,
  searchRecipesHybrid,
  findKeywords,
  searchRecipesByKeyword,
  findRecipeBySlug,
  addRecipe,
  updateRecipe,
  searchRecipeSemantic
} from "../use-cases/index.js";

const deleteSingleRecipe = makeDeleteSingleRecipe({ removeRecipe });
const getAllRecipes = makeGetAllRecipes({ listRecipes });
const getHybridRecipe = makeGetHybridRecipe({ searchRecipesHybrid });
const getKeywordSuggestions = makeGetKeywordSuggestions({ findKeywords });
const getSearchRecipes = makeGetSearchRecipe({ searchRecipesByKeyword });
const getSingleRecipe = makeGetSingleRecipe({ findRecipeBySlug });
const postSingleRecipe = makePostSingleRecipe({ addRecipe });
const updateSingleRecipe = makeUpdateSingleRecipe({ updateRecipe });
const getSemanticRecipe = makeGetSemanticRecipes({ searchRecipeSemantic })
const getHealth = makeGetHealth()

export {
  deleteSingleRecipe,
  getAllRecipes,
  getHybridRecipe,
  getKeywordSuggestions,
  getSearchRecipes,
  getSingleRecipe,
  postSingleRecipe,
  updateSingleRecipe,
  getSemanticRecipe,
  getHealth
};
