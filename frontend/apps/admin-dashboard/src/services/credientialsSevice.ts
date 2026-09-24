import axiosClient from "./axiosClient";

const credentialsService = {
  // ✅ Generate OTP for Secure Access
  generateOTP: async () => {
    const response = await axiosClient.post("/credentials/tenant/generate-otp");
    return response.data;
  },

  // ✅ Verify OTP & Start 15-Minute Secure Session
  verifyOTP: async (otp: string) => {
    const response = await axiosClient.post("/credentials/tenant/verify-otp", {
      otp,
    });
    return response.data;
  },

  // ✅ Check if Session is Active (For Frontend Polling)
  checkSessionStatus: async () => {
    const response = await axiosClient.get(
      "/credentials/tenant/session-status"
    );
    return response.data;
  },

  // ✅ Get all credentials (Requires OTP Verification & Active Session)
  getCredentials: async (filters = {}) => {
    const response = await axiosClient.get("/credentials/tenant", {
      params: filters, // Pass query parameters for filtering
    });
    return response.data;
  },

  // ✅ Create or Update a credential (Upsert)
  upsertCredential: async (data: any) => {
    const response = await axiosClient.post("/credentials/tenant", data);
    return response.data;
  },

  // ✅ Delete a credential by platform
  deleteCredential: async (platform: string) => {
    const response = await axiosClient.delete(
      `/credentials/${platform}/tenant`
    );
    return response.data;
  },
};

export default credentialsService;
