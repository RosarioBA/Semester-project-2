// src/js/features/auth/toggleAuth.js
import { getUser, isLoggedIn } from '../../utils/userData.js';

/**
 * Toggles the authentication UI elements based on the user's login status.
 * 
 * This function checks if the user is logged in and updates the visibility
 * of login buttons, register button, and user menu accordingly. If the user
 * is logged in, it hides the login and register buttons and shows the user
 * menu. Additionally, it adds click handlers to the username elements to
 * redirect to the profile page.
 * 
 */

export function toggleAuthUI() {
  const user = getUser();
  const loggedIn = isLoggedIn();

  const loginButtons = document.querySelectorAll('[data-auth="login"]');
  const registerButton = document.querySelector('[data-auth="register"]');
  const userMenu = document.querySelectorAll('[data-auth="user-menu"]');

  if (loggedIn && user) {
    loginButtons.forEach((button) => button.classList.add('hidden'));
    registerButton?.classList.add('hidden');
    userMenu.forEach((menu) => {
      menu.classList.remove('hidden');
      menu.classList.add('flex');
    });
    // Add click handlers to usernames
    ['userNameDesktop', 'userNameDropdown'].forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.style.cursor = 'pointer';
        element.addEventListener('click', () => (window.location.href = '/pages/profile.html'));
      }
    });
  }
}