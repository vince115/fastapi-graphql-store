import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
   // domains: ['example.com','images.unsplash.com','images.pexels.com'],
  },
};

export default nextConfig;
