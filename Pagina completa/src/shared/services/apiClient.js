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
    let errorMessage = "Ocurrió un error inesperado";

    if (error.response?.data) {
      if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
        // Unir mensajes de validación
        errorMessage = error.response.data.errors.map(err => err.msg).join(". ");
      } else if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    error.friendlyMessage = errorMessage;
    return Promise.reject(error);
  }
);

export default apiClient;