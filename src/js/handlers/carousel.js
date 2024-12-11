// src/js/handlers/carousel.js
import { getListings } from '../api/listings/index.js';

export async function initializeCarousel() {
   try {
       // Get the latest 3 listings
       const { data: listings } = await getListings({
           limit: 3,
           sort: 'created',
           sortOrder: 'desc',
       });

       if (!listings || listings.length === 0) return;

       // Find carousel container
       const carouselContainer = document.querySelector('.carousel-container');
       if (!carouselContainer) return;

       // Create and insert carousel HTML
       carouselContainer.innerHTML = `
           <div class="relative w-96 h-96 rounded-lg shadow-lg overflow-hidden" id="carousel">
               <div class="h-full">
                   ${listings.map((listing, index) => `
                       <div class="absolute w-full h-full transition-opacity duration-500 ${index === 0 ? 'opacity-100' : 'opacity-0'}"
                            style="background-image: url('${listing.media?.[0]?.url || '/api/placeholder/400/400'}'); 
                                   background-size: cover; 
                                   background-position: center;">
                           <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                               <h3 class="text-lg font-semibold">${listing.title}</h3>
                           </div>
                       </div>
                   `).join('')}
               </div>

               <!-- Navigation arrows -->
               <button onclick="carousel.prev()" 
                       class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/75 rounded-full p-2">
                   <svg class="w-6 h-6 text-[#4F6F52]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                   </svg>
               </button>
               <button onclick="carousel.next()" 
                       class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/75 rounded-full p-2">
                   <svg class="w-6 h-6 text-[#4F6F52]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                   </svg>
               </button>
           </div>
       `;

       // Initialize carousel functionality
       let currentSlide = 0;
       const slides = document.querySelectorAll('#carousel > div > div');
       const totalSlides = slides.length;

       window.carousel = {
           next: () => {
               slides[currentSlide].classList.add('opacity-0');
               currentSlide = (currentSlide + 1) % totalSlides;
               slides[currentSlide].classList.remove('opacity-0');
           },
           prev: () => {
               slides[currentSlide].classList.add('opacity-0');
               currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
               slides[currentSlide].classList.remove('opacity-0');
           }
       };

       // Auto advance slides
       setInterval(window.carousel.next, 5000);

   } catch (error) {
       console.error('Carousel error:', error);
       // Silently fail and keep the default image
   }
}