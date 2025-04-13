/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/overview",
        permanent: true,
      },
    ];
  },
  // output: "export",
  // distDir: "dist",
};

module.exports = nextConfig;
