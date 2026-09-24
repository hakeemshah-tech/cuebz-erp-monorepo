import axiosClient from "./axiosClient";

const organizationService = {
  getList: async (filters = {}) => {
    const response = await axiosClient.get("/organizations/tenant", {
      params: { ...filters },
    });
    return response.data;
  },
};

export default organizationService;
