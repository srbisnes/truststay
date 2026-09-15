/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "ipfs.io" },
      { protocol: "https", hostname: "gateway.pinata.cloud" },
    ],
  },
  webpack: (config) => {
    // RainbowKit / wagmi pull optional RN deps that break Next builds
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "@react-native-async-storage/async-storage": false,
      "react-native": false,
      "pino-pretty": false,
      encoding: false,
      fs: false,
      net: false,
      tls: false,
    };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  // Transpile packages that ship modern syntax
  transpilePackages: ["@rainbow-me/rainbowkit", "wagmi", "viem"],
};

export default nextConfig;
