import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Docker standalone build
  output: "standalone",

  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "*.railway.app" },
      { protocol: "https", hostname: "*.onrender.com" },
    ],
  },
};

export default nextConfig;
