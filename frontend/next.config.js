/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow all origins in dev mode (LAN, WAN, etc.)
  allowedDevOrigins: ['*'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://juspost-backend.onrender.com/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
