// client/src/pages/Dashboard.js
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../config/constants';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    assignedToMe: 0
  });
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier que user existe avant de faire l'appel API
    if (!user || !user._id) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/tickets`);
        
        const tickets = res.data;
        const totalTickets = tickets.length;
        
        // Utiliser les propriétés françaises pour le statut
        const openTickets = tickets.filter(ticket => 
          ['ouvert', 'assigne', 'en-cours'].includes(ticket.statut)
        ).length;
        
        const resolvedTickets = tickets.filter(ticket => 
          ['resolu', 'ferme'].includes(ticket.statut)
        ).length;
        
        const assignedToMe = tickets.filter(ticket => 
          ticket.assigneA && ticket.assigneA._id === user._id
        ).length;
        
        setStats({
          totalTickets,
          openTickets,
          resolvedTickets,
          assignedToMe
        });
        
        // Trier par date de création (propriété française)
        const sortedTickets = tickets.sort((a, b) => 
          new Date(b.creeA) - new Date(a.creeA)
        ).slice(0, 5);
        
        setRecentTickets(sortedTickets);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Fonction pour formater le statut en français
  const formatStatus = (status) => {
    const statusMap = {
      'ouvert': 'Ouvert',
      'assigne': 'Assigné',
      'en-cours': 'En cours',
      'resolu': 'Résolu',
      'ferme': 'Fermé'
    };
    return statusMap[status] || status;
  };

  // Fonction pour formater la priorité
  const formatPriority = (priority) => {
    const priorityMap = {
      '1': 'Critique',
      '2': 'Haute',
      '3': 'Moyenne',
      '4': 'Basse'
    };
    return priorityMap[priority] || `Priorité ${priority}`;
  };

  // Fonction pour obtenir le style de couleur du statut
  const getStatusStyle = (status) => {
    const statusStyles = {
      'ouvert': {
        backgroundColor: '#2e6bccff',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        textAlign: 'center',
        display: 'inline-block',
        minWidth: '80px',
        textTransform: 'uppercase'
      },
      'assigne': {
        backgroundColor: '#bc7b0cff',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        textAlign: 'center',
        display: 'inline-block',
        minWidth: '80px',
        textTransform: 'uppercase'
      },
      'en-cours': {
        backgroundColor: '#d19d19ff',
        color: '#1f2937',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        textAlign: 'center',
        display: 'inline-block',
        minWidth: '80px',
        textTransform: 'uppercase'
      },
      'resolu': {
        backgroundColor: '#21b181ff',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        textAlign: 'center',
        display: 'inline-block',
        minWidth: '80px',
        textTransform: 'uppercase'
      },
      'ferme': {
        backgroundColor: '#6b7280',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        textAlign: 'center',
        display: 'inline-block',
        minWidth: '80px',
        textTransform: 'uppercase'
      }
    };

    // Style par défaut si le statut n'est pas trouvé
    const defaultStyle = {
      backgroundColor: '#6b7280',
      color: 'white',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      textAlign: 'center',
      display: 'inline-block',
      minWidth: '80px',
      textTransform: 'uppercase'
    };

    return statusStyles[status?.toLowerCase()] || defaultStyle;
  };

  // Vérifier si user existe
  if (!user) {
    return <div className="loading-spinner">Chargement des données utilisateur...</div>;
  }

  if (loading) {
    return <div className="loading-spinner">Chargement...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Tableau de bord</h1>
      <div className="welcome-message">
        <h2>Bonjour, {user?.username || 'Utilisateur'}</h2>
        <p>
          {user?.role === 'admin' && 'Administrateur'}
          {user?.role === 'technician' && 'Technicien'}
          {user?.role === 'user' && 'Utilisateur'}
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total des tickets</h3>
          <p className="stat-number">{stats.totalTickets}</p>
        </div>

        <div className="stat-card">
          <h3>Tickets ouverts</h3>
          <p className="stat-number">{stats.openTickets}</p>
        </div>

        <div className="stat-card">
          <h3>Tickets résolus</h3>
          <p className="stat-number">{stats.resolvedTickets}</p>
        </div>

        {(user?.role === 'technician' || user?.role === 'admin') && (
          <div className="stat-card">
            <h3>Assignés à moi</h3>
            <p className="stat-number">{stats.assignedToMe}</p>
          </div>
        )}
      </div>

      <div className="action-buttons">
        <Link to="/tickets/create" className="btn btn-primary">
          Créer un ticket
        </Link>
        <Link to="/tickets" className="btn btn-secondary">
          Voir tous les tickets
        </Link>
      </div>

      <div className="recent-tickets">
        <h3>Tickets récents</h3>
        {recentTickets.length > 0 ? (
          <div className="tickets-list">
            {recentTickets.map(ticket => (
              <div key={ticket._id} className="ticket-card">
                <div className="ticket-header">
                  <h4>
                    <Link to={`/tickets/${ticket._id}`}>
                      {ticket.titre || 'Titre non disponible'}
                    </Link>
                  </h4>
                  <span style={getStatusStyle(ticket.statut)}>
                    {formatStatus(ticket.statut)}
                  </span>
                </div>
                <div className="ticket-meta">
                  <p>ID: {ticket._id.substring(0, 8)}</p>
                  <p>{formatPriority(ticket.priorite)}</p>
                  {ticket.categorie && <p>Catégorie: {ticket.categorie}</p>}
                </div>
                <p className="ticket-desc">
                  {ticket.description ? 
                    `${ticket.description.substring(0, 100)}...` : 
                    'Description non disponible'
                  }
                </p>
                <div className="ticket-footer">
                  <span>
                    Créé par: {ticket.creePar?.username || 'Utilisateur inconnu'}
                  </span>
                  <span>
                    {ticket.creeA ? 
                      new Date(ticket.creeA).toLocaleDateString('fr-FR') : 
                      'Date non disponible'
                    }
                  </span>
                </div>
                {ticket.assigneA && (
                  <div className="ticket-assigned">
                    <span>Assigné à: {ticket.assigneA.username}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>Aucun ticket récent</p>
        )}
      </div>

      {user?.role === 'admin' && (
        <div className="admin-actions">
          <h3>Actions administratives</h3>
          <Link to="/admin/users" className="btn btn-primary">
            Gérer les utilisateurs
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;