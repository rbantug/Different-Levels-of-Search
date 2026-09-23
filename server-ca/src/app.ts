import express from "express";
import cors from "cors";

import makeRecipeRoutes from "./routes/recipeRoutes.js";
import makeSearchRoutes from "./routes/searchRoutes.js";

import type makeDeleteSingleRecipe from "./controllers/deleteSingleRecipe.js";
import type makeGetAllRecipes from "./controllers/getAllRecipes.js";
import makeGetSingleRecipe from "./controllers/getSingleRecipe.js";
import type makePostSingleRecipe from "./controllers/postSingleRecipe.js";
import type makeUpdateSingleRecipe from "./controllers/updateSingleRecipe.js";
import type makeGetHybridRecipe from "./controllers/getHybridRecipes.js";
import type makeGetKeywordSuggestions from "./controllers/getKeywordSuggestions.js";
import type makeGetSearchRecipe from "./controllers/getSearchRecipes.js";
import type makeGetHealth from './controllers/getHealth.js'

import errorHandler from "./middleware/errorHandler.js";
import AppError from "./errors/AppError.js";
import expressCallback from "./services/express/expressCallback.js";

interface Dependencies {
  deleteSingleRecipe: ReturnType<typeof makeDeleteSingleRecipe>;
  getAllRecipes: ReturnType<typeof makeGetAllRecipes>;
  getSingleRecipe: ReturnType<typeof makeGetSingleRecipe>;
  postSingleRecipe: ReturnType<typeof makePostSingleRecipe>;
  updateSingleRecipe: ReturnType<typeof makeUpdateSingleRecipe>;
  getSearchRecipes: ReturnType<typeof makeGetSearchRecipe>;
  getHybridRecipe: ReturnType<typeof makeGetHybridRecipe>;
  getKeywordSuggestions: ReturnType<typeof makeGetKeywordSuggestions>;
  getHealth: ReturnType<typeof makeGetHealth>;
}

export default function createApp({
  deleteSingleRecipe,
  getAllRecipes,
  getSingleRecipe,
  postSingleRecipe,
  updateSingleRecipe,
  getSearchRecipes,
  getHybridRecipe,
  getKeywordSuggestions,
  getHealth
}: Dependencies) {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // creating the routes inside createApp() makes it easier to subsitute fake controllers for testing
  const recipeRoutes = makeRecipeRoutes({
    deleteSingleRecipe,
    getAllRecipes,
    getSingleRecipe,
    postSingleRecipe,
    updateSingleRecipe,
  });

  const searchRoutes = makeSearchRoutes({
    getHybridRecipe,
    getKeywordSuggestions,
    getSearchRecipes,
  });

  // health check
  app.get("/api/health", expressCallback({
    controller: getHealth
  }))

  // Routes
  app.use("/api/recipes", recipeRoutes);
  app.use("/api/search", searchRoutes);



  // Unknown routes
  app.use((req, res, next) => {
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
  });

  // Error handler
  app.use(errorHandler);

  return app;
}
