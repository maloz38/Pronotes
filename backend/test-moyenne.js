import { strict as assert } from 'assert';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const server = await import(`file://${path.join(__dirname,'server.js')}`);
const moyenneAvecCoef = server.moyenneAvecCoef;

function approxEqual(a,b,eps=1e-6){ if(a===null&&b===null)return true; return Math.abs(a-b)<eps; }

const tests=[
  { name:'Simple', notes:[{subject:'Math',value:'15',coef:2},{subject:'Math',value:'13',coef:1}], expectedGlobal:(15*2+13)/3, expectedSubjectAvg:{'Math':(15*2+13)/3} },
  { name:'Non numeric', notes:[{subject:'Hist',value:'A'},{subject:'Hist',value:'16',coef:2}], expectedGlobal:16, expectedSubjectAvg:{'Hist':16} }
];

for(const t of tests){
  const res=moyenneAvecCoef(t.notes);
  console.log(`Test: ${t.name}`,res);
  for(const [subj,expectedAvg] of Object.entries(t.expectedSubjectAvg)){
    const found=res.subjects.find(s=>s.subject===subj);
    if(!found) throw new Error(`${t.name}: ${subj} not found`);
    if(!approxEqual(found.average,expectedAvg)) throw new Error(`${t.name}: ${expectedAvg} != ${found.average}`);
  }
  if(!approxEqual(res.globalAverage,t.expectedGlobal)) throw new Error(`${t.name}: global ${t.expectedGlobal} != ${res.globalAverage}`);
}
console.log('Tous les tests OK');
