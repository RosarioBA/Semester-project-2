// src/js/handlers/login.js

import { login } from '../api/auth/login.js';
import { getProfile } from '../api/profiles/index.js';  

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
// src/js/handlers/login.js
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const errorElement = document.getElementById('errorMessage'); // Changed from 'loginError'
  
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
