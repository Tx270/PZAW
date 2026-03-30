import { DatabaseSync } from "node:sqlite";
import { randomBytes } from "node:crypto";

const db_path = "./database.sqlite";
const db = new DatabaseSync(db_path, { readBigInts: true });

const SESSION_COOKIE = "__Host-ryba";
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

db.exec(`
  CREATE TABLE IF NOT EXISTS session (
    session_id              INTEGER PRIMARY KEY,
    user_id                 INTEGER,
    created_at              INTEGER
  ) STRICT;
  `);

const db_ops = {
  create_session: db.prepare(
    `INSERT INTO session (session_id, user_id, created_at)
            VALUES (?, ?, ?) RETURNING session_id, user_id, created_at;`
  ),
  get_session: db.prepare(
    "SELECT session_id, user_id, created_at from session WHERE session_id = ?;"
  ),
};

function createSession(user, res) {
  let sessionId = randomBytes(8).readBigInt64BE();
  let createdAt = Date.now();

  let session = db_ops.create_session.get(sessionId, user, createdAt);
  res.locals.session = session;

  res.cookie(SESSION_COOKIE, session.session_id.toString(), {
    maxAge: ONE_WEEK,
    httpOnly: true,
    secure: true,
  });
  return session;
}

function sessionHandler(req, res, next) {
  let sessionId = req.cookies[SESSION_COOKIE];
  let session = null;
  if (sessionId != null) {
    if (!sessionId.match(/^-?[0-9]+$/)) {
      sessionId = null;
    } else {
      sessionId = BigInt(sessionId);
    }
  }

  if (sessionId != null) session = db_ops.get_session.get(sessionId);

  if (session != null) {
    res.locals.session = session;

    res.cookie(SESSION_COOKIE, session.session_id.toString(), {
      maxAge: ONE_WEEK,
      httpOnly: true,
      secure: true,
    });
  } else {
    session = createSession(null, res);
  }

  setImmediate(printUserSession);

  next();

  function printUserSession() {
    console.info(
      "Session:", session.session_id,
      "user:", session.user_id,
      "created at:", new Date(Number(session.created_at)).toISOString()
    );
  }
}

export default {
  createSession,
  sessionHandler,
};
