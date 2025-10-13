import React, { useState } from "react";

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notes, setNotes] = useState(null);

  const fetchNotes = async () => {
    const res = await fetch("http://localhost:3001/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      setNotes(data);
    } else {
      alert("Erreur de connexion");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Pronotes - Branly</h1>

      <div>
        <input
          type="text"
          placeholder="Identifiant EduConnect"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={fetchNotes}>Récupérer mes notes</button>
      </div>

      <a
        href="https://cas.ent.auvergnerhonealpes.fr/login?service=https:%2F%2F0690128P.index-education.net%2Fpronote%2Feleve.html"
        target="_blank"
      >
        📲 Se connecter avec ÉduConnect
      </a>

      {notes && (
        <div>
          <h2>Mes notes :</h2>
          <pre>{JSON.stringify(notes, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
