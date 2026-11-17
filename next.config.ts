import type { NextConfig } from "next";

// The site is exported as static HTML and served by Cloudflare Pages.
//
// Security headers (CSP, X-Frame-Options, ...) are defined in public/_headers,
// because the headers() option in this file only applies when Next.js runs as
// a server and is ignored for static exports.
const nextConfig: NextConfig = {
  output: 'export',
  images: {
    // The Next.js image optimizer needs a server. Images are served as-is.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        port: '',
        pathname: '/npm/simple-icons@v11/icons/**',
      },
    ],
  },
};

export default nextConfig;
