import createDB from "./client.js";
import makeRecipeDB from "./recipeDB.js";

const databasePath = process.env.DATABASE_PATH;

if (!databasePath) {
  throw new Error("DATABASE_PATH is required");
}

const db = createDB(databasePath);
const recipeDB = makeRecipeDB({ db })

export {
  db,
  recipeDB
};
