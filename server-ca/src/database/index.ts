import createDB from "./client.js";
import makeRecipeDB from "./recipeDB.js";

const db = createDB("sqlite.db");
const recipeDB = makeRecipeDB({ db })

export {
  db,
  recipeDB
};
