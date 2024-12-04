// src/js/routes.js
import { loadProfilePage } from './features/profile/profile.js';
import { loadActiveBids } from './features/profile/activeBids.js';
import { handleListings } from './features/listings/listings.js';
import { initializeCarousel } from './components/carousel.js';
import { initializeEditListing } from './features/listings/editListing.js';

export const routes = {
  '/': () => {
    initializeCarousel();
    handleListings('listings', { isHomePage: true });
  },
  '/index.html': () => {
    initializeCarousel();
    handleListings('listings', { isHomePage: true });
  },
  '/pages/profile.html': loadProfilePage,
  '/pages/active-bids.html': loadActiveBids,
  '/pages/edit-listing.html': initializeEditListing
};