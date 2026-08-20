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
      {
        source: "/product/ghk-cu-50mg",
        destination: "/product/ghk-cu",
        permanent: true,
      },
      {
        source: "/product/ghk-cu-100mg",
        destination: "/product/ghk-cu",
        permanent: true,
      },
      {
        source: "/product/mots-c-10mg",
        destination: "/product/mots-c",
        permanent: true,
      },
      {
        source: "/product/mots-c-20mg",
        destination: "/product/mots-c",
        permanent: true,
      },
      {
        source: "/product/mots-c-40mg",
        destination: "/product/mots-c",
        permanent: true,
      },
      {
        source: "/product/nad-500mg",
        destination: "/product/nad",
        permanent: true,
      },
      {
        source: "/product/nad-1000mg",
        destination: "/product/nad",
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
