import apiClient from "../../../services/apiClient";

const getAllBanquetes = async () => {
  const response = await apiClient.get("/api/banquetes");
  return response.data;
};

const getBanqueteById = async (id) => {
  const response = await apiClient.get(`/api/banquetes/${id}`);
  return response.data;
};

export default {
  getAllBanquetes,
  getBanqueteById,
};
