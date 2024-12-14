// src/js/features/auth/login.js

import { login } from '../../api/auth/login.js';
import { getProfile } from '../../api/profiles/index.js';

/**
 * Handles the login process by calling the login API and storing user data in localStorage.
 * Redirects to the home page upon successful login.
 *
 * @param {string} email - The email address of the user.
 * @param {string} password - The password of the user.
 * @throws Will throw an error if the login process fails.
 */

export async function handleLogin(email, password) {
  try {
    const userData = await login({ email, password });
    localStorage.setItem('token', userData.accessToken);
    localStorage.setItem('user', JSON.stringify(userData));

    const { data: profile } = await getProfile(userData.name);
    localStorage.setItem('userCredits', profile.credits || 1000);

    // Redirect to home page
    window.location.href = '/';
  } catch (error) {
    console.error('Login handler error:', error);
    throw error;
  }
}

// Initialize form handling
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const errorElement = document.getElementById('errorMessage');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Clear previous error messages
      if (errorElement) {
        errorElement.classList.add('hidden');
        errorElement.textContent = '';
      }

      const email = loginForm.email.value;
      const password = loginForm.password.value;

      try {
        await handleLogin(email, password);
      } catch (error) {
        // Show error to user
        if (errorElement) {
          errorElement.textContent = error.message;
          errorElement.classList.remove('hidden');
        }
      }
    });
  }
});
