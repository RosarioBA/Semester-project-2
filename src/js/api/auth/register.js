// src/js/api/auth/register.js

import { API_ENDPOINTS, headers } from '../constants.js';

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
export async function register(userData) {
    try {
        const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.errors?.[0]?.message || 'Registration failed');
        }

        return data.data;
    } catch (error) {
        console.error('Registration API Error:', error);
        throw new Error(error.message || 'Failed to register. Please try again.');
    }
}