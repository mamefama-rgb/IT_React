// client/src/components/routing/RoleRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const RoleRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, loading, user } = useContext(AuthContext);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return isAuthenticated && user && allowedRoles.includes(user.role) 
    ? children 
    : <Navigate to="/dashboard" />;
};

export default RoleRoute;