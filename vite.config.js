// vite.config.js

import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  // Add envDir to point to the project root where .env is located
  envDir: '../',
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