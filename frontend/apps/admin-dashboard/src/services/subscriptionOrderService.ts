import axiosClient from "./axiosClient";

const subscriptionOrderService = {
  getList: async (filters = {}) => {
    try {
      const response = await axiosClient.get("/subscription-orders/admin", {
        params: filters,
      });
      return response.data;
    } catch (err: any) {
      throw new Error(err.message || "Something Went Wrong. Please try again.");
    }
  },
  getById: async (id: string) =>
    axiosClient.get(`/subscription-orders/${id}/admin`),
  create: async (data: any) =>
    axiosClient.post("/subscription-orders/admin", data),
  edit: async (id: string, data: any) =>
    axiosClient.put(`/subscription-orders/${id}/status/admin`, data),
  delete: async (id: string) =>
    axiosClient.delete(`/subscription-orders/${id}/admin`),
  //   getPlans: async () => axiosClient.get("/subscription-plans"),
  //   getTenants: async () => axiosClient.get("/tenants"),
};

export default subscriptionOrderService;
