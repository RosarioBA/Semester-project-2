// src/js/api/listings/index.js

import { API_ENDPOINTS, getAuthHeaders, getPublicHeaders } from '../constants.js';

/**
 * Fetches listings with optional filters and pagination
 */
export async function getListings(options = {}) {
    try {
        const queryParams = new URLSearchParams({
            sort: options.sort || 'created',
            sortOrder: options.sortOrder || 'desc',
            _seller: 'true'
        });

        if (options.limit) queryParams.append('limit', options.limit);
        if (options.page) queryParams.append('page', options.page);

        // Use public headers for listings (no auth required)
        const response = await fetch(`${API_ENDPOINTS.LISTINGS.BASE}?${queryParams}`, {
            headers: getPublicHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch listings');
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching listings:', error);
        throw error;
    }
}

/**
 * Creates a new listing (requires authentication)
 */
export async function createListing(listingData) {
    try {
        const response = await fetch(API_ENDPOINTS.LISTINGS.BASE, {
            method: 'POST',
            headers: getAuthHeaders(), // This one needs auth
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

        return response.json();
    } catch (error) {
        console.error('Error creating listing:', error);
        throw error;
    }
}

// Add this function to your existing listings API file
/**
 * Fetches a single listing by ID
 * @param {string} id - Listing ID
 * @returns {Promise<Object>} Listing data
 */
export async function getSingleListing(id) {
    try {
        const queryParams = new URLSearchParams({
            _seller: 'true',
            _bids: 'true'
        });

        const response = await fetch(`${API_ENDPOINTS.LISTINGS.BASE}/${id}?${queryParams}`, {
            headers: getPublicHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch listing');
        }

        const { data } = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching listing:', error);
        throw error;
    }
}