import axiosClient from "./axiosClient";

const quotationService = {
  // Get a list of quotations with optional filters
  getList: async (filters = {}) => {
    const response = await axiosClient.get("/quotation/tenant", {
      params: filters, // Pass query parameters for filtering
    });
    return response.data;
  },

  // Get quotation details by ID
  getById: async (id: string | null | undefined) => {
    const response = await axiosClient.get(`/quotation/${id}/tenant`);
    return response.data;
  },

  // Create a new quotation (with support for file uploads)
  create: async (data: any) => {
    const response = await axiosClient.post("/quotation/tenant", data, {
      headers: { "Content-Type": "multipart/form-data" }, // Required for file uploads
    });
    return response.data;
  },

  // Update an existing quotation (with support for file uploads)
  edit: async (id: string, data: any) => {
    const response = await axiosClient.put(`/quotation/${id}/tenant`, data, {
      headers: { "Content-Type": "multipart/form-data" }, // Required for file uploads
    });
    return response.data;
  },

  // Delete a quotation by ID
  delete: async (id: string) => {
    const response = await axiosClient.delete(`/quotation/${id}/tenant`);
    return response.data;
  },

  // Send quotation via email to the linked lead
  sendQuotation: async (id: string) => {
    const response = await axiosClient.post(
      `/quotation/${id}/send-email/tenant`
    );
    return response.data;
  },
};

export default quotationService;
