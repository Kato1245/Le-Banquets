import apiClient from "@/shared/services/apiClient";

const createCita = async (citaData) => {
    const response = await apiClient.post("/citas", citaData);
    return response.data;
};

const getMisCitas = async () => {
    const response = await apiClient.get("/citas/mis-citas");
    return response.data.data;
};

const getCitasRecibidas = async () => {
    const response = await apiClient.get("/citas/recibidas");
    return response.data.data;
};

export default {
    createCita,
    getMisCitas,
    getCitasRecibidas,
};
