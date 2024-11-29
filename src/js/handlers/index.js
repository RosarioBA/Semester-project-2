import { updateUserInfo } from './updateUserInfo.js';
import { handleLogout } from './logout.js';
import { toggleAuthUI } from './toggleAuth.js';
import { handleListings } from './listings.js';
import { initializeDropdown } from './dropdown.js'; 
import { initializeCarousel } from './carousel.js';
import { loadProfilePage } from './profile.js';
import { loadActiveBids } from './activeBids.js';
import { initializeSearch } from './search.js';

import './navigation.js';

document.addEventListener('DOMContentLoaded', async () => {
 // Core UI updates
 await updateUserInfo();
 toggleAuthUI();
 initializeDropdown();
  initializeSearch();


 const path = window.location.pathname;

 // Page-specific handlers
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
}

 // Global handlers
 const logoutButton = document.getElementById('logoutButton');
 if (logoutButton) {
   logoutButton.addEventListener('click', handleLogout);
 }
});