import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    useLightningcss: false,
    // turbo: false // Removed as it is not a valid configuration
  },
  env: {
    GEMINI_KEY: process.env.GEMINI_KEY,
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true }
  // `webpack5: true` is deprecated (Next.js 12+ uses Webpack 5 by default)
  // Remove it or replace with modern alternatives if needed
}



export default nextConfig