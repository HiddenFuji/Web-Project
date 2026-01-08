document.addEventListener("DOMContentLoaded", () => {
    loadActivityStats();
    setupEditProfile();
});

function setupEditProfile() {
    const editBtn = document.getElementById("editProfileBtn");

    if (!editBtn) return;

    editBtn.addEventListener("click", () => {
        enableProfileEditing();
    });
}

function enableProfileEditing() {
    const infoRows = document.querySelectorAll(".info-row");

    infoRows.forEach(row => {
        const value = row.querySelector("p");

        if (value) {
            const input = document.createElement("input");
            input.type = "text";
            input.value = value.textContent;
            input.className = "edit-input";

            value.replaceWith(input);
        }
    });

    transformEditButtonToSave();
}

function transformEditButtonToSave() {
    const editBtn = document.getElementById("editProfileBtn");

    editBtn.innerHTML = `<i class="fa-solid fa-save"></i> Save Profile`;

    editBtn.onclick = saveProfileChanges;
}

function saveProfileChanges() {
    const inputs = document.querySelectorAll(".info-row input");
    const currentUser = getCurrentUser();

    const fields = ["name", "email", "phone", "studentId", "department"];

    inputs.forEach((input, index) => {
        currentUser[fields[index]] = input.value;
    });

    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    alert("Profile updated successfully!");
    location.reload();
}

/* Existing function */
function loadActivityStats() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const activities = JSON.parse(localStorage.getItem("activities")) || [];

    const userActivities = activities.filter(
        a => a.userId === currentUser.id
    );

    document.getElementById("postCount").textContent =
        userActivities.filter(a => a.type === "forum_post").length;

    document.getElementById("questionCount").textContent =
        userActivities.filter(a => a.type === "question").length;

    document.getElementById("uploadCount").textContent =
        userActivities.filter(a => a.type === "note_upload").length;

    document.getElementById("tutorialCount").textContent =
        userActivities.filter(a => a.type === "tutorial_upload").length;
}