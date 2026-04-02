import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ THIS IS THE KEY
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ ALSO IMPORTANT
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
