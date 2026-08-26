import { Meilisearch } from "meilisearch";

import makeRecipeIndex from "./recipeIndex.js";
import makeKeywordIndex from "./keywordIndex.js";
import config from "../../config.js";

const masterKey = config.meiliMasterKey;

const meili = new Meilisearch({
  host: "http://meilisearch:7700",
  apiKey: masterKey,
});

const meiliRecipeIndex = makeRecipeIndex({ client: meili })
const meiliKeywordIndex = makeKeywordIndex({ client: meili })

export { meiliRecipeIndex, meiliKeywordIndex };

