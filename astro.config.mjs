// @ts-check
import { defineConfig } from 'astro/config';

// Deployed to GitHub Pages at https://itk-dev.github.io/itk-tech-radar/
export default defineConfig({
  site: 'https://itk-dev.github.io',
  base: '/itk-tech-radar/',
  trailingSlash: 'always',
  outDir: 'dist',
  vite: {
    build: {
      // <use href="sprite.svg#id"> cannot point into a data: URI, so the icon
      // sprite must stay a file; other small assets use Vite's default.
      assetsInlineLimit: (file) => (file.endsWith('lucide-sprite.svg') ? false : undefined),
    },
  },
});
