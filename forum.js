// ===== ELEMENT REFERENCES =====
const titleInput = document.getElementById("thread-title");
const contentInput = document.getElementById("thread-content");
const postButton = document.getElementById("postThreadBtn");

const discussionList = document.getElementById("discussionList");
const completedDiscussionList = document.getElementById("completedDiscussionList");

const createThreadSection = document.getElementById("createThreadSection");
const showCreateThreadBtn = document.getElementById("showCreateThreadBtn");

const threadView = document.getElementById("threadView");
const threadTitle = document.getElementById("threadTitle");
const threadContent = document.getElementById("threadContent");
const threadDate = document.getElementById("threadDate");

const replyList = document.getElementById("replyList");
const replyContent = document.getElementById("replyContent");
const postReplyBtn = document.getElementById("postReplyBtn");

const backBtn = document.getElementById("backBtn");
const completeThreadBtn = document.getElementById("completeThreadBtn");
const deleteThreadBtn = document.getElementById("deleteThreadBtn");

let currentThreadId = null;

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
    createThreadSection.style.display = "none";
    loadThreads();
});

// ===== SHOW CREATE THREAD FORM =====
showCreateThreadBtn.addEventListener("click", () => {
    createThreadSection.style.display = "block";
    showCreateThreadBtn.style.display = "none";

    // Optional: hide discussion lists while creating
    discussionList.parentElement.style.display = "none";
    completedDiscussionList.parentElement.style.display = "none";
});

// ===== STORAGE =====
function getStoredThreads() {
    return JSON.parse(localStorage.getItem("threads")) || [];
}

function saveThreads(threads) {
    localStorage.setItem("threads", JSON.stringify(threads));
}

// ===== CREATE THREAD =====
postButton.addEventListener("click", () => {
    if (!titleInput.value || !contentInput.value) {
        alert("Please fill in both title and content.");
        return;
    }

    const thread = {
        id: Date.now(),
        title: titleInput.value,
        content: contentInput.value,
        date: new Date().toLocaleString(),
        replies: [],
        completed: false
    };

    const threads = getStoredThreads();
    threads.unshift(thread);
    saveThreads(threads);

    titleInput.value = "";
    contentInput.value = "";

    loadThreads();
    logActivity("forum_post");

    // RESET VIEW
    createThreadSection.style.display = "none";
    showCreateThreadBtn.style.display = "block";
    discussionList.parentElement.style.display = "block";
    completedDiscussionList.parentElement.style.display = "block";

});

// ===== LOAD & DISPLAY THREADS =====
function loadThreads() {
    const threads = getStoredThreads();
    discussionList.innerHTML = "";
    completedDiscussionList.innerHTML = "";

    threads.forEach(thread => {
        const div = document.createElement("div");
        div.className = "discussion-item";

        div.innerHTML = `
            <h3>${thread.title}</h3>
            <p>${thread.content.substring(0, 120)}...</p>
            <small>${thread.date}</small><br>
            <a href="#" onclick="viewThread(${thread.id})">
                <i class="fa-solid fa-arrow-right"></i> View Discussion
            </a>
        `;

        if (thread.completed) {
            completedDiscussionList.appendChild(div);
        } else {
            discussionList.appendChild(div);
        }
    });
}

// ===== VIEW THREAD =====
function viewThread(threadId) {
    currentThreadId = threadId;
    const threads = getStoredThreads();
    const thread = threads.find(t => t.id === threadId);

    if (!thread) return;

    discussionList.parentElement.style.display = "none";
    completedDiscussionList.parentElement.style.display = "none";
    createThreadSection.style.display = "none";
    showCreateThreadBtn.style.display = "none";

    threadView.style.display = "block";

    threadTitle.textContent = thread.title;
    threadContent.textContent = thread.content;
    threadDate.textContent = `Posted on: ${thread.date}`;

    completeThreadBtn.style.display = thread.completed ? "none" : "inline-block";
    postReplyBtn.style.display = thread.completed ? "none" : "inline-block";
    replyContent.style.display = thread.completed ? "none" : "block";

    displayReplies(thread.replies);
}

// ===== BACK BUTTON (FIXED) =====
backBtn.addEventListener("click", () => {
    threadView.style.display = "none";
    discussionList.parentElement.style.display = "block";
    completedDiscussionList.parentElement.style.display = "block";
    showCreateThreadBtn.style.display = "block";
    loadThreads();
});

// ===== REPLIES =====
postReplyBtn.addEventListener("click", () => {
    if (!replyContent.value) return;

    const threads = getStoredThreads();
    const thread = threads.find(t => t.id === currentThreadId);

    if (!thread || thread.completed) return;

    thread.replies.push({
        content: replyContent.value,
        date: new Date().toLocaleString()
    });

    saveThreads(threads);
    replyContent.value = "";
    displayReplies(thread.replies);
});

function displayReplies(replies) {
    replyList.innerHTML = "";

    if (replies.length === 0) {
        replyList.innerHTML = "<p>No replies yet.</p>";
        return;
    }

    replies.forEach(r => {
        const div = document.createElement("div");
        div.className = "discussion-item";
        div.innerHTML = `
            <p>${r.content}</p>
            <small>${r.date}</small>
        `;
        replyList.appendChild(div);
    });
}

// ===== COMPLETE THREAD =====
completeThreadBtn.addEventListener("click", () => {
    const threads = getStoredThreads();
    const thread = threads.find(t => t.id === currentThreadId);

    if (!thread) return;

    thread.completed = true;
    saveThreads(threads);
    backBtn.click();
});

// ===== DELETE THREAD =====
deleteThreadBtn.addEventListener("click", () => {
    if (!confirm("Are you sure you want to delete this discussion?")) return;

    let threads = getStoredThreads();
    threads = threads.filter(t => t.id !== currentThreadId);
    saveThreads(threads);
    backBtn.click();
});

// Make accessible
window.viewThread = viewThread;
