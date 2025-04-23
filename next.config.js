/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['antd-mobile'],
    webpack: (config) => {
      // 为了解决 antd-mobile 的 CSS 导入问题
      return config;
    },
  };
  
  module.exports = nextConfig;