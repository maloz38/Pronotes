// backend/pronoteClient.js
// Stub fonctionnel pour récupérer des notes
export default {
  async login(url, username, password) {
    // Ici tu peux brancher la vraie lib Pronote plus tard
    console.log("login mock", url, username);
    return {};
  },
  async getMarks(session) {
    return [
      { subject: "Math", value: 15, coef: 2 },
      { subject: "Français", value: 14, coef: 1 },
      { subject: "Physique", value: 12, coef: 1 },
    ];
  },
  async logout(session) {
    console.log("logout mock");
  },
};
