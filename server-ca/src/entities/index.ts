import joi from "joi";
import slugify from "slugify";

import uuid from "../utils/recipe/uuid.js";
import buildKeywords from "../utils/recipe/buildKeywords.js";
import buildMakeRecipe from "./recipe.js";

const { makeRecipe, updateRecipe } = buildMakeRecipe({
  joi,
  uuid,
  slugify,
});

export { makeRecipe, updateRecipe };
