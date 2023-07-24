/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  serverRuntimeConfig: {
    // Increase the payload size limit to 30MB
    maxPayloadSize: 30 * 1024 * 1024,
  },
  images: {
    domains: [
      "avatars.dicebear.com",
      "api.dicebear.com",
      "lh3.googleusercontent.com",
      "storage.googleapis.com",
    ],
    cacheDuration: 172800,
  },
};

module.exports = nextConfig;
