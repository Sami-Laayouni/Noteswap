/** @type {import('next').NextConfig} */

const { i18n } = require("./next-i18next.config");

const securityHeaders = [
  //Informs the browser that this page should only access pages using HTTPS
  //Blocks access to websites that can only be served over HTTP
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  //Prevents page from loading if it detects XSS attacks
  //Can be used for legacy browsers that don't support CSP
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  //Performs domain name resolution on external links
  //Reduces latency when the user clicks a link
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
];

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
      "source.unsplash.com",
    ],
  },
  i18n,
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
