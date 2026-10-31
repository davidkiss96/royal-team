import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `www` is attached to the Worker (wrangler.jsonc) only to redirect here:
  // the apex is the canonical origin (src/lib/site-config.ts).
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.royalteamszerviz.hu" }],
        destination: "https://royalteamszerviz.hu/:path*",
        permanent: true,
      },
    ];
  },
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

// Makes `next dev` simulate the Cloudflare Workers runtime (bindings from
// wrangler.jsonc, `getCloudflareContext()`, etc.) instead of only becoming
// accurate under `opennextjs-cloudflare preview`. A no-op in the actual
// Cloudflare build/deploy path — see open-next.config.ts.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
