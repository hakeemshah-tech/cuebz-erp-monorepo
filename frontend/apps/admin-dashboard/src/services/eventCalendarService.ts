import axiosClient from "./axiosClient";

const eventCalendarService = {
  // ✅ Get All Events
  getList: async () => {
    const response = await axiosClient.get("/event-calendar/tenant");
    return response.data;
  },

  // ✅ Get Event by ID
  getById: async (id: string | null | undefined) => {
    const response = await axiosClient.get(`/event-calendar/${id}/tenant`);
    return response.data;
  },

  // ✅ Create a New Event
  create: async (data: any) => {
    const response = await axiosClient.post("/event-calendar/tenant", data);
    return response.data;
  },

  // ✅ Edit an Existing Event
  edit: async (id: string, data: any) => {
    const response = await axiosClient.put(
      `/event-calendar/${id}/tenant`,
      data
    );
    return response.data;
  },

  // ✅ Delete an Event
  delete: async (id: string) => {
    const response = await axiosClient.delete(`/event-calendar/${id}/tenant`);
    return response.data;
  },
};

export default eventCalendarService;
