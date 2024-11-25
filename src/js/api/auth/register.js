/**
 * Registers a new user with the auction house API
 * @param {Object} userData
 * @param {string} userData.name - Username (no punctuation except underscore)
 * @param {string} userData.email - Must be stud.noroff.no email
 * @param {string} userData.password - Min 8 characters
 * @param {string} [userData.bio] - Optional, max 160 chars
 * @param {Object} [userData.avatar] - Optional
 * @param {string} [userData.avatar.url] - Must be valid URL
 * @param {string} [userData.avatar.alt] - Optional, max 120 chars
 * @returns {Promise<Object>} The new user data
 * @throws {Error} If registration fails
 */
// src/js/api/auth/register.js
import { API_AUTH_REGISTER, headers } from '../constants.js';

export async function register(userData) {
  try {
    const response = await fetch(API_AUTH_REGISTER, {
      method: 'POST',
      headers: headers, // Only API key needed for register
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
}
