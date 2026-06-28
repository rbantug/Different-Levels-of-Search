import Joi from "joi";
import type { RecipeSchema } from "./db/type.js";

const recipeSchema = Joi.object({
  id: Joi.string().guid().required(),
  recipeName: Joi.string().required(),
  category: Joi.string().required(),
  area: Joi.string().required(),
  instructions: Joi.array().items(Joi.string()).required(),
  recipeThumbnail: Joi.string().allow(null),
  ingredients: Joi.array().items(Joi.string()).required(),
  embedding: Joi.array().items(Joi.number()),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});

export interface ValidateCreateRecipe {
  recipeName: string;
  category: string;
  area: string;
  instructions: string[];
  recipeThumbnail: string;
  ingredients: string[];
}

export function validateCreateRecipe(data: any) {
  const payload: RecipeSchema = {
    ...data,

    id: crypto.randomUUID(),
    embedding: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const { error, value } = recipeSchema.validate(payload, {
    convert: false,
  });

  if (error) {
    throw new Error(`${value.recipeName} - ${error.message}`);
  }

  return value;
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

  return value;
}
