/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/:path*`, // Adding /v1 because Nest uses it
      },
    ];
  },
};

export default nextConfig;
