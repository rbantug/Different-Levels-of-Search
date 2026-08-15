import { Meilisearch } from "meilisearch";

import makeRecipeIndex from "./recipeIndex.js";
import makeKeywordIndex from "./keywordIndex.js";

const masterKey = process.env.MEILI_MASTER_KEY;

if (!masterKey) {
    throw new Error('Meilisearch master key is required')
}

const meili = new Meilisearch({
  host: "http://meilisearch:7700",
  apiKey: masterKey,
});

const meiliRecipeIndex = makeRecipeIndex({ client: meili })
const meiliKeywordIndex = makeKeywordIndex({ client: meili })

export { meiliRecipeIndex, meiliKeywordIndex };

