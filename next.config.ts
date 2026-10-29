import type { NextConfig } from "next";

const devServer = process.argv.some((arg) => arg === "dev");

const nextConfig: NextConfig = {
  experimental: {
    agentUpgrade: "security",
  },
  // Old full-demo surfaces → Jess-order public site
  async redirects() {
    return [
      { source: "/admin", destination: "/", permanent: false },
      { source: "/admin/:path*", destination: "/", permanent: false },
      { source: "/artist", destination: "/try", permanent: false },
      { source: "/artist/:path*", destination: "/try", permanent: false },
      { source: "/rounds", destination: "/", permanent: false },
      { source: "/rounds/:path*", destination: "/", permanent: false },
      { source: "/demo", destination: "/try", permanent: false },
      { source: "/me", destination: "/try/fan", permanent: false },
      { source: "/r/:slug", destination: "/try/fan", permanent: false },
      { source: "/r/:slug/:path*", destination: "/try/fan", permanent: false },
      { source: "/o/:path*", destination: "/try/fan", permanent: false },
      { source: "/pay/:path*", destination: "/try/fan", permanent: false },
    ];
  },
  // Dev loads the driver through the alias below. Production must keep the real package external so it is traced into the server function.
  ...(!devServer ? { serverExternalPackages: ["mongodb"] } : {}),
  turbopack: {
    resolveAlias: devServer
      ? {
          // Turbopack's external mongodb stub does not resolve under Bun in dev.
          mongodb: "./src/lib/load-mongodb.cjs",
        }
      : {},
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
