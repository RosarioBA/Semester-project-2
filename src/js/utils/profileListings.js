import { formatTimeRemaining } from './listingUtils.js';

export function categorizeListings(listings) {
  const now = new Date();
  return listings.reduce(
    (acc, listing) => {
      const endsAt = new Date(listing.endsAt);
      if (endsAt > now) {
        acc.active.push(listing);
      } else {
        acc.past.push(listing);
      }
      return acc;
    },
    { active: [], past: [] }
  );
}

export function renderListingCard(listing, isOwnProfile) {
  const endsAt = new Date(listing.endsAt);
  const isActive = endsAt > new Date();
  const timeRemaining = isActive ? formatTimeRemaining(endsAt) : 'Ended';

  return `
    <div class="bg-white rounded-lg shadow-sm p-4 flex justify-between items-start">
      <a href="/pages/single-listing.html?id=${listing.id}" class="flex items-start gap-4 flex-1">
        <img src="${listing.media?.[0]?.url || '/api/placeholder/64/64'}" 
             alt="${listing.title}" 
             class="w-16 h-16 rounded object-cover flex-shrink-0">
        <div class="min-w-0 flex-1">
          <h3 class="font-medium truncate">${listing.title}</h3>
          <div class="text-gray-600 text-sm space-y-1">
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>${timeRemaining}</span>
            </div>
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>${listing._count?.bids || 0} bids</span>
              ${listing.bids?.[0] ? ` · Highest: ${listing.bids[0].amount} Credits` : ''}
            </div>
          </div>
        </div>
      </a>
      ${
        isOwnProfile && isActive
          ? `
        <a href="/pages/edit-listing.html?id=${listing.id}" 
           class="ml-4 px-4 py-2 bg-[#4f6f52] text-white rounded hover:bg-[#4f6f52]/90 transition-colors">
          Edit
        </a>
      `
          : ''
      }
    </div>
  `;
}

export function renderListingsSection(profile, isOwnProfile) {
  const { active, past } = categorizeListings(profile.listings || []);

  return `
    <!-- Active Listings Section -->
    <div class="mb-8">
      <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
        <svg class="w-5 h-5 text-[#4F6F52]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Active Listings (${active.length})
      </h2>
      ${
        active.length
          ? `<div class="space-y-4">
          ${active.map((listing) => renderListingCard(listing, isOwnProfile)).join('')}
        </div>`
          : '<p class="text-gray-500 text-center py-4">No active listings</p>'
      }
    </div>

    <!-- Past Listings Section -->
    <div>
      <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Past Listings (${past.length})
      </h2>
      ${
        past.length
          ? `<div class="space-y-4 opacity-75">
          ${past.map((listing) => renderListingCard(listing, isOwnProfile)).join('')}
        </div>`
          : '<p class="text-gray-500 text-center py-4">No past listings</p>'
      }
    </div>
  `;
}
