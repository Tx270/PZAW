import { DatabaseSync } from "node:sqlite";
import argon2 from "argon2";

const PEPPER = process.env.PEPPER;
if (PEPPER == null) {
  console.error(
    `PEPPER environment variable missing.
     Please create an env file or provide SECRET via environment variables.`,
  );
  process.exit(1);
}

const HASH_PARAMS = {
  secret: Buffer.from(PEPPER, "hex"),
};

const db_path = "./database.sqlite";
const db = new DatabaseSync(db_path);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    user_id              INTEGER PRIMARY KEY,
    username             TEXT UNIQUE,
    passhash             TEXT,
    created_at           INTEGER,
    is_admin             INTEGER DEFAULT 0
  ) STRICT;
  `);

const db_ops = {
  create_user: db.prepare(
    "INSERT INTO users (username, passhash, created_at) VALUES (?, ?, ?) RETURNING user_id;",
  ),
  set_admin: db.prepare(
    "UPDATE users SET is_admin = 1 WHERE username = ?;"
  ),
  get_user: db.prepare(
    "SELECT user_id, username, created_at, is_admin FROM users WHERE user_id = ?;",
  ),
  find_by_username: db.prepare(
    "SELECT user_id, username, created_at FROM users WHERE username = ?;",
  ),
  get_auth_data: db.prepare(
    "SELECT user_id, passhash FROM users WHERE username = ?;",
  ),
};

export async function createUser(username, password) {
  let existing_user = db_ops.find_by_username.get(username);

  if (existing_user != null) {
    return null;
  }
  let createdAt = Date.now();
  let passhash = await argon2.hash(password, HASH_PARAMS);

  return db_ops.create_user.get(username, passhash, createdAt);
}

export async function validatePassword(username, password) {
  let auth_data = db_ops.get_auth_data.get(username);
  if (auth_data != null) {
    if (await argon2.verify(auth_data.passhash, password, HASH_PARAMS)) {
      return auth_data.user_id;
    }
  }
  return null;
}

export function getUser(user_id) {
  return db_ops.get_user.get(user_id);
}

export function setAdmin(username) {
  return db_ops.set_admin.run(username);
}

export default {
  createUser,
  validatePassword,
  getUser,
  setAdmin,
};
