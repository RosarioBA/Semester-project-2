// vite.config.js
import { defineConfig } from 'vite';

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
        main: 'index.html',
        login: 'pages/login.html',
        register: 'pages/register.html',
        profile: 'pages/profile.html',
        listing: 'pages/listing.html',
        singlelisting: 'pages/single-listing.html',
        createlistings: 'pages/create-listing.html',
      },
    },
  },
});
