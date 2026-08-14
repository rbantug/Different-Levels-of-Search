import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

export default function createDB(dbPath: string) {
  const sqlite = new Database(dbPath);
  return drizzle(sqlite);
}

export type DatabaseClient = ReturnType<typeof createDB>
