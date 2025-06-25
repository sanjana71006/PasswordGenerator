// DOM Elements
const loginCard = document.querySelector('.login-card');
const registerCard = document.querySelector('.register-card');
const registerLink = document.getElementById('register-link');
const loginLink = document.getElementById('login-link');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const regEmailInput = document.getElementById('reg-email');
const regPasswordInput = document.getElementById('reg-password');
const confirmPasswordInput = document.getElementById('confirm-password');

// Switch between login and register cards
registerLink.addEventListener('click', () => {
    loginCard.classList.add('hidden');
    registerCard.classList.remove('hidden');
});

loginLink.addEventListener('click', () => {
    registerCard.classList.add('hidden');
    loginCard.classList.remove('hidden');
});

// Show toast notification with improved animation
function showToast(message, type = 'success') {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type} animate-slide-in`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Add slide-out animation before removing
    setTimeout(() => {
        toast.classList.add('animate-slide-out');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3200);
}

// Register function
registerBtn.addEventListener('click', () => {
    const email = regEmailInput.value.trim();
    const password = regPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    // Simple validation
    if (!email || !password || !confirmPassword) {
        showToast('Please fill all fields', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Please enter a valid email', 'error');
        return;
    }
    
    // Password validation
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Password match validation
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    // Store user data in localStorage
    const users = JSON.parse(localStorage.getItem('securePassUsers') || '[]');
    
    // Check if user already exists
    if (users.some(user => user.email === email)) {
        showToast('User already exists', 'error');
        return;
    }
    
    // Add new user
    users.push({
        email,
        password,
        timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('securePassUsers', JSON.stringify(users));
    showToast('Registration successful! Please log in.');
    
    // Clear fields and switch to login
    regEmailInput.value = '';
    regPasswordInput.value = '';
    confirmPasswordInput.value = '';
    registerCard.classList.add('hidden');
    loginCard.classList.remove('hidden');
});

// Login function
loginBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Simple validation
    if (!email || !password) {
        showToast('Please fill all fields', 'error');
        return;
    }
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('securePassUsers') || '[]');
    
    // Check credentials
    const user = users.find(user => user.email === email && user.password === password);
    
    if (user) {
        // Store authenticated user in session
        sessionStorage.setItem('currentUser', email);
        showToast('Login successful! Redirecting...');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        showToast('Invalid email or password', 'error');
    }
});

// Check if user is already logged in
window.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('currentUser')) {
        window.location.href = 'dashboard.html';
    }
});
