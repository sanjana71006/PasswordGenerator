// Check if user is logged in, redirect to login if not
window.addEventListener('DOMContentLoaded', () => {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // Display user email in the header
    document.getElementById('user-email').textContent = currentUser;
    
    // Initialize the app
    initializeApp();
});

// DOM Elements
const logoutBtn = document.getElementById('logout-btn');
const tabLinks = document.querySelectorAll('.nav-menu li');
const tabContents = document.querySelectorAll('.tab-content');
const lengthSlider = document.getElementById('length-slider');
const lengthValue = document.getElementById('length-value');
const personalLengthSlider = document.getElementById('personal-length-slider');
const personalLengthValue = document.getElementById('personal-length-value');
const passwordDisplay = document.getElementById('generated-password');
const copyBtn = document.getElementById('copy-btn');
const refreshBtn = document.getElementById('refresh-btn');
const savePasswordBtn = document.getElementById('save-password-btn');
const savePersonalPasswordBtn = document.getElementById('save-personal-password-btn');
const personalizedPasswordDisplay = document.getElementById('personalized-password');
const copyPersonalBtn = document.getElementById('copy-personal-btn');
const generatePersonalBtn = document.getElementById('generate-personal-btn');
const saveModal = document.getElementById('save-modal');
const closeModalBtn = document.querySelector('.close-btn');
const modalPassword = document.getElementById('modal-password');
const confirmSaveBtn = document.getElementById('confirm-save');
const cancelSaveBtn = document.getElementById('cancel-save');
const passwordsContainer = document.getElementById('passwords-container');
const searchInput = document.getElementById('search-passwords');
const categoryFilter = document.getElementById('category-filter');

// Form Elements
const includeUppercase = document.getElementById('include-uppercase');
const includeLowercase = document.getElementById('include-lowercase');
const includeNumbers = document.getElementById('include-numbers');
const includeSymbols = document.getElementById('include-symbols');
const personalNameInput = document.getElementById('personal-name');
const dateOfBirthInput = document.getElementById('date-of-birth');
const specialCharInput = document.getElementById('special-char');
const favoriteNumberInput = document.getElementById('favorite-number');
const petNameInput = document.getElementById('pet-name');
const favoriteColorInput = document.getElementById('favorite-color');
const appNameInput = document.getElementById('app-name');
const usernameInput = document.getElementById('username');
const categorySelect = document.getElementById('category-select');

// Logout user
logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
});

// Show toast notification
function showToast(message, type = 'success') {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Remove toast after 3.5 seconds
    setTimeout(() => {
        toast.remove();
    }, 3500);
}

// Tab switching functionality
function initializeApp() {
    // Set up tabs
    tabLinks.forEach(tab => {
        tab.addEventListener('click', () => {
            tabLinks.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const tabId = tab.getAttribute('data-tab');
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Initialize random password generator
    lengthSlider.addEventListener('input', () => {
        lengthValue.textContent = lengthSlider.value;
        generateRandomPassword();
    });
    
    // Update checkboxes
    [includeUppercase, includeLowercase, includeNumbers, includeSymbols].forEach(checkbox => {
        checkbox.addEventListener('change', generateRandomPassword);
    });
    
    // Copy random password
    copyBtn.addEventListener('click', () => {
        copyToClipboard(passwordDisplay.value, 'Random password copied!');
    });
    
    // Refresh random password
    refreshBtn.addEventListener('click', generateRandomPassword);
    
    // Save random password
    savePasswordBtn.addEventListener('click', () => {
        if (passwordDisplay.value) {
            openSaveModal(passwordDisplay.value);
        } else {
            showToast('Please generate a password first', 'error');
        }
    });
    
    // Initialize personalized password generator
    personalLengthSlider.addEventListener('input', () => {
        personalLengthValue.textContent = personalLengthSlider.value;
        if (checkPersonalInputs()) {
            generatePersonalizedPassword();
        }
    });
    
    // Generate personalized password
    generatePersonalBtn.addEventListener('click', () => {
        if (checkPersonalInputs()) {
            generatePersonalizedPassword();
        } else {
            showToast('Please fill at least 3 personal details', 'error');
        }
    });
    
    // Copy personalized password
    copyPersonalBtn.addEventListener('click', () => {
        copyToClipboard(personalizedPasswordDisplay.value, 'Personalized password copied!');
    });
    
    // Save personalized password
    savePersonalPasswordBtn.addEventListener('click', () => {
        if (personalizedPasswordDisplay.value) {
            openSaveModal(personalizedPasswordDisplay.value);
        } else {
            showToast('Please generate a password first', 'error');
        }
    });
    
    // Modal functionality
    closeModalBtn.addEventListener('click', closeModal);
    cancelSaveBtn.addEventListener('click', closeModal);
    
    confirmSaveBtn.addEventListener('click', savePassword);
    
    // Search and filter saved passwords
    searchInput.addEventListener('input', filterPasswords);
    categoryFilter.addEventListener('change', filterPasswords);
    
    // Generate initial password
    generateRandomPassword();
    
    // Load saved passwords
    loadSavedPasswords();
}

// Check if enough personal inputs are filled
function checkPersonalInputs() {
    const inputs = [
        personalNameInput, 
        dateOfBirthInput, 
        specialCharInput, 
        favoriteNumberInput, 
        petNameInput, 
        favoriteColorInput
    ];
    
    const filledInputs = inputs.filter(input => input.value.trim() !== '');
    return filledInputs.length >= 3;
}

// Generate personalized password
function generatePersonalizedPassword() {
    const name = personalNameInput.value.trim();
    const dob = dateOfBirthInput.value;
    const specialChar = specialCharInput.value.trim();
    const favNumber = favoriteNumberInput.value.trim();
    const petName = petNameInput.value.trim();
    const favColor = favoriteColorInput.value.trim();
    
    let components = [];
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?`~';
    
    // Add components with transformations for increased complexity
    if (name) {
        components.push(name.split('').map(c => 
            Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()
        ).join(''));
    }
    
    if (dob) {
        const dateParts = dob.split('-');
        if (dateParts.length === 3) {
            components.push(dateParts[2]); // day
            components.push(dateParts[1]); // month
            // Add a random symbol between date parts
            components.push(symbols[Math.floor(Math.random() * symbols.length)]);
        }
    }
    
    if (specialChar) components.push(specialChar);
    if (favNumber) components.push(favNumber);
    if (petName) {
        // Transform pet name for added complexity
        components.push(petName.split('').reverse().join(''));
    }
    if (favColor) {
        // Add complexity to favorite color
        components.push(favColor.replace(/[aeiou]/g, num => 
            Math.floor(Math.random() * 10).toString()
        ));
    }
    
    // Add random special characters and numbers for strength
    for (let i = 0; i < 3; i++) {
        components.push(symbols[Math.floor(Math.random() * symbols.length)]);
        components.push(Math.floor(Math.random() * 100).toString());
    }
    
    // Shuffle components
    components = shuffleArray(components);
    
    // Join and ensure desired length
    let password = components.join('');
    const desiredLength = parseInt(personalLengthSlider.value);
    
    if (password.length > desiredLength) {
        password = password.substring(0, desiredLength);
        // Ensure we still have at least one special character
        if (!password.match(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?`~]/)) {
            password = password.slice(0, -1) + symbols[Math.floor(Math.random() * symbols.length)];
        }
    } else {
        // Pad with complex characters if needed
        while (password.length < desiredLength) {
            const charType = Math.random();
            if (charType < 0.3) {
                password += String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Uppercase
            } else if (charType < 0.6) {
                password += String.fromCharCode(97 + Math.floor(Math.random() * 26)); // Lowercase
            } else if (charType < 0.8) {
                password += Math.floor(Math.random() * 10); // Number
            } else {
                password += symbols[Math.floor(Math.random() * symbols.length)]; // Symbol
            }
        }
    }
    
    personalizedPasswordDisplay.value = password;
    updateStrengthMeter(password, 'personal-strength-bar', 'personal-strength-value');
}

// Generate random password
function generateRandomPassword() {
    const length = parseInt(lengthSlider.value);
    const hasUpper = includeUppercase.checked;
    const hasLower = includeLowercase.checked;
    const hasNumbers = includeNumbers.checked;
    const hasSymbols = includeSymbols.checked;
    
    // Ensure at least one type is selected
    if (!hasUpper && !hasLower && !hasNumbers && !hasSymbols) {
        hasUpper = hasLower = true;
    }
    
    const password = createRandomPassword(length, hasUpper, hasLower, hasNumbers, hasSymbols);
    passwordDisplay.value = password;
    updateStrengthMeter(password, 'strength-bar', 'strength-value');
}

