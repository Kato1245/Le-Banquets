import apiClient from "@/shared/services/apiClient";

const createReview = async (reviewData) => {
    const response = await apiClient.post("/reviews", reviewData);
    return response.data;
};

const getReviewsByBanquete = async (banqueteId) => {
    const response = await apiClient.get(`/reviews/banquete/${banqueteId}`);
    return response.data;
};

export default {
    createReview,
    getReviewsByBanquete,
};
