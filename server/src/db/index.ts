import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

const sqlite = new Database('sqlite.db')

// switch SQLite write method from the default rollback journal to write-ahead logging (WAL)
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite)