import { error } from "node:console";
import type {
  CreateRecipe,
  UpdateRecipe,
  ValidationDependencies,
} from "./types.js";

export default function buildRecipeValidation({ joi }: ValidationDependencies) {
  const createRecipeSchema = joi.object({
    recipeName: joi.string().required(),
    category: joi.string().required(),
    area: joi.string().required(),
    slug: joi.string().required(),
    instructions: joi.array().items(joi.string()).required(),
    recipeThumbnail: joi.string().allow(null).required(),
    ingredients: joi.array().items(joi.string()).required(),
    ingredientNames: joi.array().items(joi.string()),
    keywords: joi.array().items(joi.string()),
  });

  const updateRecipeSchema = joi.object({
    recipeName: joi.string(),
    category: joi.string(),
    area: joi.string(),
    slug: joi.string(),
    instructions: joi.array().items(joi.string()),
    recipeThumbnail: joi.string().allow(null),
    ingredients: joi.array().items(joi.string()),
  });

  function validateCreateRecipe(data: CreateRecipe): CreateRecipe {
    const { error, value } = createRecipeSchema.validate(data, {
      convert: false,
      abortEarly: false
    });

    if (error) {
      throw new Error(`Joi validation error: ${error.message}`);
    }

    return value;
  }

  function validateUpdateRecipe(data: UpdateRecipe): UpdateRecipe {
    const { error, value } = updateRecipeSchema.validate(data, {
      convert: false,
      abortEarly: false
    });

    if (error) {
      throw new Error(`Joi validation error: ${error.message}`);
    }

    return value;
  }
  return {
    validateCreateRecipe,
    validateUpdateRecipe,
  };
}
