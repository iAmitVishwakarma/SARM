import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import axios from 'axios'; // <-- Import axios

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session using the 'jwt' cookie
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // Humne naya '/api/auth/profile' route banaya tha
        const { data } = await axios.get('/api/auth/profile');
        setUser(data);
      } catch (error) {
        setUser(null);
        console.log('No user session found');
      } finally {
        setLoading(false);
      }
    };
    checkUserStatus();
  }, []);

  // Login function - Ab API call karega
  const login = async (email, password) => {
    try {
      // Backend ko data bhejein
      const { data } = await axios.post('/api/auth/login', { email, password });
      setUser(data);
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      alert('Invalid email or password');
    }
  };

  // Logout function - Ab API call karega
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };