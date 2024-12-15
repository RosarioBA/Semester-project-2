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
    const { isValid, errors } = validateRegistration(formData);
    if (!isValid) {
      throw new Error(Object.values(errors)[0]);
    }

    // Disable form submission button
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
    }

    // Register user
    await register(formData);
    localStorage.setItem('userCredits', '1000');

    // Hide error message if visible
    const errorMessage = document.getElementById('errorMessage');
    errorMessage?.classList.add('hidden');

    // Show success message
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
      successMessage.textContent = 'Registration successful! Redirecting to login...';
      successMessage.classList.remove('hidden');

      // Scroll to success message if needed
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Wait longer before redirect
    await new Promise((resolve) => setTimeout(resolve, 2000));
    window.location.href = '/pages/login.html';
  } catch (error) {
    console.error('Registration handler error:', error);
    throw error;
  }
}
