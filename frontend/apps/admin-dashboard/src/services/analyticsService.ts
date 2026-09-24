import axiosClient from "./axiosClient";

const analyticsService = {
  getAnalytics: async () => {
    const response = await axiosClient.get("/analytics/tenant");
    return response.data;
  },
};

export default analyticsService;
