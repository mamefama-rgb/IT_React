// client/src/components/layout/Navbar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/');
  };

  const authLinks = (
    <ul className="nav-links">
      <li>
        <Link to="/dashboard">Tableau de bord</Link>
      </li>
      <li>
        <Link to="/tickets">Tickets</Link>
      </li>
      {user && user.role === 'admin' && (
        <>
          <li>
            <Link to="/admin/users">Utilisateurs</Link>
          </li>
        </>

      )}
      <li>
        <span className="user-info">
          {user && user.username} ({user && user.role})
        </span>
      </li>
      <li>
        <a href="#!" onClick={onLogout} className="logout-btn">
          Déconnexion
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul className="nav-links">
      <li>
        <Link to="/login">Connexion</Link>
      </li>
      <li>
        <Link to="/register">Inscription</Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <span className="brand-text">Ticket It</span>
        </Link>
      </div>
      {isAuthenticated ? authLinks : guestLinks}
    </nav>
  );
};

export default Navbar;