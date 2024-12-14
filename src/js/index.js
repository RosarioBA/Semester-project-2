// src/js/index.js
import { updateUserInfo } from './components/userInfo.js';
import { handleLogout } from './features/auth/logout.js';
import { toggleAuthUI } from './features/auth/toggleAuth.js';
import { handleListings } from './features/listings/listings.js';
import { initializeDropdown } from './components/dropdown.js';
import { initializeCarousel } from './components/carousel.js';
import { loadProfilePage } from './features/profile/profile.js';
import { loadActiveBids } from './features/listings/activeBids.js';
import { initializeSearch } from './features/search/search.js';
import { initializeEditListing } from './features/listings/editListing.js';
import { handleListingsPage } from './features/listings/listingsPage.js';
import './components/navigation.js';

document.addEventListener('DOMContentLoaded', async () => {
  await updateUserInfo();
  toggleAuthUI();
  initializeDropdown();
  initializeSearch();

  const path = window.location.pathname;

  if (path === '/pages/profile.html') {
    loadProfilePage();
  } else if (path === '/pages/active-bids.html') {
    console.log('Active Bids Page Detected');
    loadActiveBids();
  } else if (path === '/' || path === '/index.html') {
    initializeCarousel();
    const listingsContainer = document.getElementById('listings');
    if (listingsContainer) {
      handleListings('listings', { isHomePage: true });
    }
  } else if (path === '/pages/edit-listing.html') {
    initializeEditListing();
  } else if (path === '/pages/listings.html') {
    handleListingsPage();
  }

  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
  }
});
