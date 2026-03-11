import apiClient from "@/shared/services/apiClient";

const getMisNotificaciones = async () => {
    const response = await apiClient.get("/notificaciones");
    return response.data.data;
};

const marcarComoLeida = async (id) => {
    const response = await apiClient.put(`/notificaciones/${id}/leer`);
    return response.data;
};

const eliminar = async (id) => {
    const response = await apiClient.delete(`/notificaciones/${id}`);
    return response.data;
};

export default {
    getMisNotificaciones,
    marcarComoLeida,
    eliminar,
};
