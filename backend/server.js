import express from "express";
import cors from "cors";
import Pawnote from "pawnote"; // pawnote est compatible ES module

const app = express();
app.use(cors());
app.use(express.json());

// URL Pronote du lycée Édouard Branly
const PRONOTE_URL = "https://0690128P.index-education.net/pronote/eleve.html";

app.post("/api/notes", async (req, res) => {
  const { username, password } = req.body;

  try {
    const session = await Pawnote.login(PRONOTE_URL, username, password);
    const marks = await session.marks();
    res.json(marks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Impossible de récupérer les notes." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend lancé sur port ${PORT}`);
});
