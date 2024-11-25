// src/js/handlers/listings.js

import { getListings } from '../api/listings/index.js';

/**
 * Renders a single listing as HTML
 * @param {Object} listing - The listing data
 * @returns {string} HTML string
 */
function createListingHTML(listing) {
    const { title, description, media, endsAt } = listing;
    
    return `
        <div class="bg-white rounded shadow-md p-4">
            <img 
                src="${media?.[0]?.url || '/images/placeholder.jpg'}" 
                alt="${media?.[0]?.alt || 'Listing image'}"
                class="w-full h-48 object-cover rounded"
            >
            <h2 class="text-xl font-semibold mt-2">${title}</h2>
            <p class="text-gray-600 mt-2">${description || 'No description provided'}</p>
            <p class="text-sm text-gray-500 mt-2">Ends: ${new Date(endsAt).toLocaleDateString()}</p>
        </div>
    `;
}

/**
 * Handles loading and displaying listings
 * @param {string} containerId - ID of container element
 */
export async function handleListings(containerId = 'listings') {
    try {
        const container = document.getElementById(containerId);
        
        if (!container) {
            throw new Error('Listings container not found');
        }
        
        // Show loading state
        container.innerHTML = '<div class="text-center">Loading listings...</div>';
        
        // Fetch listings
        const listings = await getListings();
        
        // Display listings or no results message
        if (listings.length === 0) {
            container.innerHTML = '<div class="text-center">No listings found</div>';
            return;
        }
        
        // Create listings grid
        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
        
        // Add each listing to the grid
        listings.forEach(listing => {
            const listingElement = document.createElement('div');
            listingElement.innerHTML = createListingHTML(listing);
            grid.appendChild(listingElement);
        });
        
        // Clear container and add grid
        container.innerHTML = '';
        container.appendChild(grid);
        
    } catch (error) {
        console.error('Error:', error);
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="text-center text-red-500">
                    Failed to load listings. Please try again later.
                </div>
            `;
        }
    }
}