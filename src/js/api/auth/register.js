
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
// src/js/api/auth/register.js
import { API_AUTH_REGISTER, headers } from '../constants.js';

export async function register(userData) {
    try {
        console.log('🟡 Attempting to register with data:', userData);
        
        const response = await fetch(API_AUTH_REGISTER, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(userData)
        });

        const json = await response.json();
        console.log('🟢 Register API Response:', json);

        if (!response.ok) {
            console.error('🔴 Registration failed:', json);
            throw new Error(json.errors?.[0]?.message || 'Registration failed');
        }

        return json;

    } catch (error) {
        console.error('🔴 Registration error:', error.message);
        throw error;
    }
}