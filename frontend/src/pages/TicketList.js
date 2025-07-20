// client/src/pages/TicketList.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/constants';
import { AuthContext } from '../context/AuthContext';

const TicketList = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    statut: '',
    priorite: '',
    recherche: ''
  });
  const [statistiques, setStatistiques] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/tickets`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-auth-token': token
          }
        });
        setTickets(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération des tickets:', err);
        setLoading(false);
      }
    };

    const fetchStatistiques = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/tickets/statistiques-priorites`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-auth-token': token
          }
        });
        setStatistiques(res.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des statistiques:', err);
      }
    };

    fetchTickets();
    if (user?.role === 'admin') {
      fetchStatistiques();
    }
  }, [user]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleDeleteTicket = async (ticketId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce ticket ?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/api/tickets/${ticketId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-auth-token': token
          }
        });
        
        console.log('Suppression réussie:', response.data);
        
        // Mettre à jour la liste des tickets après suppression
        setTickets(tickets.filter(ticket => ticket._id !== ticketId));
        alert('Ticket supprimé avec succès');
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        console.error('Erreur de réponse:', err.response?.data);
        
        const errorMessage = err.response?.data?.message || 'Erreur lors de la suppression du ticket';
        alert(errorMessage);
      }
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    // Filtrer par statut
    if (filters.statut && ticket.statut !== filters.statut) {
      return false;
    }
    
    // Filtrer par priorité
    if (filters.priorite && ticket.priorite !== filters.priorite) {
      return false;
    }
    
    // Filtrer par recherche
    if (filters.recherche) {
      const searchTerm = filters.recherche.toLowerCase();
      return (
        ticket.titre.toLowerCase().includes(searchTerm) ||
        ticket.description.toLowerCase().includes(searchTerm) ||
        ticket._id.toLowerCase().includes(searchTerm) ||
        ticket.categorie.toLowerCase().includes(searchTerm)
      );
    }
    
    return true;
  });

  // Fonction pour vérifier si l'utilisateur peut supprimer un ticket
  const canDeleteTicket = (ticket) => {
    if (!user || !ticket.creePar) {
      return false;
    }
    
    return (
      ticket.creePar._id === user._id ||
      user.role === 'admin'
    );
  };

  // Fonction pour obtenir la couleur de la priorité
  const getPrioriteColor = (priorite) => {
    switch (priorite) {
      case 'critique': return '#ff4444';
      case 'haute': return '#ff8800';
      case 'moyenne': return '#9f6b04ff';
      case 'basse': return '#19b619ff';
      default: return '#666666';
    }
  };

  // Fonction pour obtenir la couleur du statut
  const getStatutColor = (statut) => {
    switch (statut) {
      case 'ouvert': return '#2196f3';
      case 'assigne': return '#ceab76ff';
      case 'en_cours': return '#9c27b0';
      case 'resolu': return '#4caf50';
      case 'ferme': return '#607d8b';
      default: return '#666666';
    }
  };

  // Fonction pour traduire les statuts
  const traduireStatut = (statut) => {
    switch (statut) {
      case 'ouvert': return 'Ouvert';
      case 'assigne': return 'Assigné';
      case 'en_cours': return 'En cours';
      case 'resolu': return 'Résolu';
      case 'ferme': return 'Fermé';
      default: return statut;
    }
  };

  // Fonction pour traduire les priorités
  const traduirePriorite = (priorite) => {
    switch (priorite) {
      case 'basse': return 'Basse';
      case 'moyenne': return 'Moyenne';
      case 'haute': return 'Haute';
      case 'critique': return 'Critique';
      default: return priorite;
    }
  };

  if (!user) {
    return <div className="loading-spinner">Chargement des données utilisateur...</div>;
  }

  if (loading) {
    return <div className="loading-spinner">Chargement...</div>;
  }

  return (
    <div className="ticket-list-container">
      <div className="ticket-list-header">
        <h1>Liste des tickets</h1>
        <Link to="/tickets/create" className="btn btn-primary">
          Créer un ticket
        </Link>
      </div>

      {/* Statistiques pour l'admin */}
      {user.role === 'admin' && statistiques && (
        <div className="statistiques-container">
          <h3>📊 Statistiques des priorités</h3>
          <div className="stats-grid">
            {statistiques.map((stat, index) => (
              <div key={index} className="stat-card">
                <div 
                  className="stat-color" 
                  style={{ backgroundColor: getPrioriteColor(stat._id) }}
                ></div>
                <div className="stat-content">
                  <span className="stat-label">{traduirePriorite(stat._id)}</span>
                  <span className="stat-value">{stat.nombre}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="statut">Statut:</label>
          <select
            name="statut"
            id="statut"
            value={filters.statut}
            onChange={handleFilterChange}
          >
            <option value="">Tous</option>
            <option value="ouvert">Ouvert</option>
            <option value="assigne">Assigné</option>
            <option value="en_cours">En cours</option>
            <option value="resolu">Résolu</option>
            <option value="ferme">Fermé</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="priorite">Priorité:</label>
          <select
            name="priorite"
            id="priorite"
            value={filters.priorite}
            onChange={handleFilterChange}
          >
            <option value="">Toutes</option>
            <option value="basse">Basse</option>
            <option value="moyenne">Moyenne</option>
            <option value="haute">Haute</option>
            <option value="critique">Critique</option>
          </select>
        </div>

        <div className="filter-group search-group">
          <input
            type="text"
            name="recherche"
            placeholder="Rechercher un ticket..."
            value={filters.recherche}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {filteredTickets.length > 0 ? (
        <div className="tickets-table-container">
          <table className="tickets-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Titre</th>
                <th>Catégorie</th>
                <th>Statut</th>
                <th>Priorité</th>
                <th>Créé par</th>
                <th>Assigné à</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map(ticket => (
                <tr key={ticket._id}>
                  <td>{ticket._id.substring(0, 8)}</td>
                  <td>
                    <div className="ticket-title">
                      {ticket.titre}
                
                    </div>
                  </td>
                  <td>{ticket.categorie}</td>
                  <td>
                    <span 
                      className="status-badge" 
                      style={{ backgroundColor: getStatutColor(ticket.statut) }}
                    >
                      {traduireStatut(ticket.statut)}
                    </span>
                  </td>
                  <td>
                    <span 
                      className="priority-badge" 
                      style={{ backgroundColor: getPrioriteColor(ticket.priorite) }}
                    >
                      {traduirePriorite(ticket.priorite)}
                    </span>
                  </td>
                  <td>{ticket.creePar?.username || 'Utilisateur inconnu'}</td>
                  <td>
                    {ticket.assigneA?.username || 'Non assigné'}
                  </td>
                  <td>{new Date(ticket.creeA).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/tickets/${ticket._id}`} className="btn btn-sm">
                        Voir
                      </Link>
                      {canDeleteTicket(ticket) && (
                        <button
                          onClick={() => handleDeleteTicket(ticket._id)}
                          className="btn btn-sm btn-danger"
                          style={{ marginLeft: '5px' }}
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-tickets">
          <p>Aucun ticket ne correspond à vos critères</p>
        </div>
      )}

      <style jsx>{`
        .ticket-list-container {
          padding: 20px;
        }

        .ticket-list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .statistiques-container {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .statistiques-container h3 {
          margin-top: 0;
          color: #333;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }

        .stat-card {
          background: white;
          border-radius: 8px;
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .stat-color {
          width: 4px;
          height: 40px;
          border-radius: 2px;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
        }

        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }

        .filters-container {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .filter-group label {
          font-weight: bold;
          color: #333;
          font-size: 14px;
        }

        .filter-group select,
        .filter-group input {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .search-group {
          flex: 1;
          min-width: 200px;
        }

        .tickets-table-container {
          overflow-x: auto;
        }

        .tickets-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border-radius: 8px;
          overflow: hidden;
        }

        .tickets-table th,
        .tickets-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        .tickets-table th {
          background: #f8f9fa;
          font-weight: bold;
          color: #333;
        }

        .tickets-table tr:hover {
          background: #f8f9fa;
        }

        .ticket-title {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .mots-cles {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
        }

        .mot-cle-badge {
          background: #e3f2fd;
          color: #1976d2;
          padding: 2px 6px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: bold;
        }

        .status-badge,
        .priority-badge {
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
        }

        .impact-badge,
        .urgence-badge {
          background: #e0e0e0;
          color: #333;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
        }

        .action-buttons {
          display: flex;
          gap: 5px;
        }

        .btn {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          text-decoration: none;
          display: inline-block;
          text-align: center;
        }

        .btn-primary {
          background-color: #2196f3;
          color: white;
        }

        .btn-sm {
          background-color: #6c757d;
          color: white;
        }

        .btn-danger {
          background-color: #dc3545;
          color: white;
        }

        .btn:hover {
          opacity: 0.8;
        }

        .no-tickets {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .loading-spinner {
          text-align: center;
          padding: 40px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default TicketList;