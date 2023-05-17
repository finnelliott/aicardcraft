/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['oaidalleapiprodscus.blob.core.windows.net', 'imagedelivery.net', 'uniquegreetings.ams3.digitaloceanspaces.com'],
  }
}

module.exports = nextConfig
