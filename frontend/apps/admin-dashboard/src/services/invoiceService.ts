import axiosClient from "./axiosClient";

const invoiceService = {
  // Get a list of invoices with optional filters
  getList: async (filters = {}) => {
    const response = await axiosClient.get("/invoice/tenant", {
      params: filters, // Pass query parameters for filtering
    });
    return response.data;
  },

  // Get invoice details by ID
  getById: async (id: string | null | undefined) => {
    const response = await axiosClient.get(`/invoice/${id}/tenant`);
    return response.data;
  },

  // Create a new invoice (with support for file uploads)
  create: async (data: any) => {
    const response = await axiosClient.post("/invoice/tenant", data, {
      headers: { "Content-Type": "multipart/form-data" }, // Required for file uploads
    });
    return response.data;
  },

  // Update an existing invoice (with support for file uploads)
  edit: async (id: string, data: any) => {
    const response = await axiosClient.put(`/invoice/${id}/tenant`, data, {
      headers: { "Content-Type": "multipart/form-data" }, // Required for file uploads
    });
    return response.data;
  },

  // Delete an invoice by ID
  delete: async (id: string) => {
    const response = await axiosClient.delete(`/invoice/${id}/tenant`);
    return response.data;
  },
};

export default invoiceService;
