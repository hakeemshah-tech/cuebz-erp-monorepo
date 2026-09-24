import axiosClient from "./axiosClient";

const rolesUserService = {
  // Get all users with filters and pagination
  getList: async (filters = {}) => {
    const response = await axiosClient.get("/roles-user/tenant", {
      params: filters,
    });
    return response.data;
  },

  // Get a single user by ID
  getById: async (id: string | null | undefined) => {
    const response = await axiosClient.get(`/roles-user/tenant/${id}`);
    return response.data;
  },

  // Assign a role and modules to a user
  assignRole: async (data: any) => {
    const response = await axiosClient.post(
      "/roles-user/tenant/assign-role",
      data
    );
    return response.data;
  },

  resendVerification: async (data: { email: string | null }) => {
    const response = await axiosClient.post(
      "/roles-user/tenant/resend-verification",
      data
    );
    return response.data;
  },

  // Verify OTP and set password
  verifyOtpAndSetPassword: async (data: any) => {
    const response = await axiosClient.post(
      "/roles-user/tenant/set-password",
      data
    );
    return response.data;
  },

  // Update role and modules for an existing user
  updateRoleAndModules: async (data: any) => {
    const response = await axiosClient.put(
      "/roles-user/tenant/update-role",
      data
    );
    return response.data;
  },

  // Delete a user by ID
  delete: async (id: string) => {
    const response = await axiosClient.delete(`/roles-user/tenant/${id}`);
    return response.data;
  },
};

export default rolesUserService;
