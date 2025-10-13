import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import pronoteClient from './pronoteClient.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Endpoint pour recevoir session/cookies depuis frontend
app.post('/api/session-ready', async (req, res) => {
  try {
    const { sessionInfo } = req.body; // exemple : token/session
    if (!sessionInfo) return res.status(400).json({ error: 'sessionInfo manquant' });

    // Récupérer les notes via pronoteClient
    const marks = await pronoteClient.getMarks(sessionInfo);

    res.json({ marks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
