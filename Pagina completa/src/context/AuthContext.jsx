// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const API_URL = 'http://localhost:3000/api/auth';

  useEffect(() => {
    // Verificar si hay token y usuario en localStorage al cargar
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, contrasena: password }),
      });

      const data = await response.json();

      if (data.success) {
        const { user, token, userType } = data.data;
        setUser({ ...user, userType });
        setToken(token);
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ ...user, userType }));
        
        return { 
          success: true,
          data: data.data 
        };
      } else {
        // Devuelve todos los campos de error para manejar bloqueos e intentos
        return { 
          success: false, 
          message: data.message,
          attemptsLeft: data.attemptsLeft,
          locked: data.locked,
          remainingTime: data.remainingTime
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'Error de conexión con el servidor' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};