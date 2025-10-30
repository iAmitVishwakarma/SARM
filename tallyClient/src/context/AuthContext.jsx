import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

// 1. Create the Context
const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To check auth status on load
  const navigate = useNavigate();

  // 3. Check for existing session on app load (from localStorage)
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('sarm_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 4. Login function
  const login = (email, password) => {
    // --- THIS IS MOCK LOGIC ---
    // In a real app, you'd make an API call here
    console.log("Attempting login with:", email, password);
    if (email === 'admin@sarm.com' && password === '1234') {
      const mockUser = {
        email: 'admin@sarm.com',
        shopName: 'Ankit General Store',
        token: 'mock_jwt_token_12345',
      };
      
      setUser(mockUser);
      localStorage.setItem('sarm_user', JSON.stringify(mockUser));
      navigate(ROUTES.DASHBOARD);
    } else {
      alert('Invalid credentials. Try admin@sarm.com and 1234');
    }
  };

  // 5. Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('sarm_user');
    navigate(ROUTES.LOGIN);
  };

  // 6. Provide values to children
  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 2. Export the context itself (for the hook)
export { AuthContext };