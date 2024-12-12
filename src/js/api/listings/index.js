// src/js/api/listings/index.js
import { API_ENDPOINTS, getAuthHeaders, getPublicHeaders } from '../constants.js';

export async function getListings(options = {}) {
  try {
    const queryParams = new URLSearchParams({
      sort: options.sort || 'created',
      sortOrder: options.sortOrder || 'desc',
      _seller: 'true',
    });

    if (options.limit) queryParams.append('limit', options.limit);
    if (options.page) queryParams.append('page', options.page);

    const response = await fetch(`${API_ENDPOINTS.LISTINGS.BASE}?${queryParams}`, {
      headers: getPublicHeaders(),
    });

    const data = await response.json();
    console.log('API Response:', {
      totalListings: data.data?.length,
      meta: data.meta,
      firstListing: data.data?.[0],
      queryParams: queryParams.toString(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch listings');
    }

    return data;
  } catch (error) {
    console.error('Error fetching listings:', error);
    throw error;
  }
}

export async function getSingleListing(id) {
  try {
    const queryParams = new URLSearchParams({
      _seller: 'true',
      _bids: 'true',
    });

    const url = `${API_ENDPOINTS.LISTINGS.BASE}/${id}?${queryParams}`;
    console.log('Request URL:', url);

    // Use public headers for fetching single listing
    const headers = getPublicHeaders();
    console.log('Headers:', headers);

    const response = await fetch(url, {
      headers: headers,
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      throw new Error('Failed to fetch listing');
    }

    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function updateListing(id, data) {
  try {
    const response = await fetch(`${API_ENDPOINTS.LISTINGS.BASE}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(), // Keep auth headers for updating
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        tags: data.tags,
        media: data.media,
        endsAt: data.endsAt ? new Date(data.endsAt).toISOString() : undefined,
      }),
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
