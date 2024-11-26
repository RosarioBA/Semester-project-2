// src/js/api/auth/login.js

import { API_ENDPOINTS, headers } from '../constants.js';

/**
 * Login a user
 * @param {Object} userData - User credentials
 * @param {string} userData.email - User's email (must be stud.noroff.no)
 * @param {string} userData.password - User's password
 * @returns {Promise<Object>} User data including access token
 */
export async function login(userData) {
    try {
        const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.errors?.[0]?.message || 'Login failed');
        }

        // Return the nested data object
        return data.data;

    } catch (error) {
        console.error('Login API Error:', error);
        throw new Error(error.message || 'Failed to log in. Please try again.');
    }
}