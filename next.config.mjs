/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production"
const isGhPages = process.env.DEPLOY_TARGET === "gh-pages"

const ghPagesBase = "/bean-to-bar-calculator"

const nextConfig = {
  // Static export for Capacitor (iOS/Android) and GitHub Pages builds
  output: "export",
  // GitHub Pages deploys to /bean-to-bar-calculator/ subdirectory
  ...(isGhPages && {
    basePath: ghPagesBase,
    assetPrefix: ghPagesBase + "/",
  }),
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: isGhPages ? ghPagesBase : "",
  },
}

export default nextConfig
