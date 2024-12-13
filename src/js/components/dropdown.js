// src/js/components/dropdown.js
export function initializeDropdown() {
  const menuButton = document.getElementById('menuButton');
  const dropdownContainer = menuButton?.closest('.dropdown-container');
  const dropdownMenu = dropdownContainer?.querySelector('div[class*="hidden"]');

  if (!menuButton || !dropdownMenu) return;

  let isOpen = false;
  let timeoutId = null;

  menuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    isOpen = !isOpen;
    dropdownMenu.classList.toggle('hidden', !isOpen);
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdownContainer.contains(e.target)) {
      isOpen = false;
      dropdownMenu.classList.add('hidden');
    }
  });

  // Optional: Handle hover on desktop
  if (window.innerWidth >= 768) {
    dropdownContainer.addEventListener('mouseenter', () => {
      if (timeoutId) clearTimeout(timeoutId);
      dropdownMenu.classList.remove('hidden');
    });

    dropdownContainer.addEventListener('mouseleave', () => {
      timeoutId = setTimeout(() => {
        dropdownMenu.classList.add('hidden');
      }, 300);
    });
  }
}