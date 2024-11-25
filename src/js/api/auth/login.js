// src/js/api/auth/login.js
import { API_AUTH_LOGIN, headers } from '../constants.js';

export async function login(userData) {
  try {
    const response = await fetch(API_AUTH_LOGIN, {
      method: 'POST',
      headers: headers, // Only API key needed for login
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
}
