import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL ("https://t.scdn.co/**"),
      new URL ("https://campaigns-service.spotifycdn.com/**"),
      new URL ("https://i.scdn.co/**"),
      new URL ("https://chart-images.scdn.co/**"),
      new URL ("https://charts-images.scdn.co/**"),
      new URL ("https://mosaic.scdn.co/**"),
    ],
  },
};

export default nextConfig;
