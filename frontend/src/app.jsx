import { useState } from "react";

export default function App() {
  const [url, setUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState(null);

  async function fetchNotes() {
    const res = await fetch("https://ton-backend-url.onrender.com/api/fetch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, username, password }),
    });
    const json = await res.json();
    setData(json);
  }

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Pronotes — récupération des notes</h1>
      <div>
        <label>URL Pronote<br />
          <input value={url} onChange={e => setUrl(e.target.value)} style={{ width: "100%" }} />
        </label>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Identifiant" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" />
      </div>
      <button style={{ marginTop: 10 }} onClick={fetchNotes}>Récupérer mes notes</button>

      {data && (
        <div style={{ marginTop: 20 }}>
          <h2>Moyenne générale: {data.aggregates.globalAverage}</h2>
          <ul>
            {data.aggregates.subjects.map((s, i) => (
              <li key={i}>{s.subject}: {s.average} (coef total {s.totalCoef})</li>
            ))}
          </ul>
          <h3>Toutes les notes:</h3>
          <ul>
            {data.marks.map((m,i) => <li key={i}>{m.subject}: {m.value} (coef {m.coef})</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
