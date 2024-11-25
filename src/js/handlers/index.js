// src/js/handlers/index.js
import { updateUserInfo } from './updateUserInfo.js';
import { handleLogout } from './logout.js';
import { toggleAuthUI } from './toggleAuth.js';

document.addEventListener('DOMContentLoaded', () => {
  updateUserInfo();
  toggleAuthUI();

  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
  }
});

//822b4398-be20-4c88-a15e-d5ebb99fdac6
