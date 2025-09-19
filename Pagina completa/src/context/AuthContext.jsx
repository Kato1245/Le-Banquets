// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const API_URL = 'http://localhost:3000/api/auth';

  // Función para verificar token
  const verifyToken = async (tokenToVerify) => {
    try {
      const response = await fetch(`${API_URL}/verify`, {
        headers: {
          'Authorization': `Bearer ${tokenToVerify}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return { valid: true, user: data.data.user };
      } else {
        const errorData = await response.json();
        return { 
          valid: false, 
          message: errorData.message || 'Token inválido' 
        };
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      return { 
        valid: false, 
        message: 'Error de conexión al verificar token' 
      };
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          // Verificar si el token es válido
          const verification = await verifyToken(storedToken);
          
          if (verification.valid) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          } else {
            // Token inválido, limpiar almacenamiento
            console.log('Token inválido al cargar:', verification.message);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
          }
        } catch (error) {
          console.error('Error checking auth:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuth();
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
        const { user: userData, token: newToken, userType } = data.data;
        
        // Verificar que el token recibido sea válido
        const verification = await verifyToken(newToken);
        if (!verification.valid) {
          toast.error('Error de autenticación. Token inválido.');
          return { 
            success: false, 
            message: 'Error de autenticación. Token inválido.' 
          };
        }

        setUser({ ...userData, userType });
        setToken(newToken);
        
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify({ ...userData, userType }));
        
        toast.success('¡Inicio de sesión exitoso!');
        return { 
          success: true,
          data: data.data 
        };
      } else {
        toast.error(data.message || 'Error al iniciar sesión');
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
      toast.error('Error de conexión con el servidor');
      return { 
        success: false, 
        message: 'Error de conexión con el servidor' 
      };
    }
  };

  const signUp = async (email, password, userData, tipo = 'usuario') => {
    try {
      const endpoint = tipo === 'propietario' 
        ? `${API_URL}/register/propietario` 
        : `${API_URL}/register/usuario`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          contrasena: password,
          ...userData
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Registro exitoso. Por favor verifica tu email.');
        return { success: true, message: 'Registro exitoso. Por favor verifica tu email.' };
      } else {
        toast.error(data.message || 'Error en el registro');
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('Error de conexión');
      return { success: false, message: 'Error de conexión' };
    }
  };

  const resetPassword = async (email) => {
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        return { success: true, message: data.message };
      } else {
        toast.error(data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('Error de conexión');
      return { success: false, message: 'Error de conexión' };
    }
  };

  const updatePassword = async (token, newPassword) => {
    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        return { success: true, message: data.message };
      } else {
        toast.error(data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Update password error:', error);
      toast.error('Error de conexión');
      return { success: false, message: 'Error de conexión' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Sesión cerrada correctamente');
  };

  // Función para verificar token en cualquier momento
  const checkTokenValidity = async () => {
    try {
      const currentToken = token || localStorage.getItem('token');
      
      if (currentToken) {
        const verification = await verifyToken(currentToken);
        if (!verification.valid) {
          console.log('Token invalidado:', verification.message);
          return false;
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking token validity:', error);
      return false;
    }
  };

  const value = {
    user,
    token,
    login,
    signUp,
    logout,
    resetPassword,
    updatePassword,
    loading,
    checkTokenValidity
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};