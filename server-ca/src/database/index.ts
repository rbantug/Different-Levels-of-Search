import createDB from "./client.js";
import makeRecipeDB from "./recipeDB.js";
import config from "../config.js";

const db = createDB(config.databasePath);
const recipeDB = makeRecipeDB({ db })

export {
  db,
  recipeDB
};
