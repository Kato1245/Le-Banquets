import apiClient from "@/shared/services/apiClient";

const createReserva = async (reservaData) => {
    const response = await apiClient.post("/reservas", reservaData);
    return response.data;
};

const getAgendaPropietario = async () => {
    const response = await apiClient.get("/reservas/agenda");
    return response.data.data;
};

export default {
    createReserva,
    getAgendaPropietario,
};
