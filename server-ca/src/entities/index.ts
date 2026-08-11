import joi from "joi";

import uuid from "../utils/uuid.js";
import buildMakeRecipe from "./recipe.js";

const { makeRecipe, updateRecipe } = buildMakeRecipe({ joi, uuid });

export { makeRecipe, updateRecipe };
