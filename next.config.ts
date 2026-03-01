import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  outputFileTracingIncludes: {
    '/api/generate-widget': ['./templates/**/*'],
  },
};

export default nextConfig;
