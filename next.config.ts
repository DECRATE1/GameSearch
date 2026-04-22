import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "localhost",
        port: "3001",
        pathname: "**",
      },
    ],
  },
  output: "standalone",
};

export default nextConfig;
