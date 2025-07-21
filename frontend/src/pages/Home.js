// client/src/pages/Home.js
import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Bienvenue sur Ticket It</h1>
        <p className="hero-text">
          Un système de gestion de tickets simple et efficace pour votre entreprise
        </p>
        <div className="hero-buttons">
          <Link to="/faq" className="btn btn-info">
            📖 Base de connaissances
          </Link>
          <Link to="/register" className="btn btn-primary">
            Créer un compte
          </Link>
          <Link to="/login" className="btn btn-secondary">
            Se connecter
          </Link>
        </div>
      </div>

      <div className="features-section">
        <h2>Fonctionnalités</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Gestion de tickets</h3>
            <p>
              Créez, suivez et gérez facilement vos tickets de support 
              avec un système organisé.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Différents rôles</h3>
            <p>
              Définissez des rôles pour les utilisateurs, les techniciens 
              et les administrateurs avec des accès spécifiques.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Commentaires et suivi</h3>
            <p>
              Communiquez facilement sur les tickets avec des commentaires 
              et suivez l'historique des tickets.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Tableau de bord</h3>
            <p>
              Consultez des statistiques claires sur vos tickets et l'activité 
              de votre équipe de support.
            </p>
          </div>
        </div>
      </div>
      
      {/* Nouvelle section pour la FAQ */}
      <div className="quick-help-section">
        <h2>Besoin d'aide immédiate ?</h2>
        <div className="quick-help-content">
          <div className="help-text">
            <h3>💡 Consultez notre base de connaissances</h3>
            <p>
              Trouvez rapidement des solutions aux problèmes les plus courants 
              sans avoir besoin de créer un compte : problèmes d'imprimante, 
              WiFi, mots de passe, et bien plus encore.
            </p>
            <Link to="/faq" className="btn btn-info btn-large">
              📖 Accéder à la FAQ
            </Link>
          </div>
          <div className="help-preview">
            <h4>Problèmes fréquents :</h4>
            <ul className="common-issues">
              <li>🖨️ Panne d'imprimante</li>
              <li>🔐 Mot de passe oublié</li>
              <li>📡 Problème WiFi</li>
              <li>🗄️ Accès base de données</li>
              <li>💻 Ordinateur lent</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="how-it-works">
        <h2>Comment ça marche</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Consultez la FAQ</h3>
            <p>Vérifiez d'abord notre base de connaissances pour une solution rapide.</p>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <h3>Créez un compte</h3>
            <p>Si nécessaire, inscrivez-vous et créez votre profil utilisateur.</p>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <h3>Soumettez un ticket</h3>
            <p>Décrivez votre problème ou demande en détail.</p>
          </div>
          
          <div className="step">
            <div className="step-number">4</div>
            <h3>Suivi et résolution</h3>
            <p>Suivez l'avancement et interagissez avec les techniciens jusqu'à la résolution.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;