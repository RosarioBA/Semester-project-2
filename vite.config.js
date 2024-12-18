import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: 'src',
  envDir: '../',
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        login: resolve(__dirname, 'src/pages/login.html'),
        register: resolve(__dirname, 'src/pages/register.html'),
        profile: resolve(__dirname, 'src/pages/profile.html'),
        listing: resolve(__dirname, 'src/pages/listings.html'),
        singlelisting: resolve(__dirname, 'src/pages/single-listing.html'),
        createlistings: resolve(__dirname, 'src/pages/create-listing.html'),
        activebids: resolve(__dirname, 'src/pages/active-bids.html'),
        editlisting: resolve(__dirname, 'src/pages/edit-listing.html'),
      },
    },
  },
});
