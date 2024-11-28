// src/js/handlers/toggleAuth.js
import { getUser, isLoggedIn } from '../utils/userData.js';

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
    ['userNameDesktop', 'userNameDropdown'].forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.style.cursor = 'pointer';
        element.addEventListener('click', () => window.location.href = '/pages/profile.html');
      }
    });
  }
}