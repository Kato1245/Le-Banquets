import apiClient from "@/shared/services/apiClient";

const getAllBanquetes = async () => {
  const response = await apiClient.get("/banquetes");
  return response.data.data;
};

const getBanqueteById = async (id) => {
  const response = await apiClient.get(`/banquetes/${id}`);
  return response.data.data;
};

export default {
  getAllBanquetes,
  getBanqueteById,
};
