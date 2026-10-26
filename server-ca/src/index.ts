import createApp from "./app.js";

import runImport from "./scripts/importRecipes.js";
import { db } from "./database/index.js";
import { recipes } from "./database/schemas/recipe.js";
import runMigrations from "./database/migrate.js";
import makeRecipeDB from "./database/recipeDB.js";

import {
  meiliRecipeIndex,
  meiliKeywordIndex,
} from "./services/meilisearch/index.js";

import makeProcessOutboxJobs from "./use-cases/processOutboxJobs.js";
import makeOutboxWorker from "./workers/outboxWorker.js";

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
  getSemanticRecipe,
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

   const recipeDB = makeRecipeDB({ db })

   recipeDB.deleteOldCompletedJobs(7)

   const processOutboxJobs = makeProcessOutboxJobs({
    recipeDB,
    keywordIndex: meiliKeywordIndex,
    recipeIndex: meiliRecipeIndex
   })

   const outboxWorker = makeOutboxWorker({ processOutboxJobs })

  const app = createApp({
    deleteSingleRecipe,
    getAllRecipes,
    getSingleRecipe,
    postSingleRecipe,
    updateSingleRecipe,
    getHybridRecipe,
    getKeywordSuggestions,
    getSearchRecipes,
    getSemanticRecipe,
    getHealth,
  });

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend running on port ${PORT}`);
  });

  // start worker for meilisearch
  const workerPromise = outboxWorker.start()

  let shuttingDown = false

  function shutdown(signal: string) {
    if (shuttingDown) return
    shuttingDown = true
    console.log(`${signal} received. Shutting down...`);

    outboxWorker.stop()

    const forceShutdown = setTimeout(() => {
      console.error("Graceful shutdown timed out. Forcing exit.");
      process.exit(1);
    }, 10_000);

    /* server.close((error) => {
      clearTimeout(forceShutdown);

      if (error) {
        console.error("Error while closing server:", error);
        process.exit(1);
      }

      console.log("Server closed.");
      process.exit(0);
    }); */
    server.close(async (error) => {
      if (error) {
        console.error("Error while closing server:", error);
        clearTimeout(forceShutdown);
        process.exit(1);
      }

      try {
        await workerPromise;
        console.log("Server and outbox worker closed.");
        clearTimeout(forceShutdown);
        process.exit(0);
      } catch (workerError) {
        console.error("Error while stopping outbox worker:", workerError);
        clearTimeout(forceShutdown);
        process.exit(1);
      }
    });
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
