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
      
      <div className="how-it-works">
        <h2>Comment ça marche</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Créez un compte</h3>
            <p>Inscrivez-vous et créez votre profil utilisateur.</p>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <h3>Soumettez un ticket</h3>
            <p>Décrivez votre problème ou demande en détail.</p>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <h3>Suivi en temps réel</h3>
            <p>Suivez l'avancement de votre ticket et interagissez avec les techniciens.</p>
          </div>
          
          <div className="step">
            <div className="step-number">4</div>
            <h3>Résolution</h3>
            <p>Recevez une solution à votre problème et fermez le ticket.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
