// client/src/App.js

import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import PrivateRoute from './components/routing/PrivateRoute';
import RoleRoute from './components/routing/RoleRoute';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TicketList from './pages/TicketList';
import TicketDetail from './pages/TicketDetail';
import CreateTicket from './pages/CreateTicket';
import UserManagement from './pages/UserManagement';
import NotFound from './pages/NotFound';
import AdminPanel from './pages/AdminPanel';
import Chatbot from './pages/Chatbot';
import FAQ from './pages/FAQ';

import './App.css';

// Composant interne pour avoir accès au contexte
const AppContent = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/faq" element={<FAQ />} />
            
            {/* Routes protégées */}
            
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/tickets" 
              element={
                <PrivateRoute>
                  <TicketList />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/tickets/create" 
              element={
                <PrivateRoute>
                  <CreateTicket />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/tickets/:id" 
              element={
                <PrivateRoute>
                  <TicketDetail />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/admin/users" 
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <UserManagement />
                </RoleRoute>
              } 
            />
            
            <Route
              path="/chatbot"
              element={
                <PrivateRoute>
                  <Chatbot />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin-panel"
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <AdminPanel />
                </RoleRoute>
              }
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Chatbot seulement si l'utilisateur est connecté et les données sont chargées */}
        {!loading && isAuthenticated && <Chatbot />}

        <Footer />
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;