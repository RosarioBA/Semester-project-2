// src/js/handlers/singleListing.js

import { getSingleListing } from '../api/listings/index.js';

/**
 * Formats a date to a readable string
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Calculates time remaining until end date
 */
function getTimeRemaining(endDate) {
    const total = Date.parse(endDate) - Date.parse(new Date());
    if (total <= 0) return 'Auction ended';

    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);

    return `${days} days ${hours} hours remaining`;
}

/**
 * Renders the listing details
 */
function renderListing(listing) {
    const mainContent = document.querySelector('main');
    if (!mainContent) return;

    // Update page title
    document.title = `${listing.title} | BidLeaf`;

    mainContent.innerHTML = `
        <div class="max-w-3xl mx-auto px-4 py-8">
            <a href="/pages/listings.html" class="text-[#4f6f52] mb-6 inline-block hover:underline">
                &larr; Back to Listings
            </a>

            <div class="bg-white rounded-lg shadow-sm p-6">
                <!-- Image Gallery -->
                <div class="mb-6">
                    ${listing.media.length ? `
                        <img 
                            src="${listing.media[0].url}" 
                            alt="${listing.media[0].alt || listing.title}"
                            class="w-full rounded-lg object-cover max-h-[500px]"
                        />
                    ` : ''}
                </div>

                <h1 class="text-2xl font-semibold mb-4">${listing.title}</h1>

                <!-- Description -->
                <div class="mb-6">
                    <h2 class="text-lg font-medium mb-2">Description</h2>
                    <p class="text-gray-600">${listing.description || 'No description provided'}</p>
                </div>

                <div class="space-y-4">
                    <!-- Time Remaining -->
                    <div class="flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>${getTimeRemaining(listing.endsAt)}</span>
                    </div>

                    <!-- Seller Info -->
                    <div class="flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Seller: ${listing.seller?.name || 'Unknown'}</span>
                    </div>

                    <!-- Bidding Section -->
                    <div class="p-4 bg-gray-50 rounded-lg">
                        <p class="text-lg font-medium mb-4">Current Highest Bid: ${listing._count?.bids || 0} Credits</p>
                        <div class="flex gap-2">
                            <input
                                type="number"
                                id="bidAmount"
                                placeholder="Enter bid amount"
                                min="1"
                                class="flex-1 p-2 border rounded focus:outline-none focus:border-[#4f6f52]"
                            />
                            <button 
                                id="placeBidBtn"
                                class="px-4 py-2 bg-[#D66853] text-white rounded hover:bg-[#D66853]/90 transition-colors"
                            >
                                Place Bid
                            </button>
                        </div>
                    </div>

                    <!-- Bid History -->
                    ${listing.bids?.length ? `
                        <div class="space-y-2">
                            <h2 class="font-medium">Bid History</h2>
                            <div class="space-y-2">
                                ${listing.bids.map(bid => `
                                    <div class="flex items-center gap-2">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>${bid.bidder.name} - Placed bid: ${bid.amount} Credits</span>
                                        <span class="text-sm text-gray-500">${formatDate(bid.created)}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

    // Add bid button listener
    const bidButton = document.getElementById('placeBidBtn');
    if (bidButton) {
        bidButton.addEventListener('click', () => {
            // TODO: Implement bid functionality
            console.log('Place bid clicked');
        });
    }
}

/**
 * Initializes the single listing page
 */
export async function handleSingleListing() {
    try {
        // Get listing ID from URL
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');

        if (!id) {
            throw new Error('No listing ID provided');
        }

        // Show loading state
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="flex justify-center items-center min-h-[400px]">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F6F52]"></div>
                </div>
            `;
        }

        // Fetch and render listing
        const listing = await getSingleListing(id);
        renderListing(listing);

    } catch (error) {
        console.error('Error:', error);
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="max-w-3xl mx-auto px-4 py-8 text-center">
                    <p class="text-red-500">Error loading listing. Please try again later.</p>
                    <a href="/pages/listings.html" class="text-[#4f6f52] mt-4 inline-block hover:underline">
                        &larr; Back to Listings
                    </a>
                </div>
            `;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', handleSingleListing);