/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Allow webpack HMR and dev resources from loopback host used by Playwright
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
