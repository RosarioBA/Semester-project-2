// src/js/main.js
import { initializeCore } from './core/init.js';
import { routes } from './routes.js';

async function initializeApp() {
  await initializeCore();
  const path = window.location.pathname;
  const handler = routes[path];
  if (handler) handler();
}

document.addEventListener('DOMContentLoaded', initializeApp);