// src/js/handlers/index.js
import { updateUserInfo } from './updateUserInfo.js';
import { handleLogout } from './logout.js';
import { toggleAuthUI } from './toggleAuth.js';
import { handleListings } from './listings.js';
import { initializeDropdown } from './dropdown.js';
import { initializeCarousel } from './carousel.js';
import { loadProfilePage } from './profile.js';
import { loadActiveBids } from './activeBids.js';
import { initializeSearch } from './search.js';
import { initializeEditListing } from './editListing.js';
import { handleListingsPage } from './listingspage.js';  // Add this import
import './navigation.js';

document.addEventListener('DOMContentLoaded', async () => {
  await updateUserInfo();
  toggleAuthUI();
  initializeDropdown();
  initializeSearch();

  const path = window.location.pathname;

  if (path === '/pages/profile.html') {
    loadProfilePage();
  } else if (path === '/pages/active-bids.html') {
    loadActiveBids();
  } else if (path === '/' || path === '/index.html') {
    initializeCarousel();
    const listingsContainer = document.getElementById('listings');
    if (listingsContainer) {
      handleListings('listings', { isHomePage: true });
    }
  } else if (path === '/pages/edit-listing.html') {
    initializeEditListing();
  } else if (path === '/pages/listings.html') {  // Add this condition
    handleListingsPage();
  }

  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
  }
});