import apiClient from "@/shared/services/apiClient";

const getFechasOcupadas = async (banqueteId) => {
  const response = await apiClient.get(`/banquetes/${banqueteId}/fechas-ocupadas`);
  return response.data;
};

const toggleBloquearFecha = async (banqueteId, fecha) => {
  const response = await apiClient.post(`/banquetes/${banqueteId}/bloquear-fecha`, { fecha });
  return response.data;
};

const getDisponibilidadCitas = async (banqueteId) => {
  const response = await apiClient.get(`/banquetes/${banqueteId}/disponibilidad-citas`);
  return response.data;
};

export default {
  getFechasOcupadas,
  toggleBloquearFecha,
  getDisponibilidadCitas,
};
