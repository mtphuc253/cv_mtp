/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dev-only badge; keep it clear of the sidebar's "Download CV" button.
  devIndicators: { position: "bottom-right" },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "camo.githubusercontent.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
    ],
  },
};
export default nextConfig;
