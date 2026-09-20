import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db } from "./index.js";

export default function runMigrations() {
  migrate(db, {
    migrationsFolder: "./drizzle",
  });
}
