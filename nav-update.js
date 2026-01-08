// ~~~ NAVIGATION UPDATE SCRIPT ~~~
// This script updates the navigation bar based on user authentication status.

// ~~~ UTILITY FUNCTIONS ~~~
// Get currently logged in user from localStorage
// @param {Object|null} User object or null if not logged in
function getCurrentUser() {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
}

// ~~~ UPDATE NAVIGATION BASED ON AUTHENTICATION STATUS ~~~
// Update navigation to show user's login status
// This function changes the Login link to show user's name when logged in
function updateNavigation() {
    // Get the navigation element
    const nav = document.querySelector("nav");
    if(!nav) return;

    // Get current user
    const currentUser = getCurrentUser();

    // Find the Login/ Auth link
    const authLink = nav.querySelector('a[href="auth.html"]');

    if (currentUser && authLink) {
        
        // User is logged in - Change "Login" to show user's name
        authLink.innerHTML = `<i class="fa-solid fa-user-check"></i> ${currentUser.name}`;
        authLink.title = "Logged in as " + currentUser.name;
        // Make it non-clickable or change it style
        authLink.style.cursor = "default";
        authLink.style.opacity = "0.8";
        // Prevent navigation when clicking on user name
        authLink.addEventListener("click", (e) => {
            e.preventDefault();
        });
    }

    else if (!currentUser && authLink) {
        // User is not logged in - Show "Login" link normally
        authLink.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Login';
        authLink.title = "Login to your account";
        authLink.style.cursor = "pointer";
        authLink.style.opacity = "1";
    }
}

// ~~~ INITIALIZATION ~~~
// Run navigation update when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    updateNavigation();
});

// Listen for storage changes to update navigation in real-time
// This allows navigation to update if user logs in/ out in another tab
window.addEventListener("storage", (e) => {
    if (e.key === "currentUser") {
        updateNavigation();
    }
});