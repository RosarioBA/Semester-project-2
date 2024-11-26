// src/js/handlers/dropdown.js

function initializeDropdown() {
    const menuButton = document.querySelector('.group');
    const dropdownMenu = menuButton.querySelector('.group-hover\\:block');
    let timeoutId = null;
  
    // Show menu
    menuButton.addEventListener('mouseenter', () => {
      if (timeoutId) clearTimeout(timeoutId);
      dropdownMenu.classList.remove('hidden');
      dropdownMenu.classList.add('block');
    });
  
    // Add listener to the dropdown menu itself
    dropdownMenu.addEventListener('mouseenter', () => {
      if (timeoutId) clearTimeout(timeoutId);
    });
  
    // Handle mouse leave with delay
    menuButton.addEventListener('mouseleave', (event) => {
      // Check if we're moving to the dropdown
      if (!event.relatedTarget || !dropdownMenu.contains(event.relatedTarget)) {
        timeoutId = setTimeout(() => {
          dropdownMenu.classList.add('hidden');
          dropdownMenu.classList.remove('block');
        }, 300); // 300ms delay
      }
    });
  
    dropdownMenu.addEventListener('mouseleave', () => {
      timeoutId = setTimeout(() => {
        dropdownMenu.classList.add('hidden');
        dropdownMenu.classList.remove('block');
      }, 300); // 300ms delay
    });
  }
  
  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', initializeDropdown);
  
  export { initializeDropdown };