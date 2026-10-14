/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dev-only badge; keep it clear of the sidebar's "Download CV" button.
  devIndicators: { position: "bottom-right" },
  async redirects() {
    return [
      // /cv is a short link to hand out; the portfolio itself lives at the root.
      { source: "/cv", destination: "/", permanent: false },
    ];
  },
};
export default nextConfig;
