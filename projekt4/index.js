import express from "express";
import expressLayouts from "express-ejs-layouts";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import auth from "./controllers/auth.js";
import sample from "./models/sample.js";
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
function requireOwner(req, res) {
  if (res.locals.session?.user_id == null) {
    res.redirect("/auth/login");
    return null;
  }
  const s = sample.get.get(req.params.id);
  if (!s) {
    res.status(404).send("Sample not found");
    return null;
  }
  const u = user.getUser(Number(res.locals.session.user_id));
  const isOwner = Number(s.user_id) === Number(res.locals.session.user_id);
  const isAdmin = u?.is_admin === 1;
  if (!isOwner && !isAdmin) {
    res.status(403).send("Forbidden");
    return null;
  }
  return s;
}

// to lista wszystkich sampli z filtrowaniem po search query
app.get("/samples", (req, res) => {
    const search = req.query.q;

    let samples;
    if (search && search.trim() !== "") {
        samples = sample.search.all(`%${search}%`);
    } else {
        samples = sample.all.all();
    }

    res.render("samples", { samples, q: search });
});

// to widok szczegółowy dla sampla
app.get("/samples/:id", (req, res) => {
    const s = sample.get.get(req.params.id);
    if (!s) return res.status(404).send("File not found");

    let isAdmin = false;
    if (res.locals.session?.user_id != null) {
      const u = user.getUser(Number(res.locals.session.user_id));
      isAdmin = u?.is_admin === 1;
    }

    res.render("details", { sample: s, isAdmin });
});

// obsługa wyboru losowego sampla bo czemu nie
app.get("/random", (_req, res) => {
    const row = sample.random.get();
    if (!row) return res.status(404).send("No samples found");
    res.redirect("/samples/" + row.id);
});

// strona urzytkownika
app.get("/profile", (req, res) => {
  if (res.locals.session?.user_id == null) {
    return res.redirect("/auth/login");
  }
  const u = user.getUser(res.locals.session.user_id);
  res.render("profile", { user: u });
});

// TODO: dodać faktyczne przechowywanie plików audio
app.get("/samples/:id/play", (req, res) => {
    const s = sample.get.get(req.params.id);
    if (!s || !s.file_path) {
        return res.status(404).send("File not found");
    }
    res.setHeader("Content-Type", "audio/wav");
    res.sendFile(s.file, { root: "." });
});

app.get("/samples/:id/download", (req, res) => {
    const s = sample.get.get(req.params.id);
    if (!s || !s.file) {
        return res.status(404).send("File not found");
    }
    res.download(s.file, req.params.id, { root: "." }, err => {
        if (err) {
            console.error(err);
            return res.status(500).send("Download failed");
        }
    });
});

app.get("/upload", (req, res) => {
  if (res.locals.session?.user_id == null) {
    return res.redirect("/auth/login");
  }
  res.render("upload");
});

app.post("/upload", (req, res) => {
  if (res.locals.session?.user_id == null) {
    return res.redirect("/auth/login");
  }
  const { name, author, key, tempo, description } = req.body;
  if (!name || !author || !key || !tempo) {
      return res.status(400).send("Missing required fields");
  }
  sample.insert.run(name, author, key, parseInt(tempo), description || null, Number(res.locals.session.user_id));
  res.redirect("/samples");
});

app.get("/samples/:id/delete", (req, res) => {
  const s = requireOwner(req, res);
  if (!s) return;
  sample.delete.run(s.id);
  res.redirect("/samples");
});

app.get("/samples/:id/edit", (req, res) => {
  const s = requireOwner(req, res);
  if (!s) return;
  res.render("edit", { sample: s });
});

app.post("/samples/:id/edit", (req, res) => {
  const s = requireOwner(req, res);
  if (!s) return;
  const { name, author, key, tempo, description } = req.body;
  if (!name || !author || !key || !tempo) {
    return res.status(400).send("Missing required fields");
  }
  sample.update.run(name, author, key, parseInt(tempo), description || null, s.id);
  res.redirect("/samples/" + s.id);
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
