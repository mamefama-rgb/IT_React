// client/src/pages/CreateTicket.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/constants';

const CreateTicket = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    categorie: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [prioriteInfo, setPrioriteInfo] = useState(null);

  const { titre, description, categorie } = formData;

  const categories = [
    'Système critique',
    'Réseau',
    'Serveur', 
    'Sécurité',
    'Base de données',
    'Email',
    'Logiciel',
    'Matériel informatique',
    'Téléphonie',
    'Imprimante',
    'Compte utilisateur',
    'Formation',
    'Autre'
  ];

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Réinitialiser l'info de priorité quand le contenu change
    if (prioriteInfo) {
      setPrioriteInfo(null);
    }
  };

  // Fonction pour prévisualiser la priorité automatique
  const previsualiserPriorite = async () => {
    if (!titre || !description || !categorie) {
      setError('Veuillez remplir tous les champs pour prévisualiser la priorité');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/api/tickets/preview-priorite`, {
        titre,
        description,
        categorie
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token
        }
      });
      
      setPrioriteInfo(res.data);
      setError('');
    } catch (err) {
      setError('Erreur lors de la prévisualisation');
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    if (!titre || !description || !categorie) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/api/tickets`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token
        }
      });
      
      // Afficher un message de succès avec les informations d'assignation
      if (res.data.message) {
        alert(res.data.message);
      }
      
      navigate(`/tickets/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
      setLoading(false);
    }
  };

  const getPrioriteColor = (priorite) => {
    switch (priorite) {
      case 'critique': return '#9b0f0fff';
      case 'haute': return '#ff8800';
      case 'moyenne': return '#ac8535ff';
      case 'basse': return '#00aa00';
      default: return '#666666';
    }
  };

  return (
    <div className="create-ticket-container">
      <h1>Créer un nouveau ticket</h1>
      
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={onSubmit} className="ticket-form">
        <div className="form-group">
          <label htmlFor="titre">Titre*</label>
          <input
            type="text"
            name="titre"
            id="titre"
            value={titre}
            onChange={onChange}
            required
          />
          <small className="help-text">
            Utilisez des mots comme "urgent", "critique", "bloquant" pour indiquer l'urgence
          </small>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description*</label>
          <textarea
            name="description"
            id="description"
            value={description}
            onChange={onChange}
            required
            rows="6"
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="categorie">Catégorie*</label>
          <select
            name="categorie"
            id="categorie"
            value={categorie}
            onChange={onChange}
            required
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>

        </div>

        {/* Bouton de prévisualisation */}
        <div className="form-group">
          <button 
            type="button" 
            className="btn btn-info"
            onClick={previsualiserPriorite}
            disabled={!titre || !description || !categorie}
          >
            📊 Prévisualiser la priorité automatique
          </button>
        </div>

        {/* Affichage de la priorité prévue */}
        {prioriteInfo && (
          <div className="priority-preview">
            <h3>🎯 Priorité calculée automatiquement</h3>
            <div className="priority-info">
              <div className="priority-badge" style={{ backgroundColor: getPrioriteColor(prioriteInfo.priorite) }}>
                Priorité: {prioriteInfo.priorite.toUpperCase()}
              </div>
              <div className="priority-details">
                <p><strong>Impact:</strong> {prioriteInfo.impact}</p>
                <p><strong>Urgence:</strong> {prioriteInfo.urgence}</p>
                {prioriteInfo.motsClesDetectes && prioriteInfo.motsClesDetectes.length > 0 && (
                  <p><strong>Mots-clés détectés:</strong> {prioriteInfo.motsClesDetectes.join(', ')}</p>
                )}
              </div>
            </div>
            <small className="help-text">
              Cette priorité sera appliquée automatiquement lors de la création du ticket
            </small>
          </div>
        )}
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/tickets')}
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Création en cours...' : 'Créer le ticket'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .create-ticket-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .info-box {
          background: #e3f2fd;
          border: 1px solid rgb(2, 39, 70);
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
        }

        .info-box h3 {
          margin-top: 0;
          color:rgb(3, 43, 84);
        }

        .info-box ul {
          margin: 10px 0;
          padding-left: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #333;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 120px;
        }

        .help-text {
          color: #666;
          font-size: 12px;
          margin-top: 5px;
          display: block;
        }

        .priority-preview {
          background: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
        }

        .priority-preview h3 {
          margin-top: 0;
          color: #333;
        }

        .priority-info {
          display: flex;
          align-items: center;
          gap: 15px;
          margin: 10px 0;
        }

        .priority-badge {
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 14px;
        }

        .priority-details {
          flex: 1;
        }

        .priority-details p {
          margin: 5px 0;
          font-size: 14px;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 30px;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s;
        }

        .btn-primary {
          background-color:rgb(10, 102, 232);
          color: white;
        }

        .btn-primary:hover {
          background-color: #2c3e50;
        }

        .btn-secondary {
          background-color: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background-color: #5a6268;
        }

        .btn-info {
          background-color: #2c3e50;
          color: white;
        }

        .btn-info:hover {
          background-color: #138496;
        }

        .btn:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .alert {
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .alert-danger {
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
        }
      `}</style>
    </div>
  );
};

export default CreateTicket;