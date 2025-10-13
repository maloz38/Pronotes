import { useState } from 'react';

export default function App(){
  const [url,setUrl]=useState('');
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [loading,setLoading]=useState(false);
  const [data,setData]=useState(null);
  const [error,setError]=useState(null);

  async function fetchNotes(){
    setLoading(true); setError(null); setData(null);
    try{
      const res=await fetch('http://localhost:3001/api/fetch',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({url,username,password})
      });
      const json=await res.json();
      if(!res.ok) throw new Error(json.error||'Erreur serveur');
      setData(json);
    }catch(e){setError(String(e));}finally{setLoading(false);}
  }

  return (
    <div style={{maxWidth:900,margin:'40px auto',fontFamily:'Arial,sans-serif'}}>
      <h1>Papillon-clone</h1>
      <div style={{marginBottom:20}}>
        <label>URL Pronote<br/>
          <input value={url} onChange={e=>setUrl(e.target.value)} style={{width:'100%'}} />
        </label>
      </div>
      <div style={{display:'flex',gap:10}}>
        <div style={{flex:1}}>
          <label>Identifiant<br/>
            <input value={username} onChange={e=>setUsername(e.target.value)} style={{width:'100%'}}/>
          </label>
        </div>
        <div style={{flex:1}}>
          <label>Mot de passe<br/>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%'}}/>
          </label>
        </div>
      </div>
      <div style={{marginTop:12}}>
        <button onClick={fetchNotes} disabled={loading}>{loading?'Chargement...':'Récupérer les notes'}</button>
      </div>
      {error && <div style={{color:'crimson',marginTop:12}}>{error}</div>}
      {data && (
        <div style={{marginTop:20}}>
          <h2>Résumé</h2>
          <div>Moyenne générale: {data.aggregates.globalAverage?data.aggregates.globalAverage.toFixed(2):'—'}</div>
          <h3>Par matière</h3>
          <ul>{data.aggregates.subjects.map((s,i)=><li key={i}>{s.subject} — moyenne: {s.average? s.average.toFixed(2):'—'} (coef total: {s.totalCoef}, nb notes: {s.count})</li>)}</ul>
          <h3>Toutes les notes</h3>
          <table border="1" cellPadding="6">
            <thead><tr><th>Matière</th><th>Note</th><th>Coef</th><th>Prof</th><th>Date</th></tr></thead>
            <tbody>{data.marks.map((m,i)=><tr key={i}><td>{m.subject}</td><td>{m.value}</td><td>{m.coef}</td><td>{m.teacher}</td><td>{m.date}</td></tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
