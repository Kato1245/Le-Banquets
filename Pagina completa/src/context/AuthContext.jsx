import { createContext, useContext, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import apiClient from "../shared/services/apiClient";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setError(null);
    toast.success("Sesión cerrada correctamente");
  }, []);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await apiClient.get("/auth/profile");
      const userData = res.data.data.user;
      const userType = res.data.data.userType;

      const fullUser = {
        ...userData,
        userType: userData.userType || userType,
        role: userData.role || userType
      };

      setUser(fullUser);
      localStorage.setItem("user", JSON.stringify(fullUser));
    } catch (err) {
      console.error("Error loading user:", err);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    loadUser();

    const handleSessionExpired = () => {
      logout();
      window.location.href = "/login";
    };

    window.addEventListener("auth-session-expired", handleSessionExpired);
    return () => window.removeEventListener("auth-session-expired", handleSessionExpired);
  }, [loadUser, logout]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.post("/auth/login", { email, contrasena: password });

      const { token, user: userData, userType } = res.data.data;
      const fullUser = { ...userData, userType };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(fullUser));
      setUser(fullUser);

      toast.success("¡Inicio de sesión exitoso!");
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.friendlyMessage || "Error al iniciar sesión";
      setError(msg);
      toast.error(msg);
      return {
        success: false,
        message: msg,
        attemptsLeft: err.response?.data?.attemptsLeft,
        locked: err.response?.data?.locked,
        remainingTime: err.response?.data?.remainingTime
      };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, userData, tipo = "usuario") => {
    try {
      setError(null);
      const endpoint = tipo === "propietario" ? "/auth/register/propietario" : "/auth/register/usuario";
      const res = await apiClient.post(endpoint, { email, contrasena: password, ...userData });

      toast.success("Registro exitoso. Por favor verifica tu email.");
      return { success: true, message: res.data.message };
    } catch (err) {
      const msg = err.friendlyMessage || "Error en el registro";
      setError(msg);
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const res = await apiClient.post("/auth/forgot-password", { email });
      toast.success(res.data.message);
      return { success: true, message: res.data.message };
    } catch (err) {
      const msg = err.friendlyMessage || "Error al procesar la solicitud";
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const res = await apiClient.post("/auth/reset-password", { token, newPassword });
      toast.success(res.data.message);
      return { success: true, message: res.data.message };
    } catch (err) {
      const msg = err.friendlyMessage || "Error al restablecer la contraseña";
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    signUp,
    logout,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user,
    userType: user?.userType,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};