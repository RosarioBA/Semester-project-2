// src/js/api/listings/index.js

import { API_BASE_URL } from '../constants.js';

/**
 * Fetches all listings
 * @returns {Promise<Array>} Array of listings
 */
export async function getListings() {
    try {
        const response = await fetch(`${API_BASE_URL}/auction/listings`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const { data } = await response.json();
        return data;
        
    } catch (error) {
        console.error('Error fetching listings:', error);
        throw error;
    }
}