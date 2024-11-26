// src/js/handlers/listingsPage.js

import { API_BASE_URL, getAuthHeaders } from '../api/constants.js';

const ITEMS_PER_PAGE = 12;
let currentPage = 1;

export async function handleListingsPage(containerId = 'listings') {
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

        // Initialize sort select listener
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', async (e) => {
                const [sortField, sortOrder] = e.target.value.split('-');
                await fetchAndDisplayListings(container, sortField, sortOrder);
            });
        }

        // Initial fetch
        await fetchAndDisplayListings(container);

    } catch (error) {
        console.error('Error loading listings:', error);
        if (container) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <p class="text-red-500">Error: ${error.message}</p>
                </div>
            `;
        }
    }
}

async function fetchAndDisplayListings(container, sort = 'created', sortOrder = 'desc') {
    try {
        const queryParams = new URLSearchParams({
            sort,
            sortOrder,
            limit: ITEMS_PER_PAGE,
            page: currentPage,
            _seller: 'true'
        });

        const response = await fetch(`${API_BASE_URL}/auction/listings?${queryParams}`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch listings');
        }

        const { data: listings, meta } = await response.json();

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

        // Update pagination
        updatePagination(meta);

    } catch (error) {
        throw error;
    }
}

function updatePagination(meta) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;

    const { currentPage: page, pageCount, isFirstPage, isLastPage } = meta;
    
    const paginationHTML = `
        <div class="flex justify-center items-center gap-4">
            <button 
                ${isFirstPage ? 'disabled' : ''}
                class="px-4 py-2 rounded-md ${isFirstPage 
                    ? 'bg-gray-100 text-gray-400' 
                    : 'bg-[#4F6F52] text-white hover:bg-[#4F6F52]/90'}"
                onclick="changePage(${page - 1})"
            >
                Previous
            </button>
            <span class="text-gray-600">
                Page ${page} of ${pageCount}
            </span>
            <button 
                ${isLastPage ? 'disabled' : ''}
                class="px-4 py-2 rounded-md ${isLastPage 
                    ? 'bg-gray-100 text-gray-400' 
                    : 'bg-[#4F6F52] text-white hover:bg-[#4F6F52]/90'}"
                onclick="changePage(${page + 1})"
            >
                Next
            </button>
        </div>
    `;

    paginationContainer.innerHTML = paginationHTML;
}

// Add this function to the global scope for the onclick handlers
window.changePage = async function(newPage) {
    currentPage = newPage;
    const container = document.getElementById('listings');
    const sortSelect = document.getElementById('sortSelect');
    const [sort, sortOrder] = sortSelect ? sortSelect.value.split('-') : ['created', 'desc'];
    await fetchAndDisplayListings(container, sort, sortOrder);
};

// Reuse your existing createListingHTML function
function createListingHTML(listing) {
    const { title, description, media, endsAt, _count, created, seller } = listing;
    
    const endDate = new Date(endsAt);
    const timeRemaining = endDate > new Date() ? 
        `Ends: ${endDate.toLocaleDateString()}` : 
        'Auction ended';

    return `
        <article class="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div class="relative aspect-w-16 aspect-h-9 mb-4">
                <img 
                    src="${media?.[0]?.url || '/api/placeholder/400/320'}" 
                    alt="${media?.[0]?.alt || title}"
                    class="w-full h-48 object-cover rounded-md"
                />
                <div class="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs text-[#4F6F52]">
                    ${_count?.bids || 0} bids
                </div>
            </div>
            <h3 class="font-medium text-lg mb-2">${title}</h3>
            <p class="text-sm text-gray-600 mb-2 line-clamp-2">${description || 'No description provided'}</p>
            <div class="flex flex-col gap-1 text-sm">
                <span class="text-gray-500">${timeRemaining}</span>
                <span class="text-[#4F6F52]">By: ${seller?.name || 'Unknown seller'}</span>
            </div>
        </article>
    `;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    handleListingsPage();
});