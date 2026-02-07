// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  vite: {
    // Tailwind Vite plugin type differs from Astro's PluginOption (Vite version mismatch)
    // @ts-expect-error
    plugins: [tailwindcss()],
  },
});
