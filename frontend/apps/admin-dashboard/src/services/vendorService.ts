import axiosClient from "./axiosClient";

const vendorService = {
  // Get a list of vendors with optional filters
  getList: async (filters = {}) => {
    const response = await axiosClient.get("/vendor/tenant", {
      params: filters, // Pass query parameters for filtering
    });
    return response.data;
  },

  // Get vendor details by ID
  getById: async (id: string | null | undefined) => {
    const response = await axiosClient.get(`/vendor/${id}/tenant`);
    return response.data;
  },

  // Create a new vendor (with support for file uploads)
  create: async (data: any) => {
    const response = await axiosClient.post("/vendor/tenant", data, {
      headers: { "Content-Type": "multipart/form-data" }, // Required for file uploads
    });
    return response.data;
  },

  // Update an existing vendor (with support for file uploads)
  edit: async (id: string, data: any) => {
    const response = await axiosClient.put(`/vendor/${id}/tenant`, data, {
      headers: { "Content-Type": "multipart/form-data" }, // Required for file uploads
    });
    return response.data;
  },

  // Delete a vendor by ID
  delete: async (id: string) => {
    const response = await axiosClient.delete(`/vendor/${id}/tenant`);
    return response.data;
  },
};

export default vendorService;
