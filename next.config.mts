module.exports = {
  experimental: {
    useLightningcss: false,
    turbo: false
  },
  env: {
    GEMINI_KEY: process.env.GEMINI_KEY,
    // Add these AWS environment variables
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION
  },
  webpack5: true
}