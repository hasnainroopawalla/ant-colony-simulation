/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Relative base so assets resolve when served from the GitHub Pages subpath.
  base: "./",
  plugins: [react(), tailwindcss()],
  build: {
    // Keep `build/` to match the gh-pages deploy and release workflow.
    outDir: "build",
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
  },
});
