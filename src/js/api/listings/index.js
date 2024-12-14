import { API_ENDPOINTS, getAuthHeaders, getPublicHeaders } from '../constants.js';

/**
 * Fetches a list of listings from the API.
 *
 * @param {Object} [options={}] - Options for fetching listings.
 * @param {string} [options.sort='created'] - Sort field.
 * @param {string} [options.sortOrder='desc'] - Sort order.
 * @param {number} [options.limit] - Limit the number of listings.
 * @param {number} [options.page] - Page number for pagination.
 * @returns {Promise<Object>} The data from the API response.
 * @throws {Error} If the fetch operation fails.
 */

export async function getListings(options = {}) {
  try {
    const queryParams = new URLSearchParams({
      sort: options.sort || 'created',
      sortOrder: options.sortOrder || 'desc',
      _seller: 'true',
    });

    if (options.limit) queryParams.append('limit', options.limit);
    if (options.page) queryParams.append('page', options.page);
    // Add _active parameter when it's provided
    if (options._active !== undefined) {
      queryParams.append('_active', options._active);
    }

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

/**
 * Fetches a single listing by its ID from the API.
 *
 * @param {string} id - The ID of the listing to fetch.
 * @returns {Promise<Object>} The data from the API response.
 * @throws {Error} If the fetch operation fails.
 */

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


/**
 * Updates a listing by its ID.
 *
 * @param {string} id - The ID of the listing to update.
 * @param {Object} data - The data to update the listing with.
 * @param {string} data.title - The title of the listing.
 * @param {string} data.description - The description of the listing.
 * @param {Array<string>} data.tags - The tags associated with the listing.
 * @param {Array<string>} data.media - The media URLs associated with the listing.
 * @param {string} [data.endsAt] - The end date of the listing in ISO format.
 * @returns {Promise<Object>} The updated listing data from the API response.
 * @throws {Error} If the update operation fails.
 */

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
