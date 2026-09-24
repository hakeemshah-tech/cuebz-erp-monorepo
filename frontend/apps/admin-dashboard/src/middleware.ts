// import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";

// // 1. Specify protected and public routes
// const protectedRoutes = ["/dashboard"];
// const publicRoutes = ["/login", "/"];

// export default async function middleware(req: NextRequest) {
//   // 2. Check if the current route is protected or public
//   const path = req.nextUrl.pathname;
//   const isProtectedRoute = protectedRoutes.includes(path);
//   const isPublicRoute = publicRoutes.includes(path);

//   // Get the custom 'session' cookie
//   const sessionCookie = req.cookies.get("session");

//   // 4. Redirect to /login if the user is not authenticated

//   if (isProtectedRoute && !sessionCookie) {
//     // User is not authenticated and tries to access a protected route
//     return NextResponse.redirect(new URL("/signin", req.url));
//   }

//   // 5. Redirect to /dashboard if the user is authenticated=
//   if (isPublicRoute && sessionCookie && !path.startsWith("/dashboard")) {
//     // Authenticated user tries to access public routes like /login
//     return NextResponse.redirect(new URL("/dashboard", req.url));
//   }

//   return NextResponse.next();
// }

// // Routes Middleware should not run on
// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
// };

//
// import { NextRequest, NextResponse } from "next/server";
// import { getDefaultStore } from "jotai";
// import { currentUserAtom } from "@/store/authAtom";

// // Define protected and public routes
// const protectedRoutes = ["/dashboard", "/tenant"];
// const publicRoutes = ["/signin", "/"];

// export default async function middleware(req: NextRequest) {
//   const store = getDefaultStore(); // Access the Jotai store
//   const path = req.nextUrl.pathname;
//   const sessionCookie = req.cookies.get("session");
//   console.log(sessionCookie, "hellooo");

//   const isProtectedRoute = protectedRoutes.includes(path);
//   const isPublicRoute = publicRoutes.includes(path);

//   // Check if session cookie exists
//   if (!sessionCookie) {
//     if (isProtectedRoute) {
//       return NextResponse.redirect(new URL("/signin", req.url));
//     }
//     return NextResponse.next();
//   }

//   // Get current user from Jotai atom
//   const currentUser = store.get(currentUserAtom);
//   console.log(currentUser, "heyy");

//   if (isProtectedRoute) {
//     if (!currentUser) {
//       return NextResponse.redirect(new URL("/signin", req.url));
//     }

//     if (currentUser.role === "super-admin" && !path.startsWith("/dashboard")) {
//       return NextResponse.redirect(new URL("/dashboard", req.url));
//     }

//     if (currentUser.role === "tenant-owner" && !path.startsWith("/tenant")) {
//       return NextResponse.redirect(new URL("/tenant", req.url));
//     }
//   }

//   if (isPublicRoute && currentUser) {
//     if (currentUser.role === "super-admin") {
//       return NextResponse.redirect(new URL("/dashboard", req.url));
//     }

//     if (currentUser.role === "tenant-owner") {
//       return NextResponse.redirect(new URL("/tenant", req.url));
//     }
//   }

//   return NextResponse.next();
// }

// // Routes Middleware should not run on
// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
// };

import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/tenant"];
const publicRoutes = ["/signin", "/register", "/otp", "/set-password"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Allow access to the "/" route without any checks
  if (path === "/") {
    return NextResponse.next();
  }

  // Retrieve session cookie

  const sessionCookie = req.cookies.get("accessToken")?.value;
  console.log(sessionCookie, "cookies");

  if (!sessionCookie) {
    if (protectedRoutes.includes(path)) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
    return NextResponse.next();
  }

  // Fetch current user
  let currentUser = null;
  try {
    console.log(process.env.NEXT_PUBLIC_BASE_URL, "enviirr");
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    console.log(BASE_URL, "SHOOWW");
    const apiResponse = await fetch(`${BASE_URL}/auth/profile`, {
      headers: {
        authorization: `Bearer ${sessionCookie}`,
      },
    });

    if (apiResponse.ok) {
      console.log("hiyyeedddd hereee");
      const res = await apiResponse.json();
      currentUser = res.data;
      console.log(res.data, "helloo");
    } else {
      console.error(
        "Middleware: Failed to fetch user profile:",
        apiResponse.statusText
      );
    }
  } catch (error) {
    console.error("Middleware: Error fetching user profile:", error);
  }

  // Handle logged-in user redirection
  if (currentUser) {
    if (publicRoutes.includes(path)) {
      if (currentUser.role === "super-admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      if (
        currentUser.role === "tenant-owner" ||
        currentUser.role === "tenant-user"
      ) {
        return NextResponse.redirect(new URL("/tenant", req.url));
      }
    }

    if (protectedRoutes.includes(path)) {
      if (
        currentUser.role === "super-admin" &&
        !path.startsWith("/dashboard")
      ) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      if (
        (currentUser.role === "tenant-owner" ||
          currentUser.role === "tenant-user") &&
        !path.startsWith("/tenant")
      ) {
        return NextResponse.redirect(new URL("/tenant", req.url));
      }
    }
  } else if (protectedRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
