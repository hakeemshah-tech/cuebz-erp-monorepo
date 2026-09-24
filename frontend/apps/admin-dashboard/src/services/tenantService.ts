// import axiosClient from "./axiosClient";

// const tenantService = {
//   getList: async (filters = {}) => {
//     const response = await axiosClient.get("/tenants/admin", {
//       params: { ...filters },
//     });
//     return response.data;
//   },

//   getById: async (id: string | null) => {
//     const response = await axiosClient.get(`/tenants/${id}/admin`);
//     return response.data;
//   },

//   create: async (data: any) => {
//     const response = await axiosClient.post("/tenants/admin", data);
//     return response.data;
//   },

//   edit: async (id: string, data: any) => {
//     const response = await axiosClient.put(`/tenants/${id}/admin`, data);
//     return response.data;
//   },

//   delete: async (id: string) => {
//     const response = await axiosClient.delete(`/tenants/${id}/admin`);
//     return response.data;
//   },

//   createSubscription: async (data: {
//     tenantId: string;
//     subscriptionPlanId: string;
//   }) => {
//     const response = await axiosClient.post(
//       "/tenants/admin/create-subscription",
//       data
//     );
//     return response.data;
//   },

//   updateSubscription: async (data: {
//     tenantId: string;
//     subscriptionPlanId: string;
//   }) => {
//     const response = await axiosClient.put(
//       "/tenants/admin/update-subscription",
//       data
//     );
//     return response.data;
//   },

//   renewSubscription: async (data: {
//     tenantId: string;
//     subscriptionPlanId: string;
//   }) => {
//     const response = await axiosClient.post(
//       "/tenants/admin/renew-subscription",
//       data
//     );
//     return response.data;
//   },
// };

// export default tenantService;

import axiosClient from "./axiosClient";

const tenantService = {
  getList: async (filters = {}) => {
    const response = await axiosClient.get("/tenants/admin", {
      params: { ...filters },
    });
    return response.data;
  },

  getById: async (id: string | null) => {
    const response = await axiosClient.get(`/tenants/${id}/admin`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await axiosClient.post("/tenants/admin", data);
    return response.data;
  },

  edit: async (id: string, data: any) => {
    const response = await axiosClient.put(`/tenants/${id}/admin`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axiosClient.delete(`/tenants/${id}/admin`);
    return response.data;
  },

  createSubscription: async (data: {
    tenantId: string;
    subscriptionPlanId: string;
  }) => {
    const response = await axiosClient.post(
      "/tenants/admin/create-subscription",
      data
    );
    return response.data;
  },

  updateSubscription: async (data: {
    tenantId: string;
    subscriptionPlanId: string;
  }) => {
    const response = await axiosClient.put(
      "/tenants/admin/update-subscription",
      data
    );
    return response.data;
  },

  renewSubscription: async (data: {
    tenantId: string;
    subscriptionPlanId: string;
  }) => {
    const response = await axiosClient.post(
      "/tenants/admin/renew-subscription",
      data
    );
    return response.data;
  },

  // ✅ New methods to approve/reject tenant
  approve: async (id: string) => {
    const response = await axiosClient.patch(`/auth/tenants/${id}/approve`);
    return response.data;
  },

  reject: async (id: string) => {
    const response = await axiosClient.post(`/auth/tenants/${id}/reject`);
    return response.data;
  },
};

export default tenantService;
