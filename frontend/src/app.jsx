import { useState } from "react";

export default function App() {
  const [text, setText] = useState("Bienvenue sur Papillon-clone !");
  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>{text}</h1>
      <p>Le frontend fonctionne correctement sur Render.</p>
    </div>
  );
}
