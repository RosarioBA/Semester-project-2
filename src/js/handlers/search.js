// src/js/handlers/search.js
import { searchAll } from '../api/search/index.js';

export function initializeSearch() {
    const searchInputs = ['desktopSearch', 'mobileSearch'].map(id => document.getElementById(id));
    const resultsContainers = ['desktopSearchResults', 'mobileSearchResults'].map(id => document.getElementById(id));
    let searchTimeout;

    searchInputs.forEach((input, index) => {
        if (!input) return;

        input.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length < 2) {
                resultsContainers[index].classList.add('hidden');
                return;
            }

            searchTimeout = setTimeout(() => performSearch(query, resultsContainers[index]), 300);
        });

        // Close results when clicking outside
        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !resultsContainers[index].contains(e.target)) {
                resultsContainers[index].classList.add('hidden');
            }
        });
    });
}

async function performSearch(query, resultsContainer) {
    try {
        const { listings, profiles } = await searchAll(query);
        displaySearchResults(listings, profiles, resultsContainer);
    } catch (error) {
        console.error('Search error:', error);
        resultsContainer.innerHTML = '<p class="text-center text-red-500 p-4">Error performing search</p>';
        resultsContainer.classList.remove('hidden');
    }
}

function displaySearchResults(listings, profiles, container) {
    let html = '';

    if (profiles?.length) {
        html += `
            <div class="p-4 border-b">
                <h3 class="font-semibold text-sm text-gray-500 mb-2">PROFILES</h3>
                <div class="space-y-2">
                    ${profiles.map(profile => `
                        <a href="/pages/profile.html?name=${profile.name}" 
                           class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md">
                            <img src="${profile.avatar?.url || '/api/placeholder/32/32'}" 
                                 alt="${profile.name}" 
                                 class="w-8 h-8 rounded-full">
                            <div>
                                <p class="font-medium">${profile.name}</p>
                                <p class="text-sm text-gray-500">${profile._count.listings} listings</p>
                            </div>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    }

    if (listings?.length) {
        html += `
            <div class="p-4">
                <h3 class="font-semibold text-sm text-gray-500 mb-2">LISTINGS</h3>
                <div class="space-y-2">
                    ${listings.map(listing => `
                        <a href="/pages/single-listing.html?id=${listing.id}" 
                           class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md">
                            <img src="${listing.media?.[0]?.url || '/api/placeholder/64/64'}" 
                                 alt="${listing.title}" 
                                 class="w-12 h-12 rounded object-cover">
                            <div>
                                <p class="font-medium">${listing.title}</p>
                                <p class="text-sm text-gray-500">${listing._count?.bids || 0} bids</p>
                            </div>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    }

    if (!html) {
        html = '<p class="text-center text-gray-500 p-4">No results found</p>';
    }

    container.innerHTML = html;
    container.classList.remove('hidden');
}