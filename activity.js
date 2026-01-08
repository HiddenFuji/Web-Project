// Get all activities from localStorage
function getActivities() {
    const activities = localStorage.getItem("activities");
    return activities ? JSON.parse(activities) : [];
}

// Save a new activity for the logged-in user
function logActivity(type) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const activities = JSON.parse(localStorage.getItem("activities")) || [];

    activities.push({
        userId: currentUser.id,
        type: type,
        timestamp: Date.now()
    });

    localStorage.setItem("activities", JSON.stringify(activities));
}