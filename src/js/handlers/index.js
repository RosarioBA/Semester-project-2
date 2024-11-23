// src/js/handlers/index.js

// Remove all exports and just have the functions
function updateUserInfo() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userNameDesktop').textContent = user.name;
        document.getElementById('userCredits').textContent = `${user.credits || 1000} Credits`;
        document.getElementById('userCreditsDesktop').textContent = `${user.credits || 1000} Credits`;
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/pages/login.html';
}

function toggleAuthUI() {
    const user = JSON.parse(localStorage.getItem('user'));
    const isLoggedIn = Boolean(localStorage.getItem('token'));
    const loginButtons = document.querySelectorAll('[data-auth="login"]');
    const registerButton = document.querySelector('[data-auth="register"]');
    const userMenu = document.querySelector('[data-auth="user-menu"]');
    
    console.log('isLoggedIn:', isLoggedIn); // Add this debug log
    console.log('user:', user); // Add this debug log
    
    if (isLoggedIn && user) {
        loginButtons.forEach(button => button.classList.add('hidden'));
        registerButton?.classList.add('hidden');
        userMenu?.classList.remove('hidden');
    }
}

// When the document loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded'); // Add this debug log
    updateUserInfo();
    toggleAuthUI();
    
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
});