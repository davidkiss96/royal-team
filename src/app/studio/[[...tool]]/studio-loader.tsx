"use client";

import dynamic from "next/dynamic";

/**
 * Loads Studio in the browser only. Studio renders nothing useful on the
 * server anyway (login and all content loading happen client-side), and
 * server-rendering it would pull the whole `sanity` package into the
 * Cloudflare Worker bundle — enough to roughly triple its size. With
 * `ssr: false` it ships purely as static client assets.
 */
const Studio = dynamic(() => import("./studio"), { ssr: false });

export function StudioLoader() {
  return <Studio />;
}
