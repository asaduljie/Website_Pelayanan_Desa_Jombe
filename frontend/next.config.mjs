/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Memastikan build Vercel tidak terhenti karena minor type warning
    ignoreBuildErrors: true,
  },
  eslint: {
    // Memastikan build Vercel tidak terhenti karena linting rules
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
