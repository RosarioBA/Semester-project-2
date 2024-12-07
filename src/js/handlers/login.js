// src/js/handlers/login.js

import { login } from '../api/auth/login.js';

export async function handleLogin(email, password) {
  try {
    const userData = await login({ email, password });

    // Store user data and token
    localStorage.setItem('token', userData.accessToken);
    localStorage.setItem('user', JSON.stringify(userData));

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
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Clear previous error messages
      const errorElement = document.getElementById('loginError');
      if (errorElement) {
        errorElement.classList.add('hidden');
        errorElement.textContent = '';
      }

      // Get form data
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
