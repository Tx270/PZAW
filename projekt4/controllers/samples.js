import multer from "multer";
import sample from "../models/sample.js";
import user from "../models/user.js";

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimetypes = ["audio/mpeg", "audio/wav", "audio/ogg"];
    if (allowedMimetypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only MP3, WAV, and OGG are allowed."), false);
    }
  },
});

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

function samples_get(req, res) {
  const search = req.query.q;

  let samples;
  if (search && search.trim() !== "") {
    samples = sample.search.all(`%${search}%`);
  } else {
    samples = sample.all.all();
  }

  res.render("samples", { samples, q: search });
}

function sample_get(req, res) {
  const s = sample.get.get(req.params.id);
  if (!s) return res.status(404).send("File not found");

  let isAdmin = false;
  if (res.locals.session?.user_id != null) {
    const u = user.getUser(Number(res.locals.session.user_id));
    isAdmin = u?.is_admin === 1;
  }

  res.render("details", { sample: s, isAdmin });
}

function random_get(_req, res) {
  const row = sample.random.get();
  if (!row) return res.status(404).send("No samples found");
  res.redirect("/samples/" + row.id);
}

function play_get(req, res) {
  const s = sample.get.get(req.params.id);
  if (!s || !s.data) {
    return res.status(404).send("File not found");
  }
  res.setHeader("Content-Type", s.mimetype);
  res.send(s.data);
}

function download_get(req, res) {
  const s = sample.get.get(req.params.id);
  if (!s || !s.data) {
    return res.status(404).send("File not found");
  }
  res.setHeader("Content-Disposition", `attachment; filename="${s.name}"`);
  res.setHeader("Content-Type", s.mimetype);
  res.send(s.data);
}

function upload_get(req, res) {
  if (res.locals.session?.user_id == null) {
    return res.redirect("/auth/login");
  }
  res.render("upload", { error: null });
}

function upload_post(req, res) {
  if (res.locals.session?.user_id == null) {
    return res.redirect("/auth/login");
  }
  const { name, author, key, tempo, description } = req.body;
  if (!name || !author || !key || !tempo || !req.file) {
    return res.render("upload", { error: "Missing required fields" });
  }
  sample.insert.run(
    name,
    author,
    key,
    parseInt(tempo),
    description || null,
    req.file.buffer,
    req.file.mimetype,
    Number(res.locals.session.user_id)
  );
  res.redirect("/samples");
}

function delete_get(req, res) {
  const s = requireOwner(req, res);
  if (!s) return;
  sample.delete.run(s.id);
  res.redirect("/samples");
}

function edit_get(req, res) {
  const s = requireOwner(req, res);
  if (!s) return;
  res.render("edit", { sample: s });
}

function edit_post(req, res) {
  const s = requireOwner(req, res);
  if (!s) return;
  const { name, author, key, tempo, description } = req.body;
  if (!name || !author || !key || !tempo) {
    return res.status(400).send("Missing required fields");
  }
  sample.update.run(
    name,
    author,
    key,
    parseInt(tempo),
    description || null,
    s.id
  );
  res.redirect("/samples/" + s.id);
}

export default {
  upload_get,
  upload_post,
  samples_get,
  sample_get,
  random_get,
  play_get,
  download_get,
  delete_get,
  edit_get,
  edit_post,
  upload,
};
