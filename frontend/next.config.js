/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 👈 add this line
  },
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
