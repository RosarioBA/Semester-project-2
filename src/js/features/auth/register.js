// src/js/features/auth/register.js

import { register } from '../../api/auth/register.js';
import { validateRegistration } from '../../utils/validation.js';

/**
 * Handles the registration process.
 *
 * @param {Object} formData - The form data containing user registration details.
 * @param {string} formData.name - The name of the user.
 * @param {string} formData.email - The email of the user.
 * @param {string} formData.password - The password of the user.
 * @param {Object} [formData.avatar] - The avatar object containing URL and alt text.
 * @param {string} formData.avatar.url - The URL of the avatar image.
 * @param {string} [formData.avatar.alt] - The alt text for the avatar image.
 * @throws Will throw an error if registration fails or validation errors occur.
 * @returns {Promise<void>} A promise that resolves when registration is complete.
 */

export async function handleRegister(formData) {
  try {
    // Validate form data
    const { isValid, errors } = validateRegistration(formData);
    if (!isValid) {
      throw new Error(Object.values(errors)[0]);
    }

    // Register user
    await register(formData);

    // Set initial credits after registration
    localStorage.setItem('userCredits', '1000');

    // Redirect to login page on success
    window.location.href = '/pages/login.html';
  } catch (error) {
    console.error('Registration handler error:', error);
    throw error;
  }
}

// Initialize form handling
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const errorMessage = document.getElementById('errorMessage');
  const loadingSpinner = document.getElementById('loadingSpinner');

  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      // Reset UI state
      errorMessage?.classList.add('hidden');
      loadingSpinner?.classList.remove('hidden');

      try {
        const formData = {
          name: form.name.value,
          email: form.email.value,
          password: form.password.value,
          avatar: form.avatar?.value
            ? {
                url: form.avatar.value,
                alt: form.avatarAlt?.value || '',
              }
            : undefined,
        };

        await handleRegister(formData);
      } catch (error) {
        if (errorMessage) {
          errorMessage.textContent = error.message;
          errorMessage.classList.remove('hidden');
        }
      } finally {
        loadingSpinner?.classList.add('hidden');
      }
    });
  }
});