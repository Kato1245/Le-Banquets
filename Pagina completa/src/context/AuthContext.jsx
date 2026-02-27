// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config/api';

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import apiClient from "../shared/services/apiClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setError(null);
  }, []);

  // Cargar usuario si existe token
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const AUTH_URL = `${API_BASE_URL}/auth`;

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
      const err = await res.json().catch(() => ({}));
      return { valid: false, message: err.message || 'Token inválido' };
    } catch {
      return { valid: false, message: 'Error de conexión al verificar token' };
    }
  }, [AUTH_URL]);

  // ── Restaurar sesión al cargar la app ──────────────────────────────────
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const verification = await verifyToken(storedToken);
          if (verification.valid) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Solo mostrar toast si la app ya estaba cargada antes
            if (storedUser) {
              toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
            }
          }
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Login ──────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const res = await fetch(`${AUTH_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, contrasena: password }),
      });
      const data = await res.json();

      if (data.success) {
        const { user: userData, token: newToken, userType } = data.data;
        const fullUser = { ...userData, userType };

        setUser(fullUser);
        setToken(newToken);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(fullUser));

        toast.success('¡Inicio de sesión exitoso!');
        return { success: true, data: data.data };
      }

      toast.error(data.message || 'Error al iniciar sesión');
      return {
        success: false,
        message: data.message,
        attemptsLeft: data.attemptsLeft,
        locked: data.locked,
        remainingTime: data.remainingTime
      };
    } catch {
      toast.error('Error de conexión con el servidor');
      return { success: false, message: 'Error de conexión con el servidor' };
    }

    try {
      setLoading(true);
      const res = await apiClient.get("/auth/profile");
      const userData = res.data.data.user;
      const userType = res.data.data.userType;

      setUser({
        ...userData,
        role: userData.role || userType // Asegurar que role esté presente
      });
    } catch (err) {
      console.error("Error loading user:", err);
      logout();
    } finally {
      setLoading(false);
  // ── Registro ───────────────────────────────────────────────────────────
  const signUp = async (email, password, userData, tipo = 'usuario') => {
    try {
      const endpoint = tipo === 'propietario'
        ? `${AUTH_URL}/register/propietario`
        : `${AUTH_URL}/register/usuario`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, contrasena: password, ...userData }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Registro exitoso. Por favor verifica tu email.');
        return { success: true, message: data.message };
      }
      toast.error(data.message || 'Error en el registro');
      return { success: false, message: data.message };
    } catch {
      toast.error('Error de conexión');
      return { success: false, message: 'Error de conexión' };
    }
  }, [logout]);

  useEffect(() => {
    loadUser();

    // Listen for global auth events
    const handleSessionExpired = () => {
      logout();
      window.location.href = "/login";
    };

    window.addEventListener("auth-session-expired", handleSessionExpired);
    return () => window.removeEventListener("auth-session-expired", handleSessionExpired);
  }, [loadUser, logout]);

  const login = async (credentials) => {
    try {
      setError(null);
      const res = await apiClient.post("/auth/login", credentials);
      localStorage.setItem("token", res.data.data.token);

      const userData = res.data.data.user;
      setUser(userData);
      return res.data;
    } catch (err) {
      setError(err.friendlyMessage);
      throw err;
    }
  };

  const register = async (type, data) => {
    try {
      setError(null);
      const endpoint = type === 'propietario' ? '/auth/register/propietario' : '/auth/register/usuario';
      const res = await apiClient.post(endpoint, data);
      localStorage.setItem("token", res.data.data.token);
      setUser(res.data.data.user);
      return res.data;
    } catch (err) {
      setError(err.friendlyMessage);
      throw err;
    }
  };

  // ── Recuperación de contraseña ─────────────────────────────────────────
  const resetPassword = async (email) => {
    try {
      const res = await fetch(`${AUTH_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        return { success: true, message: data.message };
      }
      toast.error(data.message);
      return { success: false, message: data.message };
    } catch {
      toast.error('Error de conexión');
      return { success: false, message: 'Error de conexión' };
    }
  };

  // ── Actualizar contraseña ──────────────────────────────────────────────
  const updatePassword = async (resetToken, newPassword) => {
    try {
      const res = await fetch(`${AUTH_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, newPassword }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        return { success: true, message: data.message };
      }
      toast.error(data.message);
      return { success: false, message: data.message };
    } catch {
      toast.error('Error de conexión');
      return { success: false, message: 'Error de conexión' };
    }
  };

  // ── Logout ─────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Sesión cerrada correctamente');
  }, []);

  // ── Verificación periódica del token ───────────────────────────────────
  const checkTokenValidity = useCallback(async () => {
    const currentToken = token || localStorage.getItem('token');
    if (!currentToken) return false;
    const verification = await verifyToken(currentToken);
    return verification.valid;
  }, [token, verifyToken]);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    signUp,
    logout,
    resetPassword,
    updatePassword,
    checkTokenValidity,
    setUser
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        userType: user?.userType, // Add direct access to userType
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);