// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: "static",
  vite: {
    // @ts-expect-error - Tailwind Vite plugin type differs from Astro PluginOption
    plugins: [tailwindcss()],
  },
  integrations: [react()],
});
