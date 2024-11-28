// src/js/handlers/profile.js
import { getProfile } from '../api/profiles/index.js';
import { getUser } from '../utils/storage.js';

export async function loadProfilePage() {
    const path = window.location.pathname;
    if (path !== '/pages/profile.html') return;

    const user = getUser();
    if (!user) {
        window.location.href = '/pages/login.html';
        return;
    }

    try {
        const { data: profile } = await getProfile(user.name);
        updateProfileDisplay(profile);
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

function updateProfileDisplay(profile) {
    document.querySelectorAll('.profile-name').forEach(el => {
        el.textContent = profile.name;
    });

    document.querySelectorAll('.profile-email').forEach(el => {
        el.textContent = profile.email;
    });

    document.querySelectorAll('.profile-credits').forEach(el => {
        el.textContent = `${profile.credits} credits available`;
    });

    if (profile.avatar?.url) {
        document.querySelectorAll('.profile-avatar').forEach(el => {
            el.src = profile.avatar.url;
            el.alt = profile.avatar.alt || 'Profile avatar';
        });
    }

    const listingsContainer = document.querySelector('.listings-container');
    if (!listingsContainer) return;

    if (!profile.listings?.length) {
        listingsContainer.innerHTML = '<p class="text-gray-500 text-center py-4">No listings yet</p>';
        return;
    }

    listingsContainer.innerHTML = profile.listings.map(listing => `
        <div class="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
            <div class="flex items-center gap-4">
                <img src="${listing.media?.[0]?.url || '/api/placeholder/64/64'}" 
                     alt="${listing.title}" 
                     class="w-16 h-16 rounded object-cover">
                <div>
                    <h3 class="font-medium">${listing.title}</h3>
                    <p class="text-gray-600">${listing._count?.bids || 0} bids</p>
                </div>
            </div>
            <a href="/pages/edit-listing.html?id=${listing.id}" 
               class="px-4 py-2 bg-[#4f6f52] text-white rounded">
                Edit
            </a>
        </div>
    `).join('');
}