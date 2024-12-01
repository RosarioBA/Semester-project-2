// src/js/api/listings/index.js
import { API_ENDPOINTS, getAuthHeaders, getPublicHeaders } from '../constants.js';

export async function getListings(options = {}) {
    try {
        const queryParams = new URLSearchParams({
            sort: options.sort || 'created',
            sortOrder: options.sortOrder || 'desc',
            _seller: 'true'
        });

        if (options.limit) queryParams.append('limit', options.limit);
        if (options.page) queryParams.append('page', options.page);

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

        return response.json();
    } catch (error) {
        console.error('Error fetching listing:', error);
        throw error;
    }
}

export async function updateListing(id, data) {
    try {
        const response = await fetch(`${API_ENDPOINTS.LISTINGS.BASE}/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                title: data.title,
                description: data.description,
                tags: data.tags,
                media: data.media,
                endsAt: data.endsAt ? new Date(data.endsAt).toISOString() : undefined
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.errors?.[0]?.message || 'Failed to update listing');
        }

        return response.json();
    } catch (error) {
        console.error('Error updating listing:', error);
        throw error;
    }
}