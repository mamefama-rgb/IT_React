// client/src/pages/AdminUsers.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config/constants';

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Rediriger si l'utilisateur n'est pas admin
    if (user && user.role !== 'admin') {
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users`);
        setUsers(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Error fetching users');
        setLoading(false);
      }
    };
    

    fetchUsers();
  }, [user]);

  if (loading) {
    return <div className="loading-spinner">Chargement...</div>;
  }

  return (
    <div className="admin-users-container">
      <h1>Gestion des utilisateurs</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <Link to="/admin/users/add" className="btn btn-primary">
        Ajouter un utilisateur
      </Link>
      
      <div className="users-table">
        <table>
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
                <td>{user._id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link to={`/admin/users/edit/${user._id}`} className="btn btn-sm btn-secondary">
                    Modifier
                  </Link>
                  <button className="btn btn-sm btn-danger">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;