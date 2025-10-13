import { useState } from 'react';

export default function EduConnectLogin({ onSessionReady }) {
  const [loginUrl] = useState(
    'https://educonnect.education.gouv.fr/idp/profile/SAML2/Redirect/SSO?execution=e1s2'
  );

  const openLoginWindow = () => {
    const popup = window.open(loginUrl, 'educonnect-login', 'width=800,height=600');

    const timer = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(timer);
        alert('Fenêtre fermée avant la connexion.');
      }

      try {
        if (popup.location.href.includes('pronote')) {
          onSessionReady({ sessionInfo: 'session-test' }); // simulé pour l’exemple
          popup.close();
          clearInterval(timer);
        }
      } catch (e) {
        // cross-origin : normal
      }
    }, 1000);
  };

  return (
    <div style={{ marginTop: 20 }}>
      <button onClick={openLoginWindow}>
        Se connecter à EduConnect / Pronote
      </button>
    </div>
  );
}
