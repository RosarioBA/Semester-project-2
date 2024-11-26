// src/js/handlers/index.js
import { updateUserInfo } from './updateUserInfo.js';
import { handleLogout } from './logout.js';
import { toggleAuthUI } from './toggleAuth.js';
import { handleListings } from './listings.js';
import { initializeDropdown } from './dropdown.js';
import './navigation.js';

document.addEventListener('DOMContentLoaded', () => {
  updateUserInfo();
  toggleAuthUI();
  initializeDropdown();
  
  const listingsContainer = document.getElementById('listings');
  if (listingsContainer) {
    handleListings('listings', { isHomePage: window.location.pathname === '/' || window.location.pathname === '/index.html' });
  }
  
  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
  }
});
//822b4398-be20-4c88-a15e-d5ebb99fdac6
