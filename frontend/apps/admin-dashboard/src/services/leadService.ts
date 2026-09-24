import axiosClient from "./axiosClient";

const leadService = {
  /**
   * Get a list of leads with optional filters and pagination.
   * @param filters - Filters for querying leads (e.g., search, status, assigned_to, etc.).
   * @returns Response data containing leads and pagination details.
   */
  getList: async (filters = {}) => {
    const response = await axiosClient.get("/lead/tenant", {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get a specific lead by its ID.
   * @param id - Lead ID.
   * @returns Response data containing the lead details.
   */
  getById: async (id: string | null | undefined) => {
    const response = await axiosClient.get(`/lead/${id}/tenant`);
    return response.data;
  },

  /**
   * Create a new lead.
   * @param data - Lead data to be created.
   * @returns Response data containing the created lead.
   */
  create: async (data: any) => {
    const response = await axiosClient.post("/lead/tenant", data);
    return response.data;
  },

  /**
   * Update an existing lead by ID.
   * @param id - Lead ID.
   * @param data - Updated lead data.
   * @returns Response data containing the updated lead.
   */
  edit: async (id: string, data: any) => {
    const response = await axiosClient.put(`/lead/${id}/tenant`, data);
    return response.data;
  },

  /**
   * Delete a lead by its ID.
   * @param id - Lead ID.
   * @returns Response data confirming the deletion.
   */
  delete: async (id: string) => {
    const response = await axiosClient.delete(`/lead/${id}/tenant`);
    return response.data;
  },
};

export default leadService;
