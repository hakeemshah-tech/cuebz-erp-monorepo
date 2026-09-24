/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "asset.cloudinary.com",
      },
    ],
  },
  transpilePackages: ["ui-core"],
};

// async rewrites() {
//   return [
//     {
//       source: "/api/:path*",
//       destination: "https://api.example.com/:path*", // API URL without `/api`
//     },
//   ];
// },
