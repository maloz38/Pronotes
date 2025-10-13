import { useState } from "react";

export default function App() {
  const [data, setData] = useState(null);

  async function fetchNotes() {
    const res = await fetch("https://ton-backend-url.onrender.com/api/fetch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: "https://demo.pronote.net",
        username: "mock",
        password: "mock"
      }),
    });
    const json = await res.json();
    setData(json);
  }

  return (
    <div style={{ padding: 20 }}>
      <button onClick={fetchNotes}>Récupérer mes notes</button>
      {data && (
        <div>
          <h2>Moyenne générale: {data.aggregates.globalAverage}</h2>
          <ul>
            {data.aggregates.subjects.map((s,i) => (
              <li key={i}>{s.subject} — {s.average}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
