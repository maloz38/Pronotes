import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import pronoteClient from './pronoteClient.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Fonction calcul moyenne avec coef
export function moyenneAvecCoef(notes) {
  const bySubject = {};
  for (const n of notes) {
    const subj = n.subject || 'Autres';
    if (!bySubject[subj]) bySubject[subj] = [];
    bySubject[subj].push(n);
  }

  const subjects = [];
  let globalTotal = 0;
  let globalCoef = 0;

  for (const [subject, arr] of Object.entries(bySubject)) {
    let tot = 0;
    let coefSum = 0;
    for (const it of arr) {
      const coef = (typeof it.coef === 'number' && !isNaN(it.coef)) ? it.coef : (it.coefficient ?? 1);
      const value = parseFloat(it.value);
      if (isNaN(value)) continue;
      tot += value * coef;
      coefSum += coef;
    }
    const subjAvg = coefSum > 0 ? tot / coefSum : null;
    subjects.push({ subject, average: subjAvg, totalCoef: coefSum, count: arr.length });
    if (subjAvg !== null) {
      globalTotal += subjAvg * coefSum;
      globalCoef += coefSum;
    }
  }

  const globalAverage = globalCoef > 0 ? globalTotal / globalCoef : null;
  return { subjects, globalAverage, globalCoef };
}

app.post('/api/fetch', async (req, res) => {
  try {
    const { url, username, password } = req.body;
    if (!url || !username || !password) {
      return res.status(400).json({ error: 'url, username et password requis' });
    }

    const session = await pronoteClient.login(url, username, password);
    if (!session) return res.status(500).json({ error: 'Impossible de se connecter à Pronote' });

    const marks = await pronoteClient.getMarks(session);
    const aggregates = moyenneAvecCoef(marks);

    if (typeof pronoteClient.logout === 'function') {
      try { await pronoteClient.logout(session); } catch(e) {}
    }

    return res.json({ marks, aggregates });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err) });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));

export default app;
