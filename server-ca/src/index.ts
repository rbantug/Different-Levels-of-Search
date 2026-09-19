import createApp from "./app.js";

import runImport from "./scripts/importRecipes.js";
import { db } from "./database/index.js";
import { recipes } from "./database/schemas/recipe.js";
import { meiliRecipeIndex, meiliKeywordIndex } from "./services/meilisearch/index.js";

import {
  deleteSingleRecipe,
  getAllRecipes,
  getSingleRecipe,
  postSingleRecipe,
  updateSingleRecipe,
  getHybridRecipe,
  getKeywordSuggestions,
  getSearchRecipes,
} from "./controllers/index.js";

const PORT = 3000;

async function start() {
  const checkDB = db.select().from(recipes).limit(1).get();

  if (!checkDB) {
    await meiliRecipeIndex.setupRecipeIndex();
    await meiliKeywordIndex.setupKeywordIndex();
    
    await runImport();
  }

  const app = createApp({
    deleteSingleRecipe,
    getAllRecipes,
    getSingleRecipe,
    postSingleRecipe,
    updateSingleRecipe,
    getHybridRecipe,
    getKeywordSuggestions,
    getSearchRecipes,
  });

  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
}

start();
