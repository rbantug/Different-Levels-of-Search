import joi from "joi";
import slugify from "slugify";

import uuid from "../utils/recipe/uuid.js";

import buildMakeRecipe from "./recipe/recipe.js";
import buildValidateKeyword from "./keyword/validateKeyword.js";

const { makeRecipe, updateRecipe } = buildMakeRecipe({
  joi,
  uuid,
  slugify,
});

const { validateKeyword } = buildValidateKeyword({ joi })

export { makeRecipe, updateRecipe, validateKeyword };
