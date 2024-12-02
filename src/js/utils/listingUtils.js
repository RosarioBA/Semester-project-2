// src/js/utils/listingUtils.js

/**
 * Creates HTML for a listing card
 */
export function createListingHTML(listing) {
  const { title, description, media, endsAt, _count, seller } = listing;

  const endDate = new Date(endsAt);
  const timeRemaining =
    endDate > new Date() ? `Ends: ${endDate.toLocaleDateString()}` : 'Auction ended';

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

/**
 * Shows loading state in container
 */
export function displayLoadingState(container) {
    container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${Array(6).fill().map(() => `
            <div class="border border-gray-200 shadow rounded-md p-4 w-full">
                <div class="animate-pulse space-y-4">
                    <div class="bg-slate-200 h-48 w-full rounded"></div>
                    <div class="space-y-3">
                        <div class="h-4 bg-slate-200 rounded"></div>
                        <div class="h-4 bg-slate-200 rounded w-2/3"></div>
                        <div class="flex justify-between">
                            <div class="h-4 bg-slate-200 rounded w-1/4"></div>
                            <div class="h-4 bg-slate-200 rounded w-1/4"></div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('')}
    </div>`;
 }
 
 export function showError(container, message) {
    container.innerHTML = `
        <div class="text-center py-12">
            <p class="text-red-500">Error: ${message}</p>
        </div>
    `;
 }
