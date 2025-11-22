import React, { useState } from "react";

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchNotes = async () => {
    setLoading(true);
    setError("");
    setData(null);

    try {
      // Determine backend URL based on environment or default to localhost
      // In production (Render), this should be relative if served by the same origin,
      // or a specific URL environment variable.
      // For now, we keep localhost:3001 as per previous config, but ideally this should be configurable.
      const API_URL = "http://localhost:3001/api/notes";

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const jsonData = await res.json();
        setData(jsonData);
      } else {
        const errData = await res.json();
        setError(errData.error || "Erreur de connexion");
      }
    } catch (err) {
      setError("Impossible de contacter le serveur.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Pronotes - Branly (Via EduConnect)</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Identifiant EduConnect"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button onClick={fetchNotes} disabled={loading} style={{ padding: "5px 10px" }}>
          {loading ? "Chargement..." : "Récupérer mes notes"}
        </button>
      </div>

      {error && <div style={{ color: "red", marginBottom: "20px" }}>{error}</div>}

      {data && (
        <div>
          <h2>Bonjour {data.user}</h2>

          <div style={{ padding: "10px", background: "#f0f0f0", borderRadius: "5px", marginBottom: "20px" }}>
            <h3>Moyenne Générale Calculée : {data.average >= 0 ? data.average + "/20" : "N/A"}</h3>
            <small>(Calcul basé sur les notes récupérées et leurs coefficients)</small>
          </div>

          <h3>Détail des notes :</h3>
          {data.grades && data.grades.length > 0 ? (
            <table border="1" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#ddd" }}>
                  <th style={{ padding: "8px" }}>Matière</th>
                  <th style={{ padding: "8px" }}>Note</th>
                  <th style={{ padding: "8px" }}>Sur</th>
                  <th style={{ padding: "8px" }}>Coef</th>
                  <th style={{ padding: "8px" }}>Date</th>
                  <th style={{ padding: "8px" }}>Commentaire</th>
                </tr>
              </thead>
              <tbody>
                {data.grades.map((g, index) => (
                  <tr key={index}>
                    <td style={{ padding: "8px" }}>{g.subject}</td>
                    <td style={{ padding: "8px", fontWeight: "bold" }}>{g.grade}</td>
                    <td style={{ padding: "8px" }}>{g.out_of}</td>
                    <td style={{ padding: "8px" }}>{g.coefficient}</td>
                    <td style={{ padding: "8px" }}>{g.date}</td>
                    <td style={{ padding: "8px" }}>{g.comment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Aucune note trouvée.</p>
          )}
        </div>
      )}
    </div>
  );
}
