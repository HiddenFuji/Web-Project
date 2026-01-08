// ===== ELEMENT REFERENCES =====
const uploadSection = document.getElementById("uploadSection");
const noteTitle = document.getElementById("note-title");
const subjectInput = document.getElementById("subject");
const fileUpload = document.getElementById("file-upload");
const uploadBtn = document.getElementById("uploadNoteBtn");

const notesList = document.getElementById("notesList");
const noteView = document.getElementById("noteView");
const backBtn = document.getElementById("backToNotesBtn");

const viewTitle = document.getElementById("viewNoteTitle");
const viewSubject = document.getElementById("viewNoteSubject");
const noteMedia = document.getElementById("noteMedia");
const deleteBtn = document.getElementById("deleteNoteBtn");
const notesSection = document.getElementById("notesSection");


let currentNoteId = null;

// ===== FILE INPUT UX =====
document.querySelector('.file-input-wrapper').addEventListener('click', () => {
    fileUpload.click();
});

fileUpload.addEventListener('change', e => {
    if (e.target.files.length > 0) {
        document.querySelector('.file-input-wrapper p').textContent = e.target.files[0].name;
    }
});

// ===== INIT =====
document.addEventListener("DOMContentLoaded", loadNotes);

// ===== STORAGE =====
function getNotes() {
    return JSON.parse(localStorage.getItem("notes")) || [];
}

function saveNotes(notes) {
    localStorage.setItem("notes", JSON.stringify(notes));
}

// ===== UPLOAD NOTE =====
uploadBtn.addEventListener("click", () => {
    if (!noteTitle.value || !subjectInput.value || fileUpload.files.length === 0) {
        alert("Please fill in all fields and upload a file.");
        return;
    }

    const file = fileUpload.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        const note = {
            id: Date.now(),
            title: noteTitle.value,
            subject: subjectInput.value,
            fileType: file.type,
            data: reader.result,
            date: new Date().toLocaleString()
        };

        const notes = getNotes();
        notes.unshift(note);
        saveNotes(notes);
        loadNotes();
        viewNote(note.id);

        noteTitle.value = "";
        subjectInput.value = "";
        fileUpload.value = "";
        document.querySelector('.file-input-wrapper p').textContent =
            "Click to upload or drag and drop";
    };
    logActivity("note_upload");
    reader.readAsDataURL(file);
});

// ===== LOAD NOTES =====
function loadNotes() {
    const notes = getNotes();
    notesList.innerHTML = "";

    if (notes.length === 0) {
        notesList.innerHTML = "<p>No notes uploaded yet.</p>";
        return;
    }

    notes.forEach(note => {
        const div = document.createElement("div");
        div.className = "note-item";

        div.innerHTML = `
            <h3>${note.title}</h3>
            <p>Subject: ${note.subject}</p>
            <small>${note.date}</small><br>
            <a href="#" onclick="viewNote(${note.id})">
                <i class="fa-solid fa-eye"></i> View Note
            </a>
        `;

        notesList.appendChild(div);
    });
}

// ===== VIEW NOTE =====
function viewNote(id) {
    const notes = getNotes();
    const note = notes.find(n => n.id === id);
    if (!note) return;

    currentNoteId = id;
    uploadSection.style.display = "none";
    notesSection.style.display = "none";
    noteView.style.display = "block";

    viewTitle.textContent = note.title;
    viewSubject.textContent = `Subject: ${note.subject}`;
    noteMedia.innerHTML = "";

    if (note.fileType.startsWith("image")) {
        noteMedia.innerHTML = `<img src="${note.data}" style="max-width:100%;">`;
    } else if (note.fileType.startsWith("video")) {
        noteMedia.innerHTML = `
            <video controls style="max-width:100%">
                <source src="${note.data}" type="${note.fileType}">
            </video>`;
    } else {
        noteMedia.innerHTML = `<a href="${note.data}" download>Download File</a>`;
    }
}

// ===== BACK =====
backBtn.addEventListener("click", () => {
    uploadSection.style.display = "block";
    noteView.style.display = "none";
    notesSection.style.display = "block";
    loadNotes();
});

// ===== DELETE NOTE =====
deleteBtn.addEventListener("click", () => {
    if (!confirm("Delete this note?")) return;

    let notes = getNotes();
    notes = notes.filter(n => n.id !== currentNoteId);
    saveNotes(notes);
    backBtn.click();
});

// Global access
window.viewNote = viewNote;
