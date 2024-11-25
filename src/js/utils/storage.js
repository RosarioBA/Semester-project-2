// src/js/utils/storage.js
export function saveToken(token) {
    localStorage.setItem('token', token);
}

export function getToken() {
    return localStorage.getItem('token');
}

export function saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

export function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

export function clearStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}