/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ipfs-3.thirdwebcdn.com",
      },
    ],
  },
};

module.exports = nextConfig;
