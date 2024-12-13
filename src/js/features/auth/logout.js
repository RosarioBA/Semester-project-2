// src/js/handlers/logout.js

/**
 * Handles the user logout process.
 * 
 * This function removes the user's token and user information from local storage
 * and redirects the user to the login page.
 */

export function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/pages/login.html';
}
