/** @type {import('next').NextConfig} */
const nextConfig = {
  // The embedded development database ships WebAssembly that must not be bundled
  serverExternalPackages: ["@electric-sql/pglite"],
  images: {
    // 60 is used for small gallery thumbnails
    qualities: [60, 75],
    remotePatterns: [
      {
        // Photos imported from the old admin
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
};

export default nextConfig;
