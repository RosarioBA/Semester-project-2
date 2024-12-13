
import { getSingleListing } from '../../api/listings/index.js';
import { initializeBidding } from './bid.js';  // Now it's in the same directory  
import { formatTimeRemaining } from '../../utils/listingUtils.js';
import { getToken } from '../../utils/storage.js';

function renderBidHistory(bids) {
  if (!bids?.length) return '';

  return `
        <div class="space-y-2 mt-4">
            <h2 class="font-medium">Bid History (${bids.length} bids)</h2>
            ${bids
              .sort((a, b) => b.amount - a.amount)
              .map(
                (bid) => `
                <div class="flex items-center justify-between py-2 border-b last:border-0">
                    <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-[#4F6F52]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <a href="/pages/profile.html?name=${bid.bidder.name}" 
                           class="hover:text-[#4F6F52] hover:underline">
                          ${bid.bidder.name}
                        </a>
                    </div>
                    <div class="flex flex-col items-end">
                        <span class="font-medium">${bid.amount} Credits</span>
                        <span class="text-sm text-gray-500">${new Date(bid.created).toLocaleDateString()}</span>
                    </div>
                </div>
            `
              )
              .join('')}
        </div>
    `;
}

function renderListing(listing) {
  if (!listing) {
    throw new Error('Invalid listing data');
  }

  const mainContent = document.querySelector('main');
  if (!mainContent) return;

  const isLoggedIn = !!getToken();

  // Safely access nested properties
  const title = listing?.title || 'Untitled';
  const description = listing?.description || 'No description provided';
  const sellerName = listing?.seller?.name || 'Unknown';
  const endsAt = listing?.endsAt ? new Date(listing.endsAt) : null;
  const timeRemaining = endsAt && !isNaN(endsAt) ? formatTimeRemaining(endsAt) : 'Invalid Date';

  const bids = listing?.bids || [];
  const highestBid = bids.length ? Math.max(...bids.map((bid) => bid.amount)) : 0;
  const mediaUrl = listing?.media?.[0]?.url || null;
  const mediaAlt = listing?.media?.[0]?.alt || title;

  mainContent.innerHTML = `
    <div class="max-w-3xl mx-auto px-4 py-8">
      <a href="/pages/listings.html" class="text-[#4f6f52] mb-6 inline-block hover:underline">
        &larr; Back to Listings
      </a>

      <div class="bg-white rounded-lg shadow-sm p-6">
        ${
          mediaUrl
            ? `
          <div class="mb-6">
            <img 
              src="${mediaUrl}" 
              alt="${mediaAlt}"
              class="w-full rounded-lg object-cover max-h-[500px]"
              onerror="this.src='/api/placeholder/400/320'"
            />
          </div>
        `
            : ''
        }

        <h1 class="text-2xl font-semibold mb-4">${title}</h1>

        <div class="mb-6">
          <h2 class="text-lg font-medium mb-2">Description</h2>
          <p class="text-gray-600">${description}</p>
        </div>

        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>${timeRemaining}</span>
          </div>

          <div class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Seller: 
              <a href="/pages/profile.html?name=${sellerName}" 
                 class="text-[#4F6F52] hover:underline">
                ${sellerName}
              </a>
            </span>
          </div>

          <!-- Bidding Section -->
          <div class="bidding-section">
            <div class="p-4 bg-gray-50 rounded-lg">
              <p class="text-lg font-medium mb-4">Current Highest Bid: ${highestBid} Credits</p>
              ${
                isLoggedIn
                  ? `
                <div class="flex gap-2">
                  <input
                    type="number"
                    id="bidAmount"
                    placeholder="Enter bid amount"
                    min="${highestBid + 1}"
                    class="flex-1 p-2 border rounded focus:outline-none focus:border-[#4f6f52]"
                  />
                  <button 
                    id="placeBidBtn"
                    class="px-4 py-2 bg-[#D66853] text-white rounded hover:bg-[#D66853]/90 transition-colors"
                  >
                    Place Bid
                  </button>
                </div>
                <p id="bidError" class="text-red-500 mt-2 text-sm hidden"></p>
              `
                  : `
                <div class="text-center">
                  <p class="mb-4 text-gray-600">Want to place a bid?</p>
                  <a 
                    href="/pages/login.html" 
                    class="inline-block px-6 py-2 bg-[#4F6F52] text-white rounded hover:bg-[#4F6F52]/90 transition-colors"
                  >
                    Login to Bid
                  </a>
                </div>
              `
              }
            </div>
          </div>

          ${renderBidHistory(bids)}
        </div>
      </div>
    </div>
  `;
}

export async function handleSingleListing() {
  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) throw new Error('No listing ID provided');

    const mainContent = document.querySelector('main');
    if (!mainContent) return;

    mainContent.innerHTML = `
      <div class="flex justify-center items-center min-h-[400px]">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F6F52]"></div>
      </div>
    `;

    const response = await getSingleListing(id);
    renderListing(response.data);

    // Only initialize bidding if user is logged in
    if (getToken()) {
      // Updated to use getToken
      initializeBidding(response.data, async () => {
        const updatedResponse = await getSingleListing(id);
        renderListing(updatedResponse.data);
      });
    }
  } catch (error) {
    console.error('Error:', error);
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.innerHTML = `
        <div class="max-w-3xl mx-auto px-4 py-8 text-center">
          <p class="text-red-500">${error.message}</p>
          <a href="/pages/listings.html" class="text-[#4f6f52] mt-4 inline-block hover:underline">
            &larr; Back to Listings
          </a>
        </div>
      `;
    }
  }
}

document.addEventListener('DOMContentLoaded', handleSingleListing);
