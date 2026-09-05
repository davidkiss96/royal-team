import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sanity's image CDN is the source for all content images (docs/architecture.md Section 12).
  // The exact project ID subdomain is added once the Sanity project is initialized.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
