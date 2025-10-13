let pronote;
try { pronote = await import('pronote-api'); } catch(e) { pronote = null; }

async function login(url, username, password) {
  if (!pronote) return null;
  try { return await pronote.login(url, username, password); } catch { return null; }
}

async function getMarks(session) {
  if (!session) return [];
  try {
    const rawMarks = await session.marks();
    return rawMarks.map(m => ({
      subject: m.subject || m.matiere || m.discipline,
      value: m.value ?? m.note ?? m.valeur,
      coef: m.coefficient ?? m.coef ?? 1,
      scale: m.scale ?? 20,
      teacher: m.teacher || m.prof || null,
      date: m.date || null,
    }));
  } catch { return []; }
}

async function logout(session) {
  if (session && typeof session.logout === 'function') await session.logout();
}

export default { login, getMarks, logout };
