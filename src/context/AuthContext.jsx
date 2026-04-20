import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchUserProfile();
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('auth/profile/');
      setUser(response.data);
    } catch (error) {
      // Only force logout on 401 Unauthorized (invalid/expired token)
      // Network errors, server restarts, 500s should NOT clear the session
      if (error.response?.status === 401) {
        logout();
      } else {
        console.warn("Profile fetch failed (network or server issue), keeping session:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = (newToken, userData) => {
    setToken(newToken);
    if (userData) {
      setUser(userData);
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
