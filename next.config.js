/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
  },
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: [
      'dobryanka-rus.ru',
      'encrypted-tbn0.gstatic.com',
      'tsx.x5static.net',
      'images.unsplash.com',
      'picsum.photos',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig 
