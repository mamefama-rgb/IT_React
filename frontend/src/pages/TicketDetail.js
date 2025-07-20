// client/src/pages/TicketDetail.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/constants';
import { AuthContext } from '../context/AuthContext';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [ticket, setTicket] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [resolveMode, setResolveMode] = useState(false);
  const [showResolution, setShowResolution] = useState(false); // Nouvel état pour afficher la résolution
  
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    statut: '',
    priorite: '',
    categorie: '',
    assigneA: ''
  });
  
  const [resolveData, setResolveData] = useState({
    solutionDescription: '',
    tempsPasseTotal: '',
    causeRacine: '',
    typeResolution: 'reparation',
    etapesResolution: ''
  });
  
  const [comment, setComment] = useState('');

  // Fonction pour obtenir les styles des statuts
  const getStatusStyle = (statut) => {
    const styles = {
      'ouvert': { backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fbbf24' },
      'assigne': { backgroundColor: '#dbeafe', color: '#1e40af', border: '1px solid #3b82f6' },
      'en-cours': { backgroundColor: '#fed7d7', color: '#c53030', border: '1px solid #f56565' },
      'resolu': { backgroundColor: '#d1fae5', color: '#065f46', border: '1px solid #10b981' },
      'ferme': { backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #9ca3af' }
    };
    return styles[statut] || styles['ouvert'];
  };

  // Fonction pour obtenir les styles des priorités
  const getPriorityStyle = (priorite) => {
    const styles = {
      'critique': { backgroundColor: '#fecaca', color: '#991b1b', border: '1px solid #ef4444' },
      'haute': { backgroundColor: '#fed7aa', color: '#9a3412', border: '1px solid #f97316' },
      'moyenne': { backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #eab308' },
      'basse': { backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #22c55e' }
    };
    return styles[priorite] || styles['moyenne'];
  };
  
  useEffect(() => {
    if (!user) return;
    
    const fetchTicket = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/tickets/${id}`);
        setTicket(res.data);
        setFormData({
          titre: res.data.titre || '',
          description: res.data.description || '',
          statut: res.data.statut || '',
          priorite: res.data.priorite || '',
          categorie: res.data.categorie || '',
          assigneA: res.data.assigneA ? res.data.assigneA._id : ''
        });
        
        // Préremplir les données de résolution si elles existent
        if (res.data.resolution) {
          setResolveData({
            solutionDescription: res.data.resolution.solutionDescription || '',
            tempsPasseTotal: res.data.resolution.tempsPasseTotal || '',
            causeRacine: res.data.resolution.causeRacine || '',
            typeResolution: res.data.resolution.typeResolution || 'reparation',
            etapesResolution: res.data.resolution.etapesResolution || ''
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching ticket:', err);
        setError(err.response?.data?.message || 'Error fetching ticket');
        setLoading(false);
      }
    };
    
    const fetchUsers = async () => {
      if (user.role === 'admin' || user.role === 'technician') {
        try {
          const res = await axios.get(`${API_URL}/api/users/technicians`);
          setUsers(res.data);
        } catch (err) {
          console.error('Error fetching users:', err);
        }
      }
    };
    
    fetchTicket();
    fetchUsers();
  }, [id, user]);
  
  const handleInputChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleResolveInputChange = e => {
    setResolveData({
      ...resolveData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async e => {
    e.preventDefault();
    
    try {
      const res = await axios.put(`${API_URL}/api/tickets/${id}`, formData);
      setTicket(res.data);
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating ticket');
    }
  };
  
  const handleResolveSubmit = async e => {
    e.preventDefault();
    
    try {
      const dataToSend = {
        ...resolveData,
        tempsPasseTotal: parseInt(resolveData.tempsPasseTotal) || 0,
        statut: 'resolu'
      };
      
      const res = await axios.put(`${API_URL}/api/tickets/${id}/resolve`, dataToSend);
      setTicket(res.data);
      setResolveMode(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error resolving ticket');
    }
  };
  
  const handleAddComment = async e => {
    e.preventDefault();
    
    if (!comment.trim()) return;
    
    try {
      const res = await axios.post(`${API_URL}/api/tickets/${id}/comments`, {
        texte: comment
      });
      setTicket(res.data);
      setComment('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding comment');
    }
  };
  
  const handleDeleteTicket = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce ticket ?')) {
      try {
        await axios.delete(`${API_URL}/api/tickets/${id}`);
        navigate('/tickets');
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting ticket');
      }
    }
  };
  
  if (!user || loading) {
    return <div className="loading-spinner">Chargement...</div>;
  }
  
  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/tickets')}
        >
          Retour à la liste des tickets
        </button>
      </div>
    );
  }
  
  if (!ticket) {
    return <div>Ticket non trouvé</div>;
  }

  const canResolve = (user.role === 'admin' || user.role === 'technician') && 
                     ticket.statut !== 'resolu' && ticket.statut !== 'ferme';

  const hasResolution = ticket.resolution && ticket.resolution.solutionDescription;

  return (
    <div className="ticket-detail-container">
      <div className="ticket-detail-header">
        <button 
          className="btn btn-sm" 
          onClick={() => navigate('/tickets')}
        >
          &larr; Retour
        </button>
        
        <div className="ticket-actions">
          {!editMode && !resolveMode && (user.role === 'admin' || 
                        (ticket.creePar && ticket.creePar._id === user._id) || 
                        (ticket.assigneA && ticket.assigneA._id === user._id)) && (
            <button 
              className="btn btn-primary" 
              onClick={() => setEditMode(true)}
            >
              Modifier
            </button>
          )}
          
          {!editMode && !resolveMode && canResolve && (
            <button 
              className="btn btn-success" 
              onClick={() => setResolveMode(true)}
            >
              Résoudre
            </button>
          )}

          {/* Nouveau bouton pour voir la résolution */}
          {!editMode && !resolveMode && hasResolution && (
            <button 
              className="btn btn-info" 
              onClick={() => setShowResolution(!showResolution)}
            >
              {showResolution ? 'Masquer la résolution' : 'Voir la résolution'}
            </button>
          )}
          
          {(editMode || resolveMode) && (
            <button 
              className="btn btn-secondary" 
              onClick={() => {
                setEditMode(false);
                setResolveMode(false);
              }}
            >
              Annuler
            </button>
          )}
          
          {(user.role === 'admin' || (ticket.creePar && ticket.creePar._id === user._id)) && (
            <button 
              className="btn btn-danger" 
              onClick={handleDeleteTicket}
            >
              Supprimer
            </button>
          )}
        </div>
      </div>
      
      {resolveMode ? (
        <form onSubmit={handleResolveSubmit} className="ticket-resolve-form">
          <h2>Résolution du ticket</h2>
          
          <div className="form-group">
            <label htmlFor="solutionDescription">Description de la solution *</label>
            <textarea
              name="solutionDescription"
              id="solutionDescription"
              value={resolveData.solutionDescription}
              onChange={handleResolveInputChange}
              required
              rows="4"
              placeholder="Décrivez la solution appliquée..."
            ></textarea>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="typeResolution">Type de résolution</label>
              <select
                name="typeResolution"
                id="typeResolution"
                value={resolveData.typeResolution}
                onChange={handleResolveInputChange}
              >
                <option value="reparation">Réparation</option>
                <option value="configuration">Configuration</option>
                <option value="remplacement">Remplacement</option>
                <option value="formation">Formation</option>
                <option value="workaround">Contournement</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="tempsPasseTotal">Temps passé (minutes)</label>
              <input
                type="number"
                name="tempsPasseTotal"
                id="tempsPasseTotal"
                value={resolveData.tempsPasseTotal}
                onChange={handleResolveInputChange}
                min="0"
                placeholder="120"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="causeRacine">Cause racine</label>
            <textarea
              name="causeRacine"
              id="causeRacine"
              value={resolveData.causeRacine}
              onChange={handleResolveInputChange}
              rows="3"
              placeholder="Quelle était la cause principale du problème ?"
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="etapesResolution">Étapes de résolution</label>
            <textarea
              name="etapesResolution"
              id="etapesResolution"
              value={resolveData.etapesResolution}
              onChange={handleResolveInputChange}
              rows="4"
              placeholder="Décrivez les étapes suivies pour résoudre le problème..."
            ></textarea>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              Marquer comme résolu
            </button>
          </div>
        </form>
      ) : editMode ? (
        <form onSubmit={handleSubmit} className="ticket-edit-form">
          <div className="form-group">
            <label htmlFor="titre">Titre</label>
            <input
              type="text"
              name="titre"
              id="titre"
              value={formData.titre}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="5"
            ></textarea>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="statut">Statut</label>
              <select
                name="statut"
                id="statut"
                value={formData.statut}
                onChange={handleInputChange}
              >
                <option value="ouvert">Ouvert</option>
                <option value="assigne">Assigné</option>
                <option value="en-cours">En cours</option>
                <option value="resolu">Résolu</option>
                <option value="ferme">Fermé</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="priorite">Priorité</label>
              <select
                name="priorite"
                id="priorite"
                value={formData.priorite}
                onChange={handleInputChange}
              >
                <option value="critique">Critique</option>
                <option value="haute">Haute</option>
                <option value="moyenne">Moyenne</option>
                <option value="basse">Basse</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="categorie">Catégorie</label>
            <input
              type="text"
              name="categorie"
              id="categorie"
              value={formData.categorie}
              onChange={handleInputChange}
              required
            />
          </div>
          
          {(user.role === 'admin' || user.role === 'technician') && (
            <div className="form-group">
              <label htmlFor="assigneA">Assigné à</label>
              <select
                name="assigneA"
                id="assigneA"
                value={formData.assigneA || ''}
                onChange={handleInputChange}
              >
                <option value="">Non assigné</option>
                {users.map(technicien => (
                  <option key={technicien._id} value={technicien._id}>
                    {technicien.username}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Enregistrer
            </button>
          </div>
        </form>
      ) : (
        <div className="ticket-detail-content">
          <div className="ticket-main-info">
            <h1>{ticket.titre}</h1>
            
            <div className="ticket-meta">
              <div className="ticket-id">
                ID: <span>{ticket._id}</span>
              </div>
              
              <div className="ticket-badges">
                <span 
                  className="status-badge" 
                  style={{
                    ...getStatusStyle(ticket.statut),
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    display: 'inline-block'
                  }}
                >
                  {ticket.statut}
                </span>
                <span 
                  className="priority-badge" 
                  style={{
                    ...getPriorityStyle(ticket.priorite),
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    display: 'inline-block',
                    marginLeft: '8px'
                  }}
                >
                  {ticket.priorite}
                </span>
              </div>
            </div>
            
            <div className="ticket-category">
              Catégorie: <span>{ticket.categorie}</span>
            </div>
            
            <div className="ticket-description">
              <h3>Description</h3>
              <p>{ticket.description}</p>
            </div>
            
            {/* Section Résolution - Affichée uniquement si showResolution est true */}
            {showResolution && hasResolution && (
              <div className="ticket-resolution" style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                padding: '20px',
                marginTop: '20px'
              }}>
                <h3 style={{ 
                  color: '#28a745', 
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{ marginRight: '8px' }}>✅</span>
                  Résolution du ticket
                </h3>
                <div className="resolution-info">
                  <div className="resolution-item" style={{ marginBottom: '12px' }}>
                    <span className="label" style={{ fontWeight: 'bold', color: '#495057' }}>Solution:</span>
                    <p style={{ margin: '5px 0', color: '#6c757d' }}>{ticket.resolution.solutionDescription}</p>
                  </div>
                  
                  {ticket.resolution.typeResolution && (
                    <div className="resolution-item" style={{ marginBottom: '12px' }}>
                      <span className="label" style={{ fontWeight: 'bold', color: '#495057' }}>Type:</span>
                      <span style={{ 
                        marginLeft: '8px',
                        padding: '2px 8px',
                        backgroundColor: '#e9ecef',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}>{ticket.resolution.typeResolution}</span>
                    </div>
                  )}
                  
                  {ticket.resolution.tempsPasseTotal && (
                    <div className="resolution-item" style={{ marginBottom: '12px' }}>
                      <span className="label" style={{ fontWeight: 'bold', color: '#495057' }}>Temps passé:</span>
                      <span style={{ 
                        marginLeft: '8px',
                        color: '#007bff',
                        fontWeight: '600'
                      }}>{ticket.resolution.tempsPasseTotal} minutes</span>
                    </div>
                  )}
                  
                  {ticket.resolution.causeRacine && (
                    <div className="resolution-item" style={{ marginBottom: '12px' }}>
                      <span className="label" style={{ fontWeight: 'bold', color: '#495057' }}>Cause racine:</span>
                      <p style={{ margin: '5px 0', color: '#6c757d' }}>{ticket.resolution.causeRacine}</p>
                    </div>
                  )}
                  
                  {ticket.resolution.etapesResolution && (
                    <div className="resolution-item" style={{ marginBottom: '12px' }}>
                      <span className="label" style={{ fontWeight: 'bold', color: '#495057' }}>Étapes:</span>
                      <p style={{ margin: '5px 0', color: '#6c757d' }}>{ticket.resolution.etapesResolution}</p>
                    </div>
                  )}
                  
                  {ticket.resolution.dateResolution && (
                    <div className="resolution-item" style={{ marginBottom: '12px' }}>
                      <span className="label" style={{ fontWeight: 'bold', color: '#495057' }}>Date de résolution:</span>
                      <span style={{ 
                        marginLeft: '8px',
                        color: '#28a745',
                        fontWeight: '600'
                      }}>{new Date(ticket.resolution.dateResolution).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="ticket-sidebar">
            <div className="ticket-info-box">
              <h3>Informations</h3>
              
              <div className="info-item">
                <span className="label">Créé par:</span>
                <span>{ticket.creePar?.username || 'Utilisateur inconnu'}</span>
              </div>
              
              <div className="info-item">
                <span className="label">Date de création:</span>
                <span>{ticket.creeA ? new Date(ticket.creeA).toLocaleString() : 'N/A'}</span>
              </div>
              
              <div className="info-item">
                <span className="label">Dernière mise à jour:</span>
                <span>{ticket.modifieA ? new Date(ticket.modifieA).toLocaleString() : 'N/A'}</span>
              </div>
              
              <div className="info-item">
                <span className="label">Assigné à:</span>
                <span>
                  {ticket.assigneA?.username || 'Non assigné'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="ticket-comments">
        <h3>Commentaires ({ticket.commentaires?.length || 0})</h3>
        
        <form onSubmit={handleAddComment} className="comment-form">
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Ajouter un commentaire..."
            rows="3"
            required
          ></textarea>
          <button type="submit" className="btn btn-primary">
            Commenter
          </button>
        </form>
        
        <div className="comments-list">
          {ticket.commentaires && ticket.commentaires.length > 0 ? (
            ticket.commentaires.map((commentaire, index) => (
              <div key={index} className="comment">
                <div className="comment-header">
                  <span className="comment-author">
                    {commentaire.creePar?.username || 'Utilisateur inconnu'}
                  </span>
                  <span className="comment-date">
                    {commentaire.creeA ? new Date(commentaire.creeA).toLocaleString() : 'N/A'}
                  </span>
                </div>
                <div className="comment-body">{commentaire.texte}</div>
              </div>
            ))
          ) : (
            <p className="no-comments">Pas encore de commentaires</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;