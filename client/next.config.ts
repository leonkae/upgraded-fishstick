import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // <--- ADD THIS LINE
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // If your images are from Unsplash/Pexels, add this to skip optimization errors
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
