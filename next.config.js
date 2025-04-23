/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ['antd-mobile'],
    webpack: (config) => {
      return config;
    },
  };
  
  module.exports = nextConfig;