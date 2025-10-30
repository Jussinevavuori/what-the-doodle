import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import tsconfigPathsPlugin from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPathsPlugin(), tanstackStart(), viteReact(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  // build optimizations (ChatGPT)
  build: {
    sourcemap: false, // default is false; ensure it’s off in CI
    target: "es2022",
    cssMinify: "esbuild", // fastest
    minify: "esbuild", // fastest
  },
  esbuild: {
    legalComments: "none",
  },
});
