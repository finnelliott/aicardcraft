/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverActions: true,
  },
  images: {
    domains: ['oaidalleapiprodscus.blob.core.windows.net', 'imagedelivery.net', 'uniquegreetings.ams3.digitaloceanspaces.com', 'tailwindui.com'],
  }
}

module.exports = nextConfig
