/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  // App Routerの設定
  experimental: {
    appDir: true,
  },
  // ルーティングの設定
  basePath: '',
  assetPrefix: '',
  trailingSlash: false
}

module.exports = nextConfig 