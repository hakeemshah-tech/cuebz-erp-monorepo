import axiosClient from "./axiosClient";

const newsUpdateService = {
  /**
   * Get a list of news updates.
   * @returns Response data containing all news updates.
   */
  getList: async (filters: any) => {
    const response = await axiosClient.get("/news", {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get a specific news update by its ID.
   * @param id - News update ID.
   * @returns Response data containing the news update details.
   */
  getById: async (id: string | null | undefined) => {
    const response = await axiosClient.get(`/news/${id}`);
    return response.data;
  },

  /**
   * Create a new news update (Super Admin only).
   * @param data - News update data to be created.
   * @returns Response data containing the created news update.
   */
  create: async (data: any) => {
    const response = await axiosClient.post("/news", data, {
      headers: { "Content-Type": "multipart/form-data" }, // Ensure image upload works
    });
    return response.data;
  },

  /**
   * Update an existing news update by ID (Super Admin only).
   * @param id - News update ID.
   * @param data - Updated news update data.
   * @returns Response data containing the updated news update.
   */
  edit: async (id: string, data: any) => {
    const response = await axiosClient.put(`/news/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" }, // Ensure image upload works
    });
    return response.data;
  },

  /**
   * Delete a news update by its ID (Super Admin only).
   * @param id - News update ID.
   * @returns Response data confirming the deletion.
   */
  delete: async (id: string) => {
    const response = await axiosClient.delete(`/news/${id}`);
    return response.data;
  },
};

export default newsUpdateService;
