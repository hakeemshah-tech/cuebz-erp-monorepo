import axiosClient from "./axiosClient";

const taskService = {
  getList: async (filters = {}) => {
    const response = await axiosClient.get("/taskmanagement/tenant", {
      params: filters, // Pass query parameters for filtering
    });
    return response.data;
  },

  getById: async (id: string | null | undefined) => {
    const response = await axiosClient.get(`/taskmanagement/${id}/tenant`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await axiosClient.post("/taskmanagement/tenant", data, {
      headers: { "Content-Type": "multipart/form-data" }, // Required for file uploads
    });
    return response.data;
  },

  edit: async (id: string, data: any) => {
    const response = await axiosClient.put(
      `/taskmanagement/${id}/tenant`,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" }, // Required for file uploads
      }
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axiosClient.delete(`/taskmanagement/${id}/tenant`);
    return response.data;
  },
};

export default taskService;
