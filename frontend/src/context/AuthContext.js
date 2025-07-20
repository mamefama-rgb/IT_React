// client/src/context/AuthContext.js
import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { authReducer } from './authReducer';
import { API_URL } from '../config/constants';
import setAuthToken from '../utils/setAuthToken';

// Initial state
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  user: null,
  error: null
};

// Create context
export const AuthContext = createContext(initialState);


// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

// Dans AuthProvider component
useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      console.log("Token from localStorage:", storedToken ? "Exists" : "Not found");
      
      if (storedToken) {
        setAuthToken(storedToken);
        
        try {
          const res = await axios.get(`${API_URL}/api/auth/user`);
          console.log("User loaded successfully:", res.data);
  
          dispatch({
            type: 'USER_LOADED',
            payload: res.data
          });
        } catch (err) {
          console.error("Error loading user:", err);
          dispatch({ type: 'AUTH_ERROR' });
        }
      } else {
        console.log("No token found, user not authenticated");
        dispatch({ type: 'AUTH_ERROR' });
      }
    };
  
    loadUser();
  }, []);
  // Register user
const register = async (userData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
  
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, userData, config);
  
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data
      });
  
      loadUser();
    } catch (err) {
      dispatch({
        type: 'REGISTER_FAIL',
        payload: err.response && err.response.data ? err.response.data.message : 'Erreur lors de l\'inscription'
      });
    }
  };

  // Login user
const login = async (userData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
  
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, userData, config);
      
      console.log("Login response:", res.data); // Debug: vérifier la réponse
      
      // Stockage du token dans localStorage
      localStorage.setItem('token', res.data.token);
      
      // Mise à jour du state via le reducer
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data
      });
  
      // Chargement des données utilisateur
      loadUser();
    } catch (err) {
      console.error("Login error:", err);
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response && err.response.data ? err.response.data.message : 'Erreur lors de la connexion'
      });
    }
  };

  // Logout
  const logout = () => dispatch({ type: 'LOGOUT' });

  // Clear errors
  const clearErrors = () => dispatch({ type: 'CLEAR_ERRORS' });

  // Load user function
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await axios.get(`${API_URL}/api/auth/user`);

      dispatch({
        type: 'USER_LOADED',
        payload: res.data
      });
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        login,
        logout,
        clearErrors,
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
  
};
