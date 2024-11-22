// src/js/api/auth/login.js
import { API_AUTH_LOGIN, headers } from '../constants.js';

export async function login(userData) {
    try {
        const response = await fetch(API_AUTH_LOGIN, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(userData)
        });

        console.log('Login response status:', response.status); // For debugging

        const json = await response.json();

        if (!response.ok) {
            throw new Error(json.errors?.[0]?.message || 'Login failed');
        }

        return json; // Returns the whole response with data and meta properties

    } catch (error) {
        console.error('Login error:', error);
        throw new Error(error.message || 'An error occurred during login');
    }
}