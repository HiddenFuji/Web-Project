// ~~~ AUTHENTICATION CHECK FOR PROFILE PAGE ~~~

// ~~~ UTILITY FUNCTIONS ~~~
// Get currently logged in user from localStorage
// User object or null if not logged in
function getCurrentUser() {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
}

// Remove current user from localStorage (logout)
function logout() {
    localStorage.removeItem("currentUser");
}

// ~~~ PAGE INITIALIZATION ~~~
// Check authentication status when page loads
// Redirect to auth page if not logged in
// Display user information if logged in
document.addEventListener("DOMContentLoaded", ()=> {
    // Get current logged in user
    const currentUser = getCurrentUser();

    // If no user is logged in, redirect to authentication page
    if (!currentUser) {
        alert("Please login to access your profile.");
        window.location.href = "auth.html";
        return;
    }

    // If user is logged in, display their information
    displayUserProfile(currentUser);

    // Setup logout button
    setupLogoutButton();
});

// ~~~ DISPLAY USER PROFILE ~~~
// Display logged in user's information on the profile page
// User object containing profile information
function displayUserProfile(user) {
    // Update welcome message with user's name
    const welcomeHeader = document.querySelector("section .section-header h2");
    
    if (welcomeHeader) {
        welcomeHeader.innerHTML = `Welcome, ${user.name}!`;
    }
    else {
        // Fallback if section-header doesn't exist
        const firstH2 = document.querySelector("section h2");
        if (firstH2) {
            firstH2.innerHTML = `Welcome, ${user.name}!`;
        }
    }

    // Update all profile information fields
    updateProfileField("Name:", user.name);
    updateProfileField("Email:", user.email);
    updateProfileField("Phone:", user.phone);
    updateProfileField("Student ID:", user.studentId);
    updateProfileField("Department:", user.department);

    // Update profile description if it exists
    const profileDesc = document.querySelector("section p");
    if (profileDesc && profileDesc.textContent.includes("Manage your profile")) {
        profileDesc.textContent = `Welcome back, ${user.name}! Here you can view your profile information and track your contributions to the Student Resources Hub.`;
    }
}

// Update a specific profile information field
// {string} labelText - The label text to search for (e.g. "Name:")
// {string} value - The value to display
function updateProfileField (labelText, value) {
    // Find all info-row elements
    const infoRows = document.querySelectorAll(".info-row");

    // Loop through each row to find the matching label
    infoRows.forEach(row => {
        const label = row.querySelector("label");
        if (label && label.textContent.includes(labelText)) {
            const valueElement = row.querySelector("p");
            if (valueElement) {
                valueElement.textContent = value;
            }
        }
    });
}

// ~~~ LOGOUT FUNCTIONALITY ~~~
// Setup logout button functionality
// Creates a new logout button if it doesn't exist
function setupLogoutButton() {
    // Check if logout button already exists
    let logoutBtn = document.getElementById("logoutBtn");

    // If logout button doesn't exist, create it
    if (!logoutBtn) {
        // Find the Edit Profile button
        const editBtn = document.querySelector(".btn");

        if (editBtn && editBtn.parentElement) {
            // Create new logout button
            logoutBtn = document.createElement("button");
            logoutBtn.id = "logoutBtn";
            logoutBtn.className = "btn";
            logoutBtn.style.marginLeft = "10px";
            logoutBtn.style.backgroundColor = "#e74c3c";
            logoutBtn.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Logout';

            // Add logout button after edit button
            editBtn.parentElement.insertBefore(logoutBtn, editBtn.nextSibling);
        }
    }

    // Add click event listener to logout button
    if (logoutBtn) {
        logoutBtn.addEventListener("click", handleLogout);
    }
}

// Handle logout process
// Confirm user wants to logout, then logs them out and redirects
function handleLogout() {
    // Confirm logout action
    const confirmLogout = confirm("Are you sure you want to logout?");

    if (confirmLogout) {
        // Remove current user from localStorage
        logout();

        // Show logout message
        alert("You have been logged out successfully.");

        // Redirect to authentication page
        window.location.href = "auth.html";
    }
}

// ~~~ EXPORT FUNCTIONS FOR TESTING (Optional) ~~~
// Make functions available globally if needed
window.getCurrentUser = getCurrentUser;
window.logout = logout;