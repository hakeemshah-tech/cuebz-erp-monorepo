import axiosClient from "./axiosClient";

const visitorService = {
  getList: async (filters = {}) => {
    const response = await axiosClient.get("/visitors-log/tenant", {
      params: filters,
    });
    return response.data;
  },
  getById: async (id: string | null | undefined) => {
    const response = await axiosClient.get(`/visitors-log/${id}/tenant`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await axiosClient.post("/visitors-log/tenant", data);
    return response.data;
  },
  edit: async (id: string, data: any) => {
    const response = await axiosClient.put(`/visitors-log/${id}/tenant`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await axiosClient.delete(`/visitors-log/${id}/tenant`);
    return response.data;
  },
};

export default visitorService;
