import createApp from "./app.js";

import runImport from "./scripts/importRecipes.js";
import { db } from "./database/index.js";
import { recipes } from "./database/schemas/recipe.js";
import runMigrations from "./database/migrate.js";

import {
  meiliRecipeIndex,
  meiliKeywordIndex,
} from "./services/meilisearch/index.js";
import config from "./config.js";

import {
  deleteSingleRecipe,
  getAllRecipes,
  getSingleRecipe,
  postSingleRecipe,
  updateSingleRecipe,
  getHybridRecipe,
  getKeywordSuggestions,
  getSearchRecipes,
  getHealth,
} from "./controllers/index.js";

const PORT = Number(config.expressPort);

async function start() {
  runMigrations()

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
    getHealth,
  });

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend running on port ${PORT}`);
  });

  function shutdown(signal: string) {
    console.log(`${signal} received. Shutting down...`);

    const forceShutdown = setTimeout(() => {
      console.error("Graceful shutdown timed out. Forcing exit.");
      process.exit(1);
    }, 10_000);

    server.close((error) => {
      clearTimeout(forceShutdown);

      if (error) {
        console.error("Error while closing server:", error);
        process.exit(1);
      }

      console.log("Server closed.");
      process.exit(0);
    });
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
