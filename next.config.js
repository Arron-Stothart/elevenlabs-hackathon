/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['google.com', 'www.google.com'],
  },
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

module.exports = nextConfig;
