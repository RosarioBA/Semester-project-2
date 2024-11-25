// src/js/handlers/login.js
import { login } from '../api/auth/login.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#loginForm');
  const errorMessage = document.querySelector('#errorMessage');
  const loadingSpinner = document.querySelector('#loadingSpinner');

  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      console.log('📝 Login form submitted');

      const userData = {
        email: form.email.value,
        password: form.password.value,
      };

      try {
        const response = await login(userData);
        console.log('Login Response:', response); // Add this

        if (response.data && response.data.accessToken) {
          localStorage.setItem('token', response.data.accessToken);
          localStorage.setItem('user', JSON.stringify(response.data));
          console.log('Stored user:', JSON.parse(localStorage.getItem('user'))); // Add this
          window.location.href = '/index.html';
        }
      } catch (error) {
        console.error('❌ Login error:', error);
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
        loadingSpinner.classList.add('hidden');
      }
    });
  }
});
