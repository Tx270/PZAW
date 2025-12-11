import express from "express";
import expressLayouts from "express-ejs-layouts";
import { getDB } from "./db.js";

const port = 8000;

const app = express();

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("views", "views");


app.get("/", (_req, res) => {
    res.redirect("/samples");
});


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
    const id = req.params.id;

    const sample = await db.get(
        "SELECT * FROM samples WHERE id = ?",
        [id]
    );

    if (!sample) {
        return res.status(404).send("File not found");
    }

    res.render("details", { sample });
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
    res.render("upload");
});

app.post("/upload", async (req, res) => {
    try {
        const db = await getDB();

        const { name, author, key, tempo, description } = req.body;

        if (!name || !author || !key || !tempo) {
            return res.status(400).send("Missing required fields");
        }

        await db.run(
            `INSERT INTO samples (name, author, key, tempo, description, created_at)
             VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
            [name, author, key, parseInt(tempo), description || null]
        );

        res.redirect("/samples");

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});


app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
