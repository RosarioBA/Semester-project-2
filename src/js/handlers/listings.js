// src/js/handlers/listings.js

import { API_BASE_URL, getAuthHeaders } from '../api/constants.js';

/**
 * Renders a listing card
 * @param {Object} listing - The listing data
 * @returns {string} HTML string
 */
function createListingHTML(listing) {
    const { title, description, media, endsAt, _count } = listing;
    
    return `
        <article class="bg-white rounded-lg shadow-sm p-4">
            <div class="aspect-w-16 aspect-h-9 mb-4">
                <img 
                    src="${media?.[0]?.url || '/api/placeholder/400/320'}" 
                    alt="${media?.[0]?.alt || title}"
                    class="w-full h-48 object-cover rounded-md"
                />
            </div>
            <h3 class="font-medium mb-2">${title}</h3>
            <p class="text-sm text-gray-600 mb-2">${description || 'No description provided'}</p>
            <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500">Ends: ${new Date(endsAt).toLocaleDateString()}</span>
                <span class="text-[#4F6F52]">${_count?.bids || 0} bids</span>
            </div>
        </article>
    `;
}

/**
 * Fetches and displays all listings
 * @param {string} containerId - The ID of the container element
 */
export async function handleListings(containerId = 'listings') {
    try {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container with id '${containerId}' not found`);
        }

        // Show loading state
        container.innerHTML = `
            <div class="text-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F6F52] mx-auto"></div>
                <p class="text-gray-500 mt-4">Loading listings...</p>
            </div>
        `;

        // Fetch listings
        const response = await fetch(`${API_BASE_URL}/auction/listings`, {
            headers: {
                ...getAuthHeaders()
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch listings');
        }

        const { data: listings } = await response.json();

        // Handle no listings
        if (!listings || listings.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <p class="text-gray-500">No listings found</p>
                </div>
            `;
            return;
        }

        // Create grid container
        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

        // Add listings to grid
        listings.forEach(listing => {
            const listingElement = document.createElement('div');
            listingElement.innerHTML = createListingHTML(listing);
            listingElement.querySelector('article').addEventListener('click', () => {
                window.location.href = `/pages/single-listing.html?id=${listing.id}`;
            });
            grid.appendChild(listingElement);
        });

        // Clear container and add grid
        container.innerHTML = '';
        container.appendChild(grid);

    } catch (error) {
        console.error('Error loading listings:', error);
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <p class="text-red-500">Failed to load listings. Please try again later.</p>
                </div>
            `;
        }
    }
}