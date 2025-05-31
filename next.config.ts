import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        // workaround for server actions not working in Codespaces during development
        "localhost:3000"
      ]
    }
  }
};

export default nextConfig;
