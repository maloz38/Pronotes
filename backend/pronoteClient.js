// backend/pronoteClient.js (exemple avec une lib fictive pronote-api)
import pronote from "pronote-api";

export default {
  async login(url, username, password) {
    const session = await pronote.login(url, username, password);
    return session;
  },
  async getMarks(session) {
    const rawMarks = await session.marks(); // dépend de la lib exacte
    return rawMarks.map(m => ({
      subject: m.subject,
      value: m.value,
      coef: m.coef ?? 1,
      teacher: m.teacher,
      date: m.date,
    }));
  },
  async logout(session) {
    if (session.logout) await session.logout();
  }
};
