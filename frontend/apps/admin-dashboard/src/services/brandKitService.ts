import axiosClient from "./axiosClient";

const brandkitService = {
  /**
   * ✅ Get brand kit details by Tenant and Organization ID
   */
  getBrandKit: async () => {
    const response = await axiosClient.get("/brand-kit/tenant");
    return response.data;
  },

  /**
   * ✅ Upsert (Create or Update) a brand kit (supports file uploads)
   * @param {FormData} data - Brand Kit data including file uploads
   */
  upsertBrandKit: async (data: any) => {
    const response = await axiosClient.post("/brand-kit/tenant", data);
    return response.data;
  },
};

export default brandkitService;
