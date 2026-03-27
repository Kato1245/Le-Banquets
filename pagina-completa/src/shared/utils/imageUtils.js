// src/shared/utils/imageUtils.js
import API_BASE_URL from "../../config/api";

/**
 * Normaliza una URL de imagen para manejar Base64 Data URIs, URLs completas y rutas relativas.
 *
 * @param {string} img - La ruta o data URI de la imagen.
 * @param {string} defaultImage - Imagen por defecto si no hay ruta.
 * @returns {string} - La URL normalizada.
 */
export const getImageUrl = (
  img,
  defaultImage = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
) => {
  if (!img) return defaultImage;

  // Si ya es una URL completa (http/https) o un Data URI (base64)
  if (img.startsWith("http") || img.startsWith("data:")) {
    return img;
  }

  // Si es una ruta relativa, anteponemos la URL del servidor (sin /api)
  const baseUrl = API_BASE_URL.replace(/\/api$/, "");
  return `${baseUrl}${img.startsWith("/") ? "" : "/"}${img}`;
};
