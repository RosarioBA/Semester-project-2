// src/js/api/listings/create.js

import { API_BASE_URL, getAuthHeaders } from '../constants.js';

/**
 * Creates a new listing
 * @param {Object} listingData - The listing data
 * @param {string} listingData.title - Title of the listing
 * @param {string} listingData.description - Description of the listing
 * @param {string[]} listingData.tags - Array of tags
 * @param {Object[]} listingData.media - Array of media objects
 * @param {string} listingData.endsAt - End date of the listing
 * @returns {Promise<Object>} The created listing
 */
export async function createListing(listingData) {
    try {
        const response = await fetch(`${API_BASE_URL}/auction/listings`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                title: listingData.title,
                description: listingData.description,
                tags: listingData.tags?.split(',').map(tag => tag.trim()) || [],
                media: listingData.media ? [
                    {
                        url: listingData.media,
                        alt: listingData.title
                    }
                ] : [],
                endsAt: new Date(listingData.deadline).toISOString()
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.errors?.[0]?.message || 'Failed to create listing');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error creating listing:', error);
        throw error;
    }
}