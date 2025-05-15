const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  // App Routerの設定
  experimental: {
    // appDir: true は削除（Next.js 13以降はデフォルトで有効）
  },
  // ルーティングの設定
  basePath: '',
  assetPrefix: '',
  trailingSlash: false
}

module.exports = withPWA(nextConfig) 