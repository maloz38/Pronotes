import express from "express";
import cors from "cors";
import Pawnote from "pawnote";

const app = express();
app.use(cors());
app.use(express.json());

// URL Pronote de l'établissement
const PRONOTE_URL = "https://0690128P.index-education.net/pronote/eleve.html";

app.post("/api/notes", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Crée une instance Pawnote
    const client = new Pawnote({
      url: PRONOTE_URL,
      username,
      password,
    });

    // Récupère les notes
    const marks = await client.getMarks();

    res.json(marks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Impossible de récupérer les notes." });
  }
});

app.listen(3001, () => {
  console.log("✅ Backend lancé sur http://localhost:3001");
});
