/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.open-meteo\.com\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'weather-api',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60 // 24 hours
        },
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: /^https:\/\/geocoding-api\.open-meteo\.com\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'geocoding-api',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60 // 24 hours
        },
        networkTimeoutSeconds: 10,
      },
    },
  ],
})

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['openweathermap.org'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
  },
  // Add performance optimizations
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
}

module.exports = withPWA(nextConfig)
