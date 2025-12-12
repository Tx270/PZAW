import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function getDB() {
  const db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });

  await db.exec(`
        CREATE TABLE IF NOT EXISTS samples (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            author TEXT NOT NULL,
            key TEXT NOT NULL,
            tempo INTEGER NOT NULL,
            description TEXT,
            created_at TEXT NOT NULL,
            file TEXT
        );
    `);

  return db;
}
