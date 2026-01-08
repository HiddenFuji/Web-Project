document.addEventListener("DOMContentLoaded", () => {

    // ===== ELEMENTS =====
    const titleInput = document.getElementById("tutorial-title");
    const contentInput = document.getElementById("tutorial-content");
    const postBtn = document.getElementById("postTutorialBtn");

    const tutorialList = document.getElementById("tutorialList");
    const completedList = document.getElementById("completedTutorialList");
    const tutorialWelcome = document.getElementById("tutorialWelcome");
    const tutorialForm = document.getElementById("tutorialForm");

    const tutorialView = document.getElementById("tutorialView");
    const viewTitle = document.getElementById("viewTitle");
    const viewContent = document.getElementById("viewContent");
    const viewDate = document.getElementById("viewDate");

    const backBtn = document.getElementById("backBtn");
    const completeBtn = document.getElementById("completeBtn");
    const deleteBtn = document.getElementById("deleteBtn");

    let currentTutorialId = null;

    // ===== STORAGE =====
    function getTutorials() {
        return JSON.parse(localStorage.getItem("tutorials")) || [];
    }

    function saveTutorials(tuts) {
        localStorage.setItem("tutorials", JSON.stringify(tuts));
    }

    // ===== CREATE =====
    postBtn.addEventListener("click", () => {
        if (!titleInput.value.trim() || !contentInput.value.trim()) {
            alert("Please fill in all fields.");
            return;
        }

        const tutorial = {
            id: Date.now(),
            title: titleInput.value.trim(),
            content: contentInput.value.trim(),
            date: new Date().toLocaleString(),
            completed: false
        };

        const tuts = getTutorials();
        tuts.unshift(tutorial);
        saveTutorials(tuts);

        titleInput.value = "";
        contentInput.value = "";

        loadTutorials();
        logActivity("tutorial_upload");
        viewTutorial(tutorial.id); // 🔹 auto-open after creation
    });

    // ===== LOAD =====
    function loadTutorials() {
        const tuts = getTutorials();
        tutorialList.innerHTML = "";
        completedList.innerHTML = "";

        if (tuts.length === 0) {
            tutorialList.innerHTML = "<p>No tutorials yet.</p>";
            return;
        }

        tuts.forEach(t => {
            const div = document.createElement("div");
            div.className = "tutorial-item";

            div.innerHTML = `
                <h3>${t.title}</h3>
                <p>${t.content.substring(0, 100)}...</p>
                <small>${t.date}</small><br>
                <a href="#" onclick="viewTutorial(${t.id})">
                    <i class="fa-solid fa-arrow-right"></i> Read More
                </a>
            `;

            t.completed ? completedList.appendChild(div) : tutorialList.appendChild(div);
        });
    }

    // ===== VIEW =====
    window.viewTutorial = function (id) {
        const tuts = getTutorials();
        const t = tuts.find(x => x.id === id);
        if (!t) return;

        currentTutorialId = id;

        tutorialWelcome.style.display = "none";
        tutorialForm.style.display = "none";
        tutorialView.style.display = "block";
        tutorialList.parentElement.style.display = "none";

        viewTitle.textContent = t.title;
        viewContent.textContent = t.content;
        viewDate.textContent = `Posted on: ${t.date}`;

        completeBtn.style.display = t.completed ? "none" : "inline-block";
    };

    // ===== BACK =====
    backBtn.addEventListener("click", () => {
        tutorialView.style.display = "none";
        tutorialList.parentElement.style.display = "block";
        loadTutorials();
    });

    // ===== COMPLETE =====
    completeBtn.addEventListener("click", () => {
        const tuts = getTutorials();
        const t = tuts.find(x => x.id === currentTutorialId);
        if (!t) return;

        t.completed = true;
        saveTutorials(tuts);
        backBtn.click();
    });

    // ===== DELETE =====
    deleteBtn.addEventListener("click", () => {
        if (!confirm("Delete this tutorial?")) return;

        let tuts = getTutorials();
        tuts = tuts.filter(x => x.id !== currentTutorialId);
        saveTutorials(tuts);
        backBtn.click();
    });

    // INIT
    loadTutorials();
});
