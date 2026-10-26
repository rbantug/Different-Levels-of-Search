import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const searchOutbox = sqliteTable(
  "search_outbox",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),

    recipeId: text("recipe_id").notNull(),

    operation: text("operation", {
      enum: ["upsert", "delete"],
    }).notNull(),

    keywordsToAdd: text("keywords_to_add", {
      mode: "json",
    })
      .$type<string[]>()
      .notNull()
      .default([]),

    keywordsToRemove: text("keywords_to_remove", {
      mode: "json",
    })
      .$type<string[]>()
      .notNull()
      .default([]),

    status: text("status", {
      enum: ["pending", "completed"],
    })
      .notNull()
      .default("pending"),

    attempts: integer("attempts").notNull().default(0),

    lastError: text("last_error"),

    createdAt: integer("created_at", {
      mode: "timestamp",
    })
      .notNull()
      .$defaultFn(() => new Date()),

    processedAt: integer("processed_at", {
      mode: "timestamp",
    }),
  },
  (table) => [index("search_outbox_status_id_idx").on(table.status, table.id)],
);
