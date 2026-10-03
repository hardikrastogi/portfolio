import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 90 keeps UI text in the project screenshots crisp
    qualities: [75, 90],
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
