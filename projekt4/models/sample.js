import { DatabaseSync } from "node:sqlite";

const db_path = "./database.sqlite";
const db = new DatabaseSync(db_path);

db.exec(`
  CREATE TABLE IF NOT EXISTS samples (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    author      TEXT NOT NULL,
    key         TEXT NOT NULL,
    tempo       INTEGER NOT NULL,
    description TEXT,
    created_at  TEXT NOT NULL,
    file        TEXT,
    user_id     INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
  ) STRICT;
`);

const db_ops = {
  all:            db.prepare("SELECT * FROM samples ORDER BY created_at DESC;"),
  search:         db.prepare("SELECT * FROM samples WHERE name LIKE ? ORDER BY created_at DESC;"),
  get:            db.prepare("SELECT * FROM samples WHERE id = ?;"),
  random:         db.prepare("SELECT id FROM samples ORDER BY RANDOM() LIMIT 1;"),
  insert:         db.prepare(`INSERT INTO samples (name, author, key, tempo, description, created_at, user_id)
                              VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?);`),
  update:         db.prepare(`UPDATE samples SET name = ?, author = ?, key = ?, tempo = ?, description = ?
                              WHERE id = ?;`),
  delete:         db.prepare("DELETE FROM samples WHERE id = ?;"),
};

export default db_ops;
