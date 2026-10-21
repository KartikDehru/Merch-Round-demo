import type { NextConfig } from "next";

const devServer = process.argv.some((arg) => arg === "dev");

const nextConfig: NextConfig = {
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
