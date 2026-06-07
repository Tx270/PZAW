import express from "express";
import expressLayouts from "express-ejs-layouts";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import auth from "./controllers/auth.js";
import sample from "./models/sample.js";
import session from "./models/session.js";
import user from "./models/user.js";
import samples from "./controllers/samples.js";

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
authRouter.get("/login", auth.login_get);
authRouter.post("/login", auth.login_post);
authRouter.get("/signup", auth.signup_get);
authRouter.post("/signup", auth.signup_post);
authRouter.get("/logout", auth.logout);
app.use("/auth", authRouter);

const samplesRouter = express.Router();
samplesRouter.get("/", samples.samples_get);
samplesRouter.get("/random", samples.random_get);
samplesRouter.get("/upload", samples.upload_get);
samplesRouter.post("/upload", (req, res, next) => {
  samples.upload.single("sample")(req, res, (err) => {
    if (err) {
      return res.render("upload", { error: err.message });
    }
    next();
  });
}, samples.upload_post);
samplesRouter.get("/:id", samples.sample_get);
samplesRouter.get("/:id/play", samples.play_get);
samplesRouter.get("/:id/download", samples.download_get);
samplesRouter.post("/:id/delete", samples.delete_post);
samplesRouter.get("/:id/edit", samples.edit_get);
samplesRouter.post("/:id/edit", samples.edit_post);
app.use("/samples", samplesRouter);

app.get("/", (_req, res) => {
  res.redirect("/samples");
});

// strona urzytkownika
app.get("/profile", (req, res) => {
  if (res.locals.session?.user_id == null) {
    return res.redirect("/auth/login");
  }
  const u = user.getUser(res.locals.session.user_id);
  res.render("profile", { user: u });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
