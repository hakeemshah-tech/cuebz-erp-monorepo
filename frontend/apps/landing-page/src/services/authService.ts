import axiosClient from "./axiosClient";

interface RegisterTenantRequest {
  name: string;
  email: string;
  password: string;
  company_name: string;
  employees_count: string;
  business_category: string;
}

interface otpRequest {
  email: string | null;
  otp: string;
}

const authService = {
  registerTenant: async (data: RegisterTenantRequest) => {
    const response = await axiosClient.post(
      "/auth/tenant-owner/register",
      data
    );
    return response.data;
  },

  verifyOtp: async (data: otpRequest) => {
    const response = await axiosClient.post(
      "/auth/tenant-owner/verify-otp",
      data
    );
    const { user } = response.data;

    return user;
  },
};

export default authService;
