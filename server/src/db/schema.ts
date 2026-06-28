import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const recipes = sqliteTable("recipes", {
  id: text("id").primaryKey(),
  recipeName: text("recipe_name").notNull(),
  category: text("category").notNull(),
  area: text("area").notNull(),
  instructions: text("instructions", {
    mode: "json",
  })
    .$type<string[]>()
    .notNull(),
  recipeThumbnail: text("recipeThumbnail").notNull(),
  ingredients: text("ingredients", {
    mode: "json",
  })
    .$type<string[]>()
    .notNull(),
  embedding: text("embedding", {
    mode: "json",
  })
    .$type<number[]>()
    .notNull(),
  createdAt: integer("created_at", {
    mode: "timestamp",
  }).notNull(),
  updatedAt: integer("updated_at", {
    mode: "timestamp",
  }).notNull(),
});
