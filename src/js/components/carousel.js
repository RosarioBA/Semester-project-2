// src/js/components/carousel.js

import { getListings } from '../api/listings/index.js';

/**
 * Initializes the carousel component by fetching the latest listings and setting up the carousel functionality.
 * 
 * This function performs the following steps:
 * 1. Fetches the latest 3 listings from the API.
 * 2. Finds the carousel container in the DOM.
 * 3. Creates and inserts the carousel HTML structure.
 * 4. Initializes the carousel functionality, including navigation and auto-advance.
 * 
 * @async
 * @function initializeCarousel
 * @returns {Promise<void>} A promise that resolves when the carousel is initialized.
 * @throws Will log an error to the console if the initialization fails.
 */


export async function initializeCarousel() {
  try {
    const { data: listings } = await getListings({
      limit: 3,
      sort: 'created',
      sortOrder: 'desc',
      _active: true
    });
    if (!listings || listings.length === 0) return;

    const carouselContainer = document.querySelector('.carousel-container');
    if (!carouselContainer) return;

    let currentSlide = 0;

    // Simplified carousel HTML
    carouselContainer.innerHTML = `
      <div class="relative w-96 h-96 rounded-lg shadow-lg overflow-hidden" id="carousel">
        <div class="h-full" id="slides">
          ${listings.map((listing, index) => `
            <div class="absolute w-full h-full transition-opacity duration-500 cursor-pointer" 
                 style="background-image: url('${listing.media?.[0]?.url || '/api/placeholder/400/400'}'); 
                        background-size: cover; 
                        background-position: center;
                        opacity: ${index === 0 ? '1' : '0'}"
                 onclick="window.location.href='/pages/single-listing.html?id=${listing.id}'">
              <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                <h3 class="text-lg font-semibold">${listing.title}</h3>
              </div>
            </div>
          `).join('')}
        </div>
        <button onclick="carousel.prev()" class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/75 rounded-full p-2 z-10">
          <svg class="w-6 h-6 text-[#4F6F52]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button onclick="carousel.next()" class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/75 rounded-full p-2 z-10">
          <svg class="w-6 h-6 text-[#4F6F52]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    `;

    const slides = document.querySelectorAll('#slides > div');

    window.carousel = {
      next: () => {
        slides[currentSlide].style.opacity = '0';
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].style.opacity = '1';
      },
      prev: () => {
        slides[currentSlide].style.opacity = '0';
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        slides[currentSlide].style.opacity = '1';
      }
    };

    setInterval(window.carousel.next, 5000);
  } catch (error) {
    console.error('Carousel error:', error);
  }
}