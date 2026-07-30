import { sqliteTable, text, primaryKey, index } from "drizzle-orm/sqlite-core";

import { recipes } from "./recipe.js";

export const recipeKeywords = sqliteTable(
  "recipe_keywords",
  {
    recipeId: text("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    keyword: text("keyword").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.recipeId, table.keyword] }),
    index("recipe_keywords_keyword_idx").on(table.keyword),
  ],
);
