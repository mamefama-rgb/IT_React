// client/src/pages/UserManagement.js (Admin only)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/constants';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [editFormData, setEditFormData] = useState({
    username: '',
    email: '',
    role: 'user',
    password: '' // Optionnel pour la modification
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditInputChange = e => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddUser = async e => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/api/users`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers([...users, res.data]);
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'user'
      });
      setShowAddUser(false);
      setError(''); // Effacer les erreurs précédentes
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding user');
    }
  };

  const handleEditUser = user => {
    setEditingUser(user);
    setEditFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      password: '' // Laisser vide, sera optionnel
    });
    setShowEditUser(true);
    setError(''); // Effacer les erreurs précédentes
  };

  const handleUpdateUser = async e => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      
      // Créer l'objet de données à envoyer (sans le mot de passe s'il est vide)
      const updateData = {
        username: editFormData.username,
        email: editFormData.email,
        role: editFormData.role
      };
      
      // Ajouter le mot de passe seulement s'il est fourni
      if (editFormData.password.trim()) {
        updateData.password = editFormData.password;
      }

      const res = await axios.put(`${API_URL}/api/users/${editingUser._id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Mettre à jour la liste des utilisateurs
      setUsers(users.map(user => 
        user._id === editingUser._id ? res.data : user
      ));
      
      // Fermer le formulaire
      setShowEditUser(false);
      setEditingUser(null);
      setEditFormData({
        username: '',
        email: '',
        role: 'user',
        password: ''
      });
      setError(''); // Effacer les erreurs précédentes
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating user');
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/api/users/${userId}`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
      setError(''); // Effacer les erreurs précédentes
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating user role');
    }
  };

  const handleDeleteUser = async userId => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(users.filter(user => user._id !== userId));
        setError(''); // Effacer les erreurs précédentes
      } catch (err) {
        console.error('Erreur détaillée:', err.response);
        setError(err.response?.data?.message || 'Error deleting user');
      }
    }
  };

  const cancelEdit = () => {
    setShowEditUser(false);
    setEditingUser(null);
    setEditFormData({
      username: '',
      email: '',
      role: 'user',
      password: ''
    });
    setError('');
  };

  if (loading) {
    return <div className="loading-spinner">Chargement...</div>;
  }

  return (
    <div className="user-management-container">
      <h1>Gestion des utilisateurs</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="user-management-actions">
        <button 
          className="btn btn-primary" 
          onClick={() => setShowAddUser(!showAddUser)}
        >
          {showAddUser ? 'Annuler' : 'Ajouter un utilisateur'}
        </button>
      </div>
      
      {/* Formulaire d'ajout d'utilisateur */}
      {showAddUser && (
        <div className="add-user-form-container">
          <h3>Ajouter un nouvel utilisateur</h3>
          <form onSubmit={handleAddUser} className="add-user-form">
            <div className="form-group">
              <label htmlFor="username">Nom d'utilisateur</label>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="role">Rôle</label>
              <select
                name="role"
                id="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="user">Utilisateur</option>
                <option value="technician">Technicien</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
            
            <button type="submit" className="btn btn-primary">
              Ajouter
            </button>
          </form>
        </div>
      )}

      {/* Formulaire de modification d'utilisateur */}
      {showEditUser && editingUser && (
        <div className="edit-user-modal">
          <div className="modal-overlay" onClick={cancelEdit}></div>
          <div className="modal-content">
            <h3>Modifier l'utilisateur</h3>
            <form onSubmit={handleUpdateUser} className="edit-user-form">
              <div className="form-group">
                <label htmlFor="edit-username">Nom d'utilisateur</label>
                <input
                  type="text"
                  name="username"
                  id="edit-username"
                  value={editFormData.username}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="edit-email"
                  value={editFormData.email}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-password">Nouveau mot de passe (optionnel)</label>
                <input
                  type="password"
                  name="password"
                  id="edit-password"
                  value={editFormData.password}
                  onChange={handleEditInputChange}
                  placeholder="Laissez vide pour garder l'ancien"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-role">Rôle</label>
                <select
                  name="role"
                  id="edit-role"
                  value={editFormData.role}
                  onChange={handleEditInputChange}
                >
                  <option value="user">Utilisateur</option>
                  <option value="technician">Technicien</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Modifier
                </button>
                <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Tableau des utilisateurs */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom d'utilisateur</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Date d'inscription</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user._id.substring(0, 8)}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={e => handleUpdateRole(user._id, e.target.value)}
                    className="role-select"
                  >
                    <option value="user">Utilisateur</option>
                    <option value="technician">Technicien</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-info" 
                    onClick={() => handleEditUser(user)}
                    style={{ marginRight: '5px' }}
                  >
                    Modifier
                  </button>
                  <button 
                    className="btn btn-sm btn-danger" 
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;