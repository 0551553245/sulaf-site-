import type { NextConfig } from "next";

// PREVIEW_EXPORT=1 builds a static copy for the private preview (see scripts/preview.py).
const preview = process.env.PREVIEW_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(preview ? { output: "export" as const, distDir: ".next-preview" } : {}),
  images: {
    unoptimized: preview,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 828, 1080, 1440, 1920],
  },
  poweredByHeader: false,
  // The storefront is the approved static design in public/store; it replaces the old landing page.
  async rewrites() {
    return { beforeFiles: [{ source: "/", destination: "/store/index.html" }, { source: "/policies", destination: "/store/policies.html" }, { source: "/admin", destination: "/store/admin.html" }], afterFiles: [], fallback: [] };
  },
  async redirects() {
    return [{ source: "/en", destination: "/?lang=en", permanent: false }];
  },
  async headers() {
    return [
      { source: "/store/:file(.*\\.(?:woff2|webp|png|jpg|mp4))", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
};

export default nextConfig;
