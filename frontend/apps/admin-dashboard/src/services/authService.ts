// import axiosClient from "./axiosClient";
// import { WritableAtom, getDefaultStore } from "jotai";
// import { currentUserAtom } from "@/store/authAtom";
// import { jwtDecode } from "jwt-decode";
// import Cookies from "js-cookie";

// const store = getDefaultStore();

// interface LoginRequest {
//   email: string;
//   password: string;
// }

// interface RegisterTenantRequest {
//   name: string;
//   email: string;
//   password: string;
//   company_name: string;
//   employees_count: string;
//   business_category: string;
// }

// interface otpRequest {
//   email: string | null;
//   otp: string;
// }

// interface JwtPayload {
//   sub: string;
//   tid?: string;
//   role: string;
//   exp: number;
// }

// const authService = {
//   login: async (data: LoginRequest) => {
//     try {
//       const response = await axiosClient.post("/auth/super-admin/login", data);
//       const { accessToken, refreshToken, user } = response.data;

//       // Store in localStorage (optional)
//       localStorage.setItem("accessToken", accessToken);
//       localStorage.setItem("refreshToken", refreshToken);

//       // ✅ Store in cookie for middleware access
//       Cookies.set("accessToken", accessToken, {
//         expires: 7, // days
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "Lax",
//         path: "/",
//       });

//       store.set(currentUserAtom, user);
//       return user;
//     } catch (error: any) {
//       throw new Error(error.response?.data?.error || "Login failed.");
//     }
//   },
//   registerTenant: async (data: RegisterTenantRequest) => {
//     const response = await axiosClient.post(
//       "/auth/tenant-owner/register",
//       data
//     );
//     return response.data;
//   },

//   verifyOtp: async (data: otpRequest) => {
//     const response = await axiosClient.post(
//       "/auth/tenant-owner/verify-otp",
//       data
//     );
//     const { accessToken, refreshToken, user } = response.data;

//     localStorage.setItem("accessToken", accessToken);
//     localStorage.setItem("refreshToken", refreshToken);

//     store.set(currentUserAtom, user);
//     return user;
//   },

//   getCurrentUser: async () => {
//     const accessToken = localStorage.getItem("accessToken");

//     if (!accessToken) {
//       store.set(currentUserAtom, null);
//       return null;
//     }

//     try {
//       const decoded: JwtPayload = jwtDecode(accessToken);

//       const now = Date.now() / 1000;
//       if (decoded.exp < now) {
//         throw new Error("Token expired");
//       }

//       const response = await axiosClient.get("/auth/profile", {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });

//       const user = response.data.data;
//       store.set(currentUserAtom, user);
//       return user;
//     } catch (error) {
//       authService.logout(); // clear localStorage and state if invalid
//       throw error;
//     }
//   },

//   logout: async () => {
//     try {
//       await axiosClient.post(
//         "/auth/logout",
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//           },
//         }
//       );
//     } catch (e) {
//       console.warn("Logout failed silently.");
//     } finally {
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//       Cookies.remove("accessToken");
//       store.set(currentUserAtom, null);
//     }
//   },
// };

// export default authService;

import axiosClient from "./axiosClient";
import { WritableAtom, getDefaultStore } from "jotai";
import { currentUserAtom } from "@/store/authAtom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const store = getDefaultStore();

interface LoginRequest {
  email: string;
  password: string;
}

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

interface JwtPayload {
  sub: string;
  tid?: string;
  role: string;
  exp: number;
}

const TOKEN_EXPIRE_DAYS = 7;

const authService = {
  login: async (data: LoginRequest) => {
    try {
      const response = await axiosClient.post("/auth/super-admin/login", data);
      const { accessToken, refreshToken, user } = response.data;

      const accessExpireDate = 365 * 20; // 15 minutes

      // ✅ Store both in cookies
      Cookies.set("accessToken", accessToken, {
        expires: accessExpireDate,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        path: "/",
      });

      Cookies.set("refreshToken", refreshToken, {
        expires: accessExpireDate, // 15 days
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        path: "/",
      });

      store.set(currentUserAtom, user);
      return user;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Login failed.");
    }
  },

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
    const accessExpireDate = 365 * 20; // 15 minutes

    const { accessToken, refreshToken, user } = response.data;

    Cookies.set("accessToken", accessToken, {
      expires: accessExpireDate,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
    });

    Cookies.set("refreshToken", refreshToken, {
      expires: accessExpireDate,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
    });

    store.set(currentUserAtom, user);
    return user;
  },

  getCurrentUser: async () => {
    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
      store.set(currentUserAtom, null);
      return null;
    }

    try {
      const decoded: JwtPayload = jwtDecode(accessToken);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        throw new Error("Token expired");
      }

      const response = await axiosClient.get("/auth/profile", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const user = response.data.data;
      store.set(currentUserAtom, user);
      return user;
    } catch (error) {
      authService.logout();
      throw error;
    }
  },

  logout: async () => {
    try {
      await axiosClient.post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
    } catch (e) {
      console.warn("Logout failed silently.");
    } finally {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      store.set(currentUserAtom, null);
    }
  },
};

export default authService;
