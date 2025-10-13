import express from "express";
import cors from "cors";
import PronoteApi from "@dorian-eydoux/pronote-api"; // nouvelle lib

const app = express();
app.use(cors());
app.use(express.json());

// URL Pronote du lycée Edouard Branly
const PRONOTE_URL = "https://0690128P.index-education.net/pronote/eleve.html";

app.post("/api/notes", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "username et password requis" });
  }

  try {
    const session = await PronoteApi.login(PRONOTE_URL, username, password);
    const marksRaw = await session.marks();

    // On normalise les notes pour renvoyer JSON simple
    const marks = marksRaw.map((m) => ({
      subject: m.subject || m.matiere,
      value: m.value ?? m.note,
      coef: m.coefficient ?? m.coef ?? 1,
      date: m.date ?? null,
      teacher: m.teacher ?? m.prof ?? null,
    }));

    res.json({ marks });

    // Déconnexion de la session
    if (typeof session.logout === "function") await session.logout();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Impossible de récupérer les notes." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend lancé sur http://localhost:${PORT}`);
});
