// src/config/api.js
// Centraliza la URL base de la API para evitar hardcoding en cada archivo.
// En producción, define VITE_API_URL en tu archivo .env

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default API_BASE_URL;
