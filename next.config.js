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
  experimental: {
    esmExternals: true // Enable ESM support
  },
  // Add shiki to the transpiled modules
  transpilePackages: ['shiki']
};

module.exports = nextConfig;
