// ~~~ ELEMENT REFERENCES ~~~
// Toggle buttons for switching between login and signup forms
const showLoginBtn = document.getElementById("showLoginBtn");
const showSignupBtn = document.getElementById("showSignupBtn");

// Form containers
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

// Login from inputs
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");

// Signup from inputs
const signupName = document.getElementById("signupName");
const signupEmail = document.getElementById("signupEmail");
const signupPhone = document.getElementById("signupPhone");
const signupStudentId = document.getElementById("signupStudentId");
const signupDepartment = document.getElementById("signupDepartment");
const signupPassword = document.getElementById("signupPassword");
const signupConfirmPassword = document.getElementById("signupConfirmPassword");
const signupBtn = document.getElementById("signupBtn");
const signUpcheckBox = document.getElementById("signUpcheckBox");
const signUpBirthDate = document.getElementById("signUpBirthDate");

// Message containers
const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");

// ~~~ UTILITY FUNCTIONS ~~~
// Display error message to the user
// @param {string} message - Error message to display
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    successMessage.style.display = "none";

    // Auto-hide error after 5 seconds
    setTimeout(() => {
        errorMessage.style.display = "none";
    }, 5000);
}

// Display success message to the user
// @param {string} message - Success message to display
function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = "block";
    errorMessage.style.display = "none";

    // Auto-hide success after 3 seconds
    setTimeout(() => {
        successMessage.style.display = "none";
    }, 3000);
}

// Clear all messages
function clearMessages() {
    errorMessage.style.display = "none";
    successMessage.style.display = "none";
}

// Validate email format
// @param {string} email - Email to validate
// @param {boolean} True if valid, false otherwise
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Valiate phone number format
// @param {string} phone - Phone number to validate
// @return {boolean} True if valid, false otherwise
function isValidPhone(phone) {

    const phoneRegex = /^0\d{2}-\d{7,8}$/;
    return phoneRegex.test(phone);
}


// ~~~ TOGGLE BETWEEN LOGIN AND SIGNUP FORMS ~~~
// Show login form and hide signup form
showLoginBtn.addEventListener("click", () => {
    loginForm.classList.add("active");
    signupForm.classList.remove("active");
    showLoginBtn.classList.add("active");
    showSignupBtn.classList.remove("active");
    clearMessages();
});

// Show signup form and hide login form
showSignupBtn.addEventListener("click", () => {
    signupForm.classList.add("active");
    loginForm.classList.remove("active");
    showSignupBtn.classList.add("active");
    showLoginBtn.classList.remove("active");
    clearMessages();
});

// ~~~ LOCAL STORAGE FUNCTIONS ~~~
// Get all users from localStorage
// @returns {Array} Array of user objects
function getUsers() {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
}

// Save users array to localStorage
// @param {Array} users - Array of user objects to save
function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

// Get currently logged in user
// @returns {Object|null} User object or null if not logged in
function getCurrentUser() {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
}

// Set current logged in user
// @param {Object} user - User object to set as current user
function setCurrentUser(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
}

// Remove current user (logout)
function removeCurrentUser() {
    localStorage.removeItem("currentUser");
}

// ~~~ SIGN UP FUNCTIONALITY ~~~
// Handle user registration
signupBtn.addEventListener("click", () => {
    // Clear previous messages
    clearMessages();

    // Get input values and trim whitespace
    const name = signupName.value.trim();
    const email = signupEmail.value.trim();
    const phone = signupPhone.value.trim();
    const studentId = signupStudentId.value.trim();
    const department = signupDepartment.value.trim();
    const password = signupPassword.value;
    const confirmPassword = signupConfirmPassword.value;

    // Validation: Check if all fields are field
    if (!name || !email || !phone || !studentId || !department || !password || !confirmPassword) {
        showError("Please fill in all fields.");
        return;
    }

    // Validation: Check email format
    if (!isValidEmail(email)) {
        showError("Please enter a valid email address.");
        return;
    }

    // Validation: Check phone format
    if (!isValidPhone(phone)) {
        showError("Please enter a valid phone number (Format: 013-12345678).");
        return;
    }

    // Validation: Check password length
    if (password.length < 6) {
        showError("Password must be at least 6 characters long.");
        return;
    }

    // Validation: Check if passwords match
    if (password !== confirmPassword) {
        showError("Passwords do not match.");
        return;
    }

    // Get existing users from localStorage
    const users = getUsers();

    // Check if email already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        showError("This email is already registered. Please login instead.");
        return;
    }

    // Create new user object
    const newUser = {
        id: Date.now(), // Use timestamp as unique ID
        name: name,
        email: email,
        phone: phone,
        studentId: studentId,
        department: department,
        password: password,
        createdAt: new Date().toLocaleString()
    };

    // Add new user to user array
    users.push(newUser);

    // Save updated users array to localStorage
    saveUsers(users);

    // Show success message
    showSuccess("Account created successfully! Redirecting to login...");

    // Clear form fields
    signupName.value = "";
    signupEmail.value = "";
    signupPhone.value = "";
    signupStudentId.value = "";
    signupDepartment.value = "";
    signupPassword.value = "";
    signupConfirmPassword.value = "";

    // Redirect to login form after 2 seconds
    setTimeout(() => {
        showLoginBtn.click();
    }, 2000);
});

// ~~~ LOGIN FUNCTIONALITY
// Handle user login
loginBtn.addEventListener("click", () => {
    // Clear previous messages
    clearMessages();

    // Get input values and trim whitespace
    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    // Validation: Check if both fields are filled
    if (!email || !password) {
        showError("Please enter both email and password.");
        return;
    }

    // Validation: Check email format
    if (!isValidEmail(email)) {
        showError("Please enter a valid email address.");
        return;
    }

    // Get users from localStorage
    const users = getUsers();

    // Find user with matching email and password
    const user = users.find(u => u.email === email && u.password === password);

    // Check if user exists and credentials are correct
    if (!user) {
        showError("Invalid email or password. Please try again.");
        return;
    }

    // Save current user to localStorage (login)
    setCurrentUser(user);

    // Show success message
    showSuccess("Login successful! Redirecting to profile...");

    // Clear form fields
    loginEmail.value = "";
    loginPassword.value = "";

    // Redirect to profile page after 1.5 seconds
    setTimeout(() => {
        window.location.href = "profile.html";
    }, 1500);
});

// ~~~ INITIALIZATION ~~~
// Check if user is already logged in when page loads
// If logged in, redirect to profile page
document.addEventListener("DOMContentLoaded", () => {
    const currentUser = getCurrentUser();

    // If user is already logged in, redirect to profile
    if (currentUser) {
        window.location.href = "profile.html";
    }

});
