import { register } from '../api/auth/register.js';
import { validateRegistration } from '../utils/validation.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#registerForm');
    const errorMessage = document.querySelector('#errorMessage');
    const loadingSpinner = document.querySelector('#loadingSpinner');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        // Hide any previous error messages
        errorMessage.classList.add('hidden');
        
        // Show loading state
        loadingSpinner.classList.remove('hidden');
        
        const formData = {
            name: form.name.value,
            email: form.email.value,
            password: form.password.value,
            avatar: form.avatar.value ? {
                url: form.avatar.value,
                alt: form.avatarAlt.value || ''
            } : undefined
        };

        try {
            // Validate form data
            const { isValid, errors } = validateRegistration(formData);
            
            if (!isValid) {
                throw new Error(Object.values(errors)[0]); // Show first error
            }

            // Register user
            const response = await register(formData);
            
            // Redirect to login page on success
            window.location.href = '/pages/login.html';
            
        } catch (error) {
            // Show error message
            errorMessage.textContent = error.message;
            errorMessage.classList.remove('hidden');
        } finally {
            // Hide loading state
            loadingSpinner.classList.add('hidden');
        }
    });
});