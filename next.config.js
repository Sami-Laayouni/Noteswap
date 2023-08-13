/** @type {import('next').NextConfig} */

const { i18n } = require("./next-i18next.config");

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
  },
  i18n,
};

module.exports = nextConfig;
