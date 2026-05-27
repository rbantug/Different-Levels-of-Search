import { Meilisearch } from "meilisearch";
import AppError from "../../utils/appError.js";

const masterKey =
  process.env.MEILI_MASTER_KEY;

if (!masterKey || typeof masterKey != 'string') throw new AppError('Invalid meili master key', 400)

export const meili = new Meilisearch({
  host: "http://meilisearch:7700",
  apiKey: masterKey,
});

export const recipeIndex = meili.index('recipes')