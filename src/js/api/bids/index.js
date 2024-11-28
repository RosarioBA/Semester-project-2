// src/js/api/bids/index.js

import { API_ENDPOINTS, getAuthHeaders } from '../constants.js';

export async function placeBid(listingId, amount) {
    const response = await fetch(`${API_ENDPOINTS.LISTINGS.BASE}/${listingId}/bids`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ amount: Number(amount) })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errors?.[0]?.message || 'Failed to place bid');
    }

    return response.json();
}