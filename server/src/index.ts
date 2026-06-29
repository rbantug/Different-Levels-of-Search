import express from "express";
import cors from "cors";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import generalRoutes from "./routes/general.js";
import recipeRoutes from "./routes/recipe.js";
import searchRoutes from "./routes/search.js";
import errorHandling from "./errorHandling.js";
import { setupSearchIndex } from "./search/setup.js";
import { runImport } from "../scripts/importRecipes.js";
import { recipes } from "./db/schema.js";
import { exists, sql } from "drizzle-orm";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/", generalRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/search", searchRoutes);

app.use(errorHandling);

const PORT = 3000;

const sqlite = new Database("sqlite.db");

export const db = drizzle(sqlite);

async function start() {
  // This will check if the DB already has something inside it
  const checkDB = await db.select().from(recipes).limit(1);

  if (checkDB.length !== 0) {
    await setupSearchIndex();
    await runImport();
  }

  app.listen(PORT, () => {
    console.log(`backend is running on port ${PORT}`);
  });
}

start();
