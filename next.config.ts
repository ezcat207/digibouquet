import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.pauwee.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
