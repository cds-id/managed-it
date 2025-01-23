const { withBlitz } = require("@blitzjs/next")

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  blitz: {
    resolverPath: "root",
  },
}

module.exports = withBlitz(nextConfig)
