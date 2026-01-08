// ===== ELEMENTS =====
const titleInput = document.getElementById("question-title");
const textInput = document.getElementById("question-text");
const postBtn = document.getElementById("postQuestionBtn");

const questionList = document.getElementById("questionList");
const answeredList = document.getElementById("answeredList");

const questionView = document.getElementById("questionView");
const viewTitle = document.getElementById("viewTitle");
const viewText = document.getElementById("viewText");
const viewDate = document.getElementById("viewDate");

const answerList = document.getElementById("answerList");
const answerInput = document.getElementById("answerInput");
const postAnswerBtn = document.getElementById("postAnswerBtn");
const markAnsweredBtn = document.getElementById("markAnsweredBtn");
const backBtn = document.getElementById("backBtn");
const deleteQuestionBtn = document.getElementById("deleteQuestionBtn");

let currentQuestionId = null;

// ===== STORAGE =====
function getQuestions() {
    return JSON.parse(localStorage.getItem("questions")) || [];
}

function saveQuestions(qs) {
    localStorage.setItem("questions", JSON.stringify(qs));
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", loadQuestions);

// ===== ASK QUESTION =====
postBtn.addEventListener("click", () => {
    if (!titleInput.value || !textInput.value) {
        alert("Please fill in both fields.");
        return;
    }

    const question = {
        id: Date.now(),
        title: titleInput.value,
        text: textInput.value,
        date: new Date().toLocaleString(),
        answers: [],
        answered: false
    };

    const qs = getQuestions();
    qs.unshift(question);
    saveQuestions(qs);
    loadQuestions();
    logActivity("question");

    titleInput.value = "";
    textInput.value = "";
});

// ===== LOAD QUESTIONS =====
function loadQuestions() {
    const qs = getQuestions();
    questionList.innerHTML = "";
    answeredList.innerHTML = "";

    qs.forEach(q => {
        const div = document.createElement("div");
        div.className = "question-item";
        div.innerHTML = `
            <h3>${q.title}</h3>
            <p>${q.text.substring(0, 100)}...</p>
            <small>${q.date}</small><br>

            <a href="#" onclick="viewQuestion(${q.id})">
                <i class="fa-solid fa-comments"></i> View Answers
            </a>
            |
            <a href="#" onclick="deleteQuestion(${q.id})" style="color:red;">
                <i class="fa-solid fa-trash"></i> Delete
            </a>
        `;
        q.answered ? answeredList.appendChild(div) : questionList.appendChild(div);
    });
}

// ===== VIEW QUESTION =====
function viewQuestion(id) {
    const qs = getQuestions();
    const q = qs.find(x => x.id === id);
    if (!q) return;

    currentQuestionId = id;

    questionView.style.display = "block";
    questionList.parentElement.style.display = "none";

    viewTitle.textContent = q.title;
    viewText.textContent = q.text;
    viewDate.textContent = `Asked on: ${q.date}`;

    displayAnswers(q);

    postAnswerBtn.style.display = q.answered ? "none" : "inline-block";
    answerInput.style.display = q.answered ? "none" : "block";
    markAnsweredBtn.style.display = q.answered ? "none" : "inline-block";
}

// ===== ANSWERS =====
function displayAnswers(q) {
    answerList.innerHTML = "";

    if (q.answers.length === 0) {
        answerList.innerHTML = "<p>No answers yet.</p>";
        return;
    }

    q.answers.forEach(a => {
        const div = document.createElement("div");
        div.className = "question-item";
        div.innerHTML = `<p>${a.text}</p><small>${a.date}</small>`;
        answerList.appendChild(div);
    });
}

postAnswerBtn.addEventListener("click", () => {
    if (!answerInput.value) return;

    const qs = getQuestions();
    const q = qs.find(x => x.id === currentQuestionId);
    if (!q || q.answered) return;

    q.answers.push({
        text: answerInput.value,
        date: new Date().toLocaleString()
    });

    saveQuestions(qs);
    answerInput.value = "";
    displayAnswers(q);
});

// ===== MARK ANSWERED =====
markAnsweredBtn.addEventListener("click", () => {
    const qs = getQuestions();
    const q = qs.find(x => x.id === currentQuestionId);
    if (!q) return;

    q.answered = true;
    saveQuestions(qs);
    backBtn.click();
});

// ===== DELETE QUESTION ====
function deleteQuestion(id) {
    if (!confirm("Are you sure you want to delete this question?")) return;

    let qs = getQuestions();
    qs = qs.filter(q => q.id !== id);

    saveQuestions(qs);
    loadQuestions();
}

deleteQuestionBtn.addEventListener("click", () => {
    if (!currentQuestionId) return;

    if (!confirm("Are you sure you want to delete this question?")) return;

    let qs = getQuestions();
    qs = qs.filter(q => q.id !== currentQuestionId);

    saveQuestions(qs);
    backBtn.click();
});

// ===== BACK =====
backBtn.addEventListener("click", () => {
    questionView.style.display = "none";
    questionList.parentElement.style.display = "block";
    loadQuestions();
});

// Global
window.viewQuestion = viewQuestion;
window.deleteQuestion = deleteQuestion;