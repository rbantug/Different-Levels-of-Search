import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

export default function createDB(dbPath: string) {
  const sqlite = new Database(dbPath);
  // this will enable foreign keys constraint on each database startup
  sqlite.pragma("foreign_keys = ON")
  return drizzle(sqlite);
}

export type DatabaseClient = ReturnType<typeof createDB>
