import { Meilisearch } from "meilisearch";

import makeRecipeIndex from "./recipeIndex.js";
import makeKeywordIndex from "./keywordIndex.js";
import config from "../../config.js";

const meili = new Meilisearch({
  host: config.meiliHost,
  apiKey: config.meiliMasterKey,
});

const meiliRecipeIndex = makeRecipeIndex({ client: meili })
const meiliKeywordIndex = makeKeywordIndex({ client: meili })

export { meiliRecipeIndex, meiliKeywordIndex };

