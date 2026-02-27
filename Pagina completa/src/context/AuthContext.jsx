// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config/api';
import apiClient from "../shared/services/apiClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const AUTH_URL = `${API_BASE_URL}/auth`;

  // ── Logout ─────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    setError(null);
    toast.success('Sesión cerrada correctamente');
  }, []);

  // ── Verificar token contra el servidor ─────────────────────────────────
  const verifyToken = useCallback(async (tokenToVerify) => {
    try {
      const res = await fetch(`${AUTH_URL}/verify`, {
        headers: { Authorization: `Bearer ${tokenToVerify}` }
      });
      if (res.ok) {
        const data = await res.json();
        return { valid: true, user: data.data.user };
      }
      return { valid: false };
    } catch {
      return { valid: false };
    }
  }, [AUTH_URL]);

  // ── Cargar perfil de usuario ───────────────────────────────────────────
  const loadUser = useCallback(async () => {
    try {
      const res = await apiClient.get("/auth/profile");
      const { user: userData, userType } = res.data.data;
      const fullUser = { ...userData, userType, role: userData.role || userType };
      setUser(fullUser);
      localStorage.setItem('user', JSON.stringify(fullUser));
    } catch (err) {
      console.error("Error loading user profile:", err);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // ── Restaurar sesión al cargar la app ──────────────────────────────────
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken) {
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          setLoading(false);
          // Verificar en segundo plano si el perfil sigue siendo válido/actualizado
          loadUser();
        } else {
          // Si hay token pero no hay datos de usuario, cargar perfil
          loadUser();
        }
      } else {
        setLoading(false);
      }
    };

    checkAuth();

    // Listener para eventos globales de sesión expirada (lanzados por apiClient)
    const handleSessionExpired = () => {
      logout();
      window.location.href = "/login";
    };

    window.addEventListener("auth-session-expired", handleSessionExpired);
    return () => window.removeEventListener("auth-session-expired", handleSessionExpired);
  }, [loadUser, logout]);

  // ── Login ──────────────────────────────────────────────────────────────
  const login = async (credentials) => {
    try {
      setError(null);
      // Usar apiClient o fetch según prefieras, mantendremos concordancia con lo que existía
      const res = await apiClient.post("/auth/login", {
        email: credentials.email,
        contrasena: credentials.password || credentials.contrasena
      });

      const { user: userData, token: newToken, userType } = res.data.data;
      const fullUser = { ...userData, userType, role: userData.role || userType };

      setUser(fullUser);
      setToken(newToken);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(fullUser));

      toast.success('¡Inicio de sesión exitoso!');
      return res.data;
    } catch (err) {
      const message = err.friendlyMessage || 'Error al iniciar sesión';
      setError(message);
      toast.error(message);
      throw err;
    }
  };

  // ── Registro ───────────────────────────────────────────────────────────
  const register = async (type, data) => {
    try {
      setError(null);
      const endpoint = type === 'propietario' ? '/auth/register/propietario' : '/auth/register/usuario';
      const res = await apiClient.post(endpoint, data);

      if (res.data.success) {
        toast.success(res.data.message || 'Registro exitoso. Por favor verifica tu email.');
        return res.data;
      }
    } catch (err) {
      const message = err.friendlyMessage || 'Error en el registro';
      setError(message);
      toast.error(message);
      throw err;
    }
  };

  // ── Recuperación de contraseña ─────────────────────────────────────────
  const resetPassword = async (email) => {
    try {
      const res = await apiClient.post('/auth/forgot-password', { email });
      toast.success(res.data.message);
      return res.data;
    } catch (err) {
      toast.error(err.friendlyMessage);
      throw err;
    }
  };

  // ── Actualizar contraseña ──────────────────────────────────────────────
  const updatePassword = async (resetToken, newPassword) => {
    try {
      const res = await apiClient.post('/auth/reset-password', { token: resetToken, newPassword });
      toast.success(res.data.message);
      return res.data;
    } catch (err) {
      toast.error(err.friendlyMessage);
      throw err;
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user,
    userType: user?.userType,
    login,
    register,
    logout,
    resetPassword,
    updatePassword,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};