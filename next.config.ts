import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/product/retatrutide-10mg",
        destination: "/product/glp-3-rt",
        permanent: true,
      },
      {
        source: "/product/retatrutide-20mg",
        destination: "/product/glp-3-rt",
        permanent: true,
      },
      {
        source: "/product/retatrutide-30mg",
        destination: "/product/glp-3-rt",
        permanent: true,
      },
      {
        source: "/product/retatrutide-50mg",
        destination: "/product/glp-3-rt",
        permanent: true,
      },
      {
        source: "/product/tesamorelin-10mg",
        destination: "/product/tesa",
        permanent: true,
      },
      {
        source: "/product/tesamorelin-20mg",
        destination: "/product/tesa",
        permanent: true,
      },
    ];
  },
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
