// src/js/handlers/dropdown.js
function initializeDropdown() {
  const menuButton = document.querySelector('.relative.group');
  if (!menuButton) return;

  const dropdownMenu = menuButton.querySelector('div[class*="group-hover:block"]');
  if (!dropdownMenu) return;

  let timeoutId = null;

  menuButton.addEventListener('mouseenter', () => {
    if (timeoutId) clearTimeout(timeoutId);
    dropdownMenu.classList.remove('hidden');
    dropdownMenu.classList.add('block');
  });

  dropdownMenu.addEventListener('mouseenter', () => {
    if (timeoutId) clearTimeout(timeoutId);
  });

  menuButton.addEventListener('mouseleave', (event) => {
    if (!event.relatedTarget || !dropdownMenu.contains(event.relatedTarget)) {
      timeoutId = setTimeout(() => hideDropdown(), 300);
    }
  });

  dropdownMenu.addEventListener('mouseleave', () => {
    timeoutId = setTimeout(() => hideDropdown(), 300);
  });

  function hideDropdown() {
    dropdownMenu.classList.add('hidden');
    dropdownMenu.classList.remove('block');
  }
}

export { initializeDropdown };
