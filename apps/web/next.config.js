/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  trailingSlash: true,
  generateBuildId: async () => {
    return 'lark-build'
  },
  experimental: {
    appDir: true,
  },
  serverRuntimeConfig: {},
  publicRuntimeConfig: {},
};

module.exports = nextConfig;
