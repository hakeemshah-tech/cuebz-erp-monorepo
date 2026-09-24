import axiosClient from "./axiosClient";

const subscriptionService = {
  getList: async (filters: any = {}) => {
    try {
      const response = await axiosClient.get("/subscription/plans", {
        params: { ...filters },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.message || "Something Went Wrong. Please try again."
      );
    }
  },

  create: async (data: any) => {
    const response = await axiosClient.post("/subscription/plans", data);
    return response.data;
  },

  edit: async (id: string, data: any) => {
    const response = await axiosClient.put(`/subscription/plans/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axiosClient.delete(`/subscription/plans/${id}`);
    return response.data;
  },

  createStripeCheckout: async (priceId: string) => {
    const response = await axiosClient.post(
      "/subscription/plans/create-checkout",
      { priceId }
    );
    return response.data;
  },

  openBillingPortal: async () => {
    const response = await axiosClient.post("/subscription/billing-portal");
    return response.data;
  },
};

export default subscriptionService;
