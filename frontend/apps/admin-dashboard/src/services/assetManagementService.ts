import axiosClient from "./axiosClient";

const assetService = {
  /**
   * Get a list of assets with optional filters and pagination.
   * @param filters - Filters for querying assets (e.g., search, status, assigned_to, etc.).
   * @returns Response data containing assets and pagination details.
   */
  getList: async (filters = {}) => {
    const response = await axiosClient.get("/asset/tenant", {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get a specific asset by its ID.
   * @param id - Asset ID.
   * @returns Response data containing the asset details.
   */
  getById: async (id: string | null | undefined) => {
    const response = await axiosClient.get(`/asset/${id}/tenant`);
    return response.data;
  },

  /**
   * Create a new asset.
   * @param data - Asset data to be created.
   * @returns Response data containing the created asset.
   */
  create: async (data: any) => {
    const response = await axiosClient.post("/asset/tenant", data);
    return response.data;
  },

  /**
   * Update an existing asset by ID.
   * @param id - Asset ID.
   * @param data - Updated asset data.
   * @returns Response data containing the updated asset.
   */
  edit: async (id: string, data: any) => {
    const response = await axiosClient.put(`/asset/${id}/tenant`, data);
    return response.data;
  },

  /**
   * Delete an asset by its ID.
   * @param id - Asset ID.
   * @returns Response data confirming the deletion.
   */
  delete: async (id: string) => {
    const response = await axiosClient.delete(`/asset/${id}/tenant`);
    return response.data;
  },
};

export default assetService;
