import Joi from "joi";
import type { RecipeSchema } from "./db/type.js";

const recipeSchema = Joi.object({
  id: Joi.string().guid().required(),
  recipeName: Joi.string().required(),
  category: Joi.string().required(),
  area: Joi.string().required(),
  instructions: Joi.string().required(),
  recipeThumbnail: Joi.string().required(),
  ingredient1: Joi.string().required(),
  ingredient2: Joi.string().allow(""),
  ingredient3: Joi.string().allow(""),
  ingredient4: Joi.string().allow(""),
  ingredient5: Joi.string().allow(""),
  ingredient6: Joi.string().allow(""),
  ingredient7: Joi.string().allow(""),
  ingredient8: Joi.string().allow(""),
  ingredient9: Joi.string().allow(""),
  ingredient10: Joi.string().allow(""),
  ingredient11: Joi.string().allow(""),
  ingredient12: Joi.string().allow(""),
  ingredient13: Joi.string().allow(""),
  ingredient14: Joi.string().allow(""),
  ingredient15: Joi.string().allow(""),
  ingredient16: Joi.string().allow(""),
  ingredient17: Joi.string().allow(""),
  ingredient18: Joi.string().allow(""),
  ingredient19: Joi.string().allow(""),
  ingredient20: Joi.string().allow(""),
  measure1: Joi.string().required(),
  measure2: Joi.string().allow(""),
  measure3: Joi.string().allow(""),
  measure4: Joi.string().allow(""),
  measure5: Joi.string().allow(""),
  measure6: Joi.string().allow(""),
  measure7: Joi.string().allow(""),
  measure8: Joi.string().allow(""),
  measure9: Joi.string().allow(""),
  measure10: Joi.string().allow(""),
  measure11: Joi.string().allow(""),
  measure12: Joi.string().allow(""),
  measure13: Joi.string().allow(""),
  measure14: Joi.string().allow(""),
  measure15: Joi.string().allow(""),
  measure16: Joi.string().allow(""),
  measure17: Joi.string().allow(""),
  measure18: Joi.string().allow(""),
  measure19: Joi.string().allow(""),
  measure20: Joi.string().allow(""),
  embedding: Joi.object(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});

const ingredientDefaults = Object.fromEntries(
  Array.from({ length: 19 }, (_, i) => [`ingredient${i + 2}`, ""]),
);

const measureDefaults = Object.fromEntries(
  Array.from({ length: 19 }, (_, i) => [`measure${i + 2}`, ""]),
);


export function validateCreateRecipe(data: RecipeSchema) {
  const payload: RecipeSchema = {
    ...data,

    id: crypto.randomUUID(),
    ...ingredientDefaults,
    ...measureDefaults,
    embedding: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const { error, value } = recipeSchema.validate(payload, {
    convert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  return Object.freeze(value);
}

export function validateUpdateRecipe(data: Partial<RecipeSchema>) {
  const patchRecipeSchema = recipeSchema.fork(
    Object.keys(recipeSchema.describe().keys),
    (schema) => schema.optional(),
  );

  const { error, value } = patchRecipeSchema.validate(data, { convert: false });

  if (error) {
    throw new Error(error.message);
  }

  return Object.freeze(value);
}
