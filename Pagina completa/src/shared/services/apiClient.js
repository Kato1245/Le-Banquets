// src/shared/services/apiClient.js

import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
});

// Interceptor para inyectar el token automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejo global de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo de sesión expirada
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Despachar evento personalizado para que AuthContext reaccione
      window.dispatchEvent(new CustomEvent("auth-session-expired"));
    }

    // Normalizar error para el frontend
    const errorMessage = error.response?.data?.message || error.message || "Ocurrió un error inesperado";
    error.friendlyMessage = errorMessage;

    return Promise.reject(error);
  }
);

export default apiClient;