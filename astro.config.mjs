import { defineConfig } from "astro/config";
import node from "@astrojs/node";

// Pages are prerendered at build time; only /api/* runs on the server (SQLite).
export default defineConfig({
  output: "static",
  adapter: node({ mode: "standalone" }),
  trailingSlash: "ignore",
});
