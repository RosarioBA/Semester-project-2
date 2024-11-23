// src/js/handlers/toggleAuth.js
import { getUser, isLoggedIn } from '../utils/userData.js';

export function toggleAuthUI() {
    const user = getUser();
    const loggedIn = isLoggedIn();
    
    const loginButtons = document.querySelectorAll('[data-auth="login"]');
    const registerButton = document.querySelector('[data-auth="register"]');
    const userMenu = document.querySelectorAll('[data-auth="user-menu"]');
    
    if (loggedIn && user) {
        loginButtons.forEach(button => button.classList.add('hidden'));
        registerButton?.classList.add('hidden');
        userMenu.forEach(menu => {
            menu.classList.remove('hidden');
            menu.classList.add('flex');
        });
    }
}