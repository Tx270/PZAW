import express from "express";
import expressLayouts from "express-ejs-layouts";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import getDB from "./db.js";
import auth from "./controllers/auth.js";
import session from "./models/session.js";
import user from "./models/user.js";

const app = express();

const port = process.env.PORT || 8000;
const SECRET = process.env.SECRET;
if (SECRET == null) {
  console.error(
    `SECRET environment variable missing.
     Please create an env file or provide SECRET via environment variables.`,
  );
  process.exit(1);
}

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");
app.use(express.static("public"));
app.use(express.urlencoded());
app.use(morgan("dev"));
app.use(cookieParser(SECRET));
app.use(express.urlencoded({ extended: true }));
app.set("views", "views");
app.use(session.sessionHandler);

const authRouter = express.Router();
authRouter.get("/login",   auth.login_get);
authRouter.post("/login",  auth.login_post);
authRouter.get("/signup",  auth.signup_get);
authRouter.post("/signup", auth.signup_post);
authRouter.get("/logout",  auth.logout);
app.use("/auth", authRouter);

app.get("/", (_req, res) => {
    res.redirect("/samples");
});


// helper zwracjący sample jeśli należy do zalogowanego użytkownika
async function requireOwner(req, res) {
  if (res.locals.session?.user_id == null) {
    res.redirect("/auth/login");
    return null;
  }
  const db = await getDB();
  const sample = await db.get("SELECT * FROM samples WHERE id = ?", [req.params.id]);
  if (!sample) {
    res.status(404).send("Sample not found");
    return null;
  }

  const u = user.getUser(Number(res.locals.session.user_id));
  const isOwner = Number(sample.user_id) === Number(res.locals.session.user_id);
  const isAdmin = u?.is_admin === 1;

  if (!isOwner && !isAdmin) {
    res.status(403).send("Forbidden");
    return null;
  }
  return sample;
}


// to lista wszystkich sampli z filtrowaniem po search query
app.get("/samples", async (req, res) => {
    const db = await getDB();
    const search = req.query.q;

    let samples;

    if (search && search.trim() !== "") {
        samples = await db.all(
            "SELECT * FROM samples WHERE name LIKE ? ORDER BY created_at DESC",
            [`%${search}%`]
        );
    } else {
        samples = await db.all(
            "SELECT * FROM samples ORDER BY created_at DESC"
        );
    }

    res.render("samples", { samples, q: search });
});


// to widok szczegółowy dla sampla
app.get("/samples/:id", async (req, res) => {
    const db = await getDB();
    const sample = await db.get("SELECT * FROM samples WHERE id = ?", [req.params.id]);

    if (!sample) return res.status(404).send("File not found");

    let isAdmin = false;
    if (res.locals.session?.user_id != null) {
      const u = user.getUser(Number(res.locals.session.user_id));
      isAdmin = u?.is_admin === 1;
    }

    res.render("details", { sample, isAdmin });
});


// obsługa wyboru losowego sampla bo czemu nie
app.get("/random", async (_req, res) => {
    const db = await getDB();
    const row = await db.get(
        "SELECT id FROM samples ORDER BY RANDOM() LIMIT 1;"
    );

    if (!row) return res.status(404).send("No samples found");

    res.redirect("/samples/" + row.id);
});


// strona urzytkownika
app.get("/profile", async (req, res) => {
  if (res.locals.session?.user_id == null) {
    return res.redirect("/auth/login");
  }
  const u = user.getUser(res.locals.session.user_id);
  res.render("profile", { user: u });
});


// w odtwarzaniu i pobieraniu dodałem już obsługę faktycznych sampli ale same upload i przechowywanie plików zrobię w ramach projektu 3
app.get("/samples/:id/play", async (req, res) => {
    const db = await getDB();
    const id = req.params.id;

    const sample = await db.get(
        "SELECT * FROM samples WHERE id = ?",
        [id]
    );

    if (!sample || !sample.file_path) {
        return res.status(404).send("File not found");
    }

    res.setHeader("Content-Type", "audio/wav");

    res.sendFile(sample.file, { root: "." });
});


app.get("/samples/:id/download", async (req, res) => {
    const db = await getDB();
    const id = req.params.id;

    const sample = await db.get(
        "SELECT * FROM samples WHERE id = ?",
        [id]
    );

    if (!sample || !sample.file) {
        return res.status(404).send("File not found");
    }

    res.download(sample.file, id, { root: "." }, err => {
        if (err) {
            console.error(err);
            return res.status(500).send("Download failed");
        }
    });
});


app.get("/upload", async (_req, res) => {
  if (res.locals.session?.user_id == null) {
    return res.redirect("/auth/login");
  }
  res.render("upload");
});

app.post("/upload", async (req, res) => {
  if (res.locals.session?.user_id == null) {
    return res.redirect("/auth/login");
  }
  try {
      const db = await getDB();

      const { name, author, key, tempo, description } = req.body;

      if (!name || !author || !key || !tempo) {
          return res.status(400).send("Missing required fields");
      }

      await db.run(
          `INSERT INTO samples (name, author, key, tempo, description, created_at, user_id)
           VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`,
          [name, author, key, parseInt(tempo), description || null, Number(res.locals.session.user_id)]
      );

      res.redirect("/samples");

  } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
  }
});


app.get("/samples/:id/delete", async (req, res) => {
  try {
    const sample = await requireOwner(req, res);
    if (!sample) return;

    const db = await getDB();
    await db.run("DELETE FROM samples WHERE id = ?", [sample.id]);
    res.redirect("/samples");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/samples/:id/edit", async (req, res) => {
  try {
    const sample = await requireOwner(req, res);
    if (!sample) return;

    res.render("edit", { sample });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/samples/:id/edit", async (req, res) => {
  try {
    const sample = await requireOwner(req, res);
    if (!sample) return;

    const { name, author, key, tempo, description } = req.body;
    if (!name || !author || !key || !tempo) {
      return res.status(400).send("Missing required fields");
    }

    const db = await getDB();
    await db.run(
      `UPDATE samples SET name = ?, author = ?, key = ?, tempo = ?, description = ? WHERE id = ?`,
      [name, author, key, parseInt(tempo), description || null, sample.id]
    );
    res.redirect("/samples/" + sample.id);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
