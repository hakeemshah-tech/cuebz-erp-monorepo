import axiosClient from "./axiosClient";

const customerService = {
  // Get customer list with filters (pagination, search, etc.)
  getList: async (filters = {}) => {
    const response = await axiosClient.get("/customer/tenant", {
      params: filters, // Pass query parameters for filtering
    });
    return response.data;
  },

  // Get customer by ID
  getById: async (id: string | null | undefined) => {
    const response = await axiosClient.get(`/customer/${id}/tenant`);
    return response.data;
  },

  // Create new customer entry
  create: async (data: any) => {
    const response = await axiosClient.post("/customer/tenant", data);
    return response.data;
  },

  // Edit existing customer entry
  edit: async (id: string, data: any) => {
    const response = await axiosClient.put(`/customer/${id}/tenant`, data);
    return response.data;
  },

  // Delete customer entry by ID
  delete: async (id: string) => {
    const response = await axiosClient.delete(`/customer/${id}/tenant`);
    return response.data;
  },
};

export default customerService;
