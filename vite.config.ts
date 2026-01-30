import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT:
// base: "./" makes asset paths work even when the site is hosted in a subfolder
// (GitHub Pages repo sites) or embedded at a path like /colleges.
export default defineConfig({
  plugins: [react()],
  base: "./",
});