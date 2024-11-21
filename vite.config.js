import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
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
