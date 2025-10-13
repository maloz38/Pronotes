// Simule la récupération des notes
async function getMarks(sessionInfo) {
  console.log('Simulated fetch for session:', sessionInfo);
  return [
    { subject: 'Math', value: 15, coef: 2 },
    { subject: 'Français', value: 13, coef: 1 },
    { subject: 'Physique', value: 14, coef: 1 }
  ];
}

export default { getMarks };
