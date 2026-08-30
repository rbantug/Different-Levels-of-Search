import express from "express";
import cors from "cors";

import recipeRoutes from "./routes/recipeRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

import runImport from "../scripts/importRecipes.js";
import { db } from "./database/index.js";
import { recipes } from "./database/schemas/recipe.js";
import AppError from "./errors/AppError.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/recipes", recipeRoutes);
app.use("/api/search", searchRoutes);
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(errorHandler);

const PORT = 3000;

async function start() {
  const checkDB = db.select().from(recipes).limit(1).get();

  if (!checkDB) {
    await runImport();
  }

  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
}

start();
