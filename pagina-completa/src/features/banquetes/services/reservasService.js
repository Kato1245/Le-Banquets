import apiClient from "@/shared/services/apiClient";

const createReserva = async (reservaData) => {
    const response = await apiClient.post("/reservas", reservaData);
    return response.data;
};

const getAgendaPropietario = async () => {
    const response = await apiClient.get("/reservas/agenda");
    return response.data.data;
};

const actualizarEstado = async (id, estado, motivo_rechazo) => {
    const response = await apiClient.patch(`/reservas/${id}/estado`, { estado, motivo_rechazo });
    return response.data;
};

const modificarFecha = async (id, fecha, hora) => {
    const response = await apiClient.patch(`/reservas/${id}/fecha`, { fecha, hora });
    return response.data;
};

export default {
    createReserva,
    getAgendaPropietario,
    actualizarEstado,
    modificarFecha,
};
