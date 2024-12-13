// src/js/features/listings/editListing.js
import { getSingleListing, updateListing } from '../../api/listings/index.js';

/**
 * Initializes the edit listing form by loading the listing data and setting up event listeners.
 */

export function initializeEditListing() {
  const form = document.getElementById('editListingForm');
  const addMediaBtn = document.getElementById('addMediaBtn');

  const urlParams = new URLSearchParams(window.location.search);
  const listingId = urlParams.get('id');

  if (!listingId) {
    window.location.href = '/pages/profile.html';
    return;
  }

  loadListing(listingId);

  addMediaBtn?.addEventListener('click', addMediaInput);
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    saveListing(listingId);
  });
}

/**
 * Loads the listing data and populates the form fields with the retrieved data.
 * 
 * @param {string} id - The ID of the listing to load.
 */

async function loadListing(id) {
  try {
    const response = await getSingleListing(id);
    console.log('Listing data:', response); // Debug log

    // Access the listing data correctly
    const listing = response.data;

    if (!listing) {
      throw new Error('No listing data received');
    }

    document.getElementById('title').value = listing.title;
    document.getElementById('description').value = listing.description;
    document.getElementById('tags').value = listing.tags?.join(', ') || '';

    const deadline = new Date(listing.endsAt);
    const formattedDate = deadline.toISOString().slice(0, 16);
    document.getElementById('deadline').value = formattedDate;

    if (listing.media?.length) {
      listing.media.forEach((media) => addMediaInput(media));
    }
  } catch (error) {
    console.error('Error loading listing:', error);
  }
}

/**
 * Adds a new media input field to the media list.
 * 
 * @param {Object|null} media - The media object containing URL and alt text. If null, empty inputs are added.
 * @param {string} [media.url] - The URL of the media.
 * @param {string} [media.alt] - The alt text of the media.
 */

function addMediaInput(media = null) {
  const mediaList = document.getElementById('mediaList');
  const mediaDiv = document.createElement('div');
  mediaDiv.className = 'flex gap-3';
  mediaDiv.innerHTML = `
        <input type="url" placeholder="Image URL" value="${media?.url || ''}"
               class="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f6f52]">
        <input type="text" placeholder="Alt text" value="${media?.alt || ''}"
               class="w-1/3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f6f52]">
        <button type="button" class="px-3 text-red-500 hover:text-red-700">&times;</button>
    `;

  mediaDiv.querySelector('button').addEventListener('click', () => mediaDiv.remove());
  mediaList.appendChild(mediaDiv);
}

/**
 * Saves the updated listing data by sending it to the server.
 * 
 * @param {string} id - The ID of the listing to update.
 */

async function saveListing(id) {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const deadline = document.getElementById('deadline').value;
  const tags = document
    .getElementById('tags')
    .value.split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  const media = Array.from(document.getElementById('mediaList').children)
    .map((div) => {
      const [urlInput, altInput] = div.querySelectorAll('input');
      return {
        url: urlInput.value,
        alt: altInput.value,
      };
    })
    .filter((m) => m.url);

  try {
    await updateListing(id, {
      title,
      description,
      tags,
      media,
      endsAt: deadline,
    });
    window.location.href = '/pages/profile.html';
  } catch (error) {
    console.error('Error updating listing:', error);
  }
}