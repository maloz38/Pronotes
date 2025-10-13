import express from "express";
import cors from "cors";
import { login } from "pawnote";

const app = express();
app.use(cors());
app.use(express.json());

const PRONOTE_URL = "https://0690128P.index-education.net/pronote/eleve.html";

app.post("/api/notes", async (req, res) => {
  const { username, password } = req.body;

  try {
    const session = await login(PRONOTE_URL, username, password);
    const marks = await session.marks();
    res.json(marks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Impossible de récupérer les notes." });
  }
});

app.listen(3001, () => {
  console.log("✅ Backend lancé sur http://localhost:3001");
});
