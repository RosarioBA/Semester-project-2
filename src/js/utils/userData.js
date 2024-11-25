// src/js/utils/userData.js
export function getUser() {
  return JSON.parse(localStorage.getItem('user'));
}

export function isLoggedIn() {
  return Boolean(localStorage.getItem('token'));
}
