import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import { migrate } from "drizzle-orm/better-sqlite3/migrator"

import type { DatabaseClient } from "../../src/database/client.js"

export interface TestDatabase {
    db: DatabaseClient
    sqlite: Database.Database
}

export function createTestDatabase():TestDatabase {
    const sqlite = new Database(":memory:")

    sqlite.pragma("foreign_keys = ON")

    const db = drizzle(sqlite)

    migrate(db, {
        migrationsFolder: "./drizzle" // path is relative to the current working directory
    })

    return {
        db,
        sqlite
    }
}