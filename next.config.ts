import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "staging-0c3d-ruineddivinity-yjpca.wpcomstaging.com",
      },
      {
        protocol: "https",
        hostname: "ruinedrx.com",
      },
      {
        protocol: "https",
        hostname: "wp.ruinedrx.com",
      },
    ],
  },
};

export default nextConfig;
