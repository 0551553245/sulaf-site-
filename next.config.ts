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
};

export default nextConfig;
