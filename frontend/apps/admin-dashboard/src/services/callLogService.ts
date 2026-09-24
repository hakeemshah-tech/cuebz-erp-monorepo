import axiosClient from "./axiosClient";

const callLogService = {
  getList: async (filters = {}) => {
    const response = await axiosClient.get("/call-log/tenant", {
      params: filters,
    });
    return response.data;
  },
  getById: async (id: string | null | undefined) => {
    const response = await axiosClient.get(`/call-log/${id}/tenant`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await axiosClient.post("/call-log/tenant", data);
    return response.data;
  },
  edit: async (id: string, data: any) => {
    const response = await axiosClient.put(`/call-log/${id}/tenant`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await axiosClient.delete(`/call-log/${id}/tenant`);
    return response.data;
  },
};

export default callLogService;