// Create random password based on criteria with improved strength
function createRandomPassword(length, hasUpper, hasLower, hasNumbers, hasSymbols) {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?`~';
    
    // Ensure at least one type is selected
    if (!hasUpper && !hasLower && !hasNumbers && !hasSymbols) {
        hasUpper = hasLower = true;
    }
    
    let availableChars = '';
    let password = '';
    
    // Build character set and ensure at least one of each selected type
    if (hasUpper) {
        availableChars += uppercaseChars;
        password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
    }
    if (hasLower) {
        availableChars += lowercaseChars;
        password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
    }
    if (hasNumbers) {
        availableChars += numberChars;
        password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
    }
    if (hasSymbols) {
        availableChars += symbolChars;
        password += symbolChars.charAt(Math.floor(Math.random() * symbolChars.length));
    }
    
    // Fill remaining length with random characters from all selected types
    for (let i = password.length; i < length; i++) {
        password += availableChars.charAt(Math.floor(Math.random() * availableChars.length));
    }
    
    // Advanced shuffling using Fisher-Yates algorithm
    return shuffleString(password);
}

// Shuffle string characters
function shuffleString(str) {
    const array = str.split('');
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
}

// Shuffle array
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Update strength meter
function updateStrengthMeter(password, barId, valueId) {
    const strengthBar = document.getElementById(barId);
    const strengthValue = document.getElementById(valueId);
    
    // Calculate password strength (0-10)
    let strength = 0;
    
    // Length
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (password.length >= 16) strength += 1;
    
    // Character variety
    if (/[A-Z]/.test(password)) strength += 1; // Uppercase
    if (/[a-z]/.test(password)) strength += 1; // Lowercase
    if (/[0-9]/.test(password)) strength += 1; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 1; // Symbols
    
    // Patterns
    if (/[A-Z].*[A-Z]/.test(password)) strength += 1; // Multiple uppercase
    if (/[a-z].*[a-z]/.test(password)) strength += 1; // Multiple lowercase
    if (/[0-9].*[0-9]/.test(password)) strength += 1; // Multiple numbers
    if (/[^A-Za-z0-9].*[^A-Za-z0-9]/.test(password)) strength += 1; // Multiple symbols
    
    // Cap at 10
    strength = Math.min(10, strength);
    
    // Update visual elements
    strengthBar.style.width = `${strength * 10}%`;
    strengthValue.textContent = `${strength}/10`;
    
    // Color the bar based on strength
    if (strength < 4) {
        strengthBar.style.background = 'linear-gradient(to right, #FF5F6D, #FF5F6D)';
    } else if (strength < 7) {
        strengthBar.style.background = 'linear-gradient(to right, #FFC371, #FFC371)';
    } else {
        strengthBar.style.background = 'linear-gradient(to right, #44bd32, #44bd32)';
    }
}

// Copy to clipboard
function copyToClipboard(text, message) {
    navigator.clipboard.writeText(text)
        .then(() => {
            showToast(message);
        })
        .catch(() => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            
            try {
                document.execCommand('copy');
                showToast(message);
            } catch (err) {
                showToast('Failed to copy password', 'error');
            }
            
            document.body.removeChild(textarea);
        });
}

// Open save modal
function openSaveModal(password) {
    modalPassword.value = password;
    saveModal.style.display = 'block';
    appNameInput.focus();
}

// Close modal
function closeModal() {
    saveModal.style.display = 'none';
    appNameInput.value = '';
    usernameInput.value = '';
    categorySelect.value = '';
}

// Save password
function savePassword() {
    const appName = appNameInput.value.trim();
    const username = usernameInput.value.trim();
    const category = categorySelect.value;
    const password = modalPassword.value;
    
    if (!appName || !category) {
        showToast('Please fill all required fields', 'error');
        return;
    }
    
    const currentUser = sessionStorage.getItem('currentUser');
    
    // Get existing passwords
    let savedPasswords = JSON.parse(localStorage.getItem(`${currentUser}_passwords`) || '[]');
    
    // Add new password
    savedPasswords.push({
        id: Date.now().toString(),
        appName,
        username,
        category,
        password,
        timestamp: new Date().toISOString()
    });
    
    // Save to localStorage
    localStorage.setItem(`${currentUser}_passwords`, JSON.stringify(savedPasswords));
    
    closeModal();
    showToast('Password saved successfully');
    
    // Reload saved passwords
    loadSavedPasswords();
}

// Load saved passwords
function loadSavedPasswords() {
    const currentUser = sessionStorage.getItem('currentUser');
    const savedPasswords = JSON.parse(localStorage.getItem(`${currentUser}_passwords`) || '[]');
    
    displayPasswords(savedPasswords);
}

// Filter passwords based on search and category
function filterPasswords() {
    const searchTerm = searchInput.value.toLowerCase();
    const categoryValue = categoryFilter.value;
    
    const currentUser = sessionStorage.getItem('currentUser');
    let savedPasswords = JSON.parse(localStorage.getItem(`${currentUser}_passwords`) || '[]');
    
    const filteredPasswords = savedPasswords.filter(password => {
        const matchesSearch = 
            password.appName.toLowerCase().includes(searchTerm) ||
            password.username.toLowerCase().includes(searchTerm) ||
            password.category.toLowerCase().includes(searchTerm);
        
        const matchesCategory = categoryValue === 'all' || password.category === categoryValue;
        
        return matchesSearch && matchesCategory;
    });
    
    displayPasswords(filteredPasswords);
}

// Display passwords
function displayPasswords(passwords) {
    passwordsContainer.innerHTML = '';
    
    if (passwords.length === 0) {
        passwordsContainer.innerHTML = '<p class="no-passwords">No saved passwords yet.</p>';
        return;
    }
    
    // Sort by newest first
    passwords.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    passwords.forEach(password => {
        const passwordItem = document.createElement('div');
        passwordItem.className = 'password-item';
        passwordItem.id = `password-${password.id}`;
        
        const passwordInfo = document.createElement('div');
        passwordInfo.className = 'password-info';
        
        const title = document.createElement('h3');
        title.textContent = password.appName;
        
        const categoryTag = document.createElement('span');
        categoryTag.className = 'category-tag';
        categoryTag.textContent = password.category;
        title.appendChild(categoryTag);
        
        const username = document.createElement('p');
        username.textContent = password.username || 'No username';
        
        const passwordField = document.createElement('div');
        passwordField.className = 'password-field';
        
        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.value = password.password;
        passwordInput.readOnly = true;
        
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'icon-btn';
        toggleBtn.innerHTML = '👁️';
        toggleBtn.title = 'Show/Hide Password';
        toggleBtn.addEventListener('click', () => {
            passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
        });
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'icon-btn';
        copyBtn.innerHTML = '📋';
        copyBtn.title = 'Copy Password';
        copyBtn.addEventListener('click', () => {
            copyToClipboard(password.password, 'Password copied!');
        });
        
        passwordField.appendChild(passwordInput);
        passwordField.appendChild(toggleBtn);
        passwordField.appendChild(copyBtn);
        
        passwordInfo.appendChild(title);
        passwordInfo.appendChild(username);
        passwordInfo.appendChild(passwordField);
        
        const passwordActions = document.createElement('div');
        passwordActions.className = 'password-actions';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'icon-btn';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = 'Delete Password';
        deleteBtn.addEventListener('click', () => {
            deletePassword(password.id);
        });
        
        passwordActions.appendChild(deleteBtn);
        
        passwordItem.appendChild(passwordInfo);
        passwordItem.appendChild(passwordActions);
        
        passwordsContainer.appendChild(passwordItem);
    });
}

// Delete password
function deletePassword(id) {
    if (confirm('Are you sure you want to delete this password?')) {
        const currentUser = sessionStorage.getItem('currentUser');
        let savedPasswords = JSON.parse(localStorage.getItem(`${currentUser}_passwords`) || '[]');
        
        savedPasswords = savedPasswords.filter(password => password.id !== id);
        
        localStorage.setItem(`${currentUser}_passwords`, JSON.stringify(savedPasswords));
        
        showToast('Password deleted successfully');
        
        // Remove the element from the DOM
        document.getElementById(`password-${id}`).remove();
        
        // Check if there are no more passwords
        if (savedPasswords.length === 0) {
            passwordsContainer.innerHTML = '<p class="no-passwords">No saved passwords yet.</p>';
        }
    }
}
