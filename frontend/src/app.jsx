import { useState } from 'react';
import EduConnectLogin from './EduConnectLogin.jsx';

export default function App() {
  const [marks, setMarks] = useState(null);

  const handleSessionReady = async ({ sessionInfo }) => {
    try {
      const res = await fetch('http://localhost:3001/api/session-ready', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionInfo })
      });
      const json = await res.json();
      setMarks(json.marks);
    } catch (e) {
      console.error(e);
      alert('Erreur récupération notes');
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Pronotes — Récupération des notes</h1>
      <EduConnectLogin onSessionReady={handleSessionReady} />

      {marks && (
        <div style={{ marginTop: 20 }}>
          <h2>Notes récupérées</h2>
          <ul>
            {marks.map((m, i) => (
              <li key={i}>{m.subject} — note: {m.value} (coef: {m.coef})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
