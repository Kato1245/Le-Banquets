// src/context/AuthContext.jsx

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
    }

    try {
      setLoading(true);
      const res = await apiClient.get("/auth/profile");
      const userData = res.data.data.user;
      const userType = res.data.data.userType;

      setUser({
        ...userData,
        role: userData.role || userType,
        userType: userData.userType || userType
      });
    } catch (err) {
      console.error("Error loading user:", err);
      logout();
    } finally {
      setLoading(false);
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

  const forgotPassword = async (email) => {
    try {
      const res = await apiClient.post("/auth/forgot-password", { email });
      return res.data;
    } catch (err) {
      return { success: false, message: err.friendlyMessage };
    }
  };

  const resetPassword = async (token, nuevaContrasena) => {
    try {
      const res = await apiClient.post("/auth/reset-password", { token, nuevaContrasena });
      return res.data;
    } catch (err) {
      return { success: false, message: err.friendlyMessage };
    }
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
        forgotPassword,
        resetPassword,
        isAuthenticated: !!user,
        userType: user?.userType,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);