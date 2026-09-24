import axiosClient from "./axiosClient";

const pettyCashService = {
  // Get all petty cash entries with optional filters
  getList: async (filters = {}) => {
    const response = await axiosClient.get("/pettycash/tenant", {
      params: filters, // Pass query parameters for filtering (e.g., search, transaction_type, transaction_date)
    });
    return response.data;
  },

  // Get petty cash entry by ID
  getById: async (id: string | null | undefined) => {
    const response = await axiosClient.get(`/pettycash/${id}/tenant`);
    return response.data;
  },

  // Create a new petty cash entry
  create: async (data: any) => {
    const response = await axiosClient.post("/pettycash/tenant", data, {
      headers: { "Content-Type": "multipart/form-data" }, // Required for file uploads
    });
    return response.data;
  },

  // Edit an existing petty cash entry
  edit: async (id: string, data: any) => {
    const response = await axiosClient.put(`/pettycash/${id}/tenant`, data, {
      headers: { "Content-Type": "multipart/form-data" }, // Required for file uploads
    });
    return response.data;
  },

  // Delete a petty cash entry by ID
  delete: async (id: string) => {
    const response = await axiosClient.delete(`/pettycash/${id}/tenant`);
    return response.data;
  },
};

export default pettyCashService;
