// src/js/api/listings/edit.js
import { API_ENDPOINTS, getAuthHeaders } from '../constants.js';

export async function getListing(id) {
   const response = await fetch(`${API_ENDPOINTS.LISTINGS.BASE}/${id}`, {
       headers: getAuthHeaders()
   });
   return response.json();
}

export async function updateListing(id, data) {
   const response = await fetch(`${API_ENDPOINTS.LISTINGS.BASE}/${id}`, {
       method: 'PUT',
       headers: getAuthHeaders(),
       body: JSON.stringify(data)
   });
   return response.json();
}

// src/js/handlers/editListing.js
import { getListing, updateListing } from '../api/listings/edit.js';

export function initializeEditListing() {
   const form = document.getElementById('editListingForm');
   const addMediaBtn = document.getElementById('addMediaBtn');
   const mediaList = document.getElementById('mediaList');
   const urlParams = new URLSearchParams(window.location.search);
   const listingId = urlParams.get('id');

   if (!listingId) {
       window.location.href = '/pages/profile.html';
       return;
   }

   loadListing(listingId);
   
   addMediaBtn?.addEventListener('click', () => {
       addMediaInput();
   });

   form?.addEventListener('submit', async (e) => {
       e.preventDefault();
       await saveListing(listingId);
   });
}

async function loadListing(id) {
    try {
        const { data: listing } = await getListing(id);
        document.getElementById('title').value = listing.title;
        document.getElementById('description').value = listing.description;
        document.getElementById('tags').value = listing.tags?.join(', ') || '';
        
        // Format date for datetime-local input
        const deadline = new Date(listing.endsAt);
        const formattedDate = deadline.toISOString().slice(0, 16);
        document.getElementById('deadline').value = formattedDate;

        // Handle media
        const mediaList = document.getElementById('mediaList');
        mediaList.innerHTML = listing.media.map(media => `
            <div class="flex gap-3">
                <input type="url" value="${media.url}" placeholder="Image URL"
                    class="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f6f52]">
                <input type="text" value="${media.alt}" placeholder="Alt text"
                    class="w-1/3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f6f52]">
                <button type="button" class="px-3 text-red-500 hover:text-red-700">&times;</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading listing:', error);
    }
}

function populateForm(listing) {
   document.getElementById('title').value = listing.title;
   document.getElementById('description').value = listing.description;
   document.getElementById('tags').value = listing.tags?.join(', ') || '';
   
   const mediaList = document.getElementById('mediaList');
   mediaList.innerHTML = '';
   
   listing.media?.forEach(media => {
       addMediaInput(media);
   });
}

function addMediaInput(media = null) {
   const mediaList = document.getElementById('mediaList');
   const mediaDiv = document.createElement('div');
   mediaDiv.className = 'flex gap-2';
   mediaDiv.innerHTML = `
       <input type="url" placeholder="Image URL" value="${media?.url || ''}"
              class="flex-1 px-4 py-2 rounded-md border border-gray-200">
       <input type="text" placeholder="Alt text" value="${media?.alt || ''}"
              class="w-1/3 px-4 py-2 rounded-md border border-gray-200">
       <button type="button" class="px-2 text-red-500">&times;</button>
   `;

   mediaDiv.querySelector('button').addEventListener('click', () => mediaDiv.remove());
   mediaList.appendChild(mediaDiv);
}

async function saveListing(id) {
   const title = document.getElementById('title').value;
   const description = document.getElementById('description').value;
   const tags = document.getElementById('tags').value
       .split(',')
       .map(tag => tag.trim())
       .filter(Boolean);

   const media = Array.from(document.getElementById('mediaList').children).map(div => {
       const [urlInput, altInput] = div.querySelectorAll('input');
       return {
           url: urlInput.value,
           alt: altInput.value
       };
   }).filter(m => m.url);

   try {
       await updateListing(id, { title, description, tags, media });
       window.location.href = '/pages/profile.html';
   } catch (error) {
       console.error('Error updating listing:', error);
   }
}