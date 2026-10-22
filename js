// Sample Mock Data (Secara otomatis terisi saat pertama kali dibuka)
const initialNotes = [
    {
        id: "1",
        title: "Ringkasan Polinomial & Suku Banyak",
        category: "SMA",
        grade: "11",
        subject: "Matematika",
        author: "Rian (SMAN 1 Bandung)",
        description: "Rangkuman lengkap rumus polinomial, pembagian bersusun, dan teorema sisa disertai contoh soal latihan.",
        link: "https://drive.google.com"
    },
    {
        id: "2",
        title: "Dasar Pemrograman Web HTML & CSS",
        category: "SMK",
        grade: "10",
        subject: "Informatika",
        author: "Siti (SMKN 2 Surabaya)",
        description: "Panduan praktis tag-tag dasar HTML5, styling CSS Flexbox & Grid untuk pemula jurusan RPL/TKJ.",
        link: "https://drive.google.com"
    },
    {
        id: "3",
        title: "Hukum Newton & Aplikasinya",
        category: "SMA",
        grade: "10",
        subject: "Fisika",
        author: "Andi (SMAN 3 Semarang)",
        description: "Penjelasan Hukum I, II, dan III Newton lengkap dengan analisis gaya gesek dan diagram gaya.",
        link: "https://drive.google.com"
    }
    {
        id: "4",
        title: "Ilmu Ekonomi & Masalah Ekonomi ",
        category: "SMA",
        grade: "10",
        subject: "Ekonomi",
        author: "lulu (SMAN Bandarkedungmulyo)",
        description: "Penjelasan Pengertian, Tujuan dan Manfaat, Kebutuhan manusia dan alat kebutuhan manusia.",
        link: "https://drive.google.com"
    }
];

// Load Notes & Bookmarks from Local Storage
let notes = JSON.parse(localStorage.getItem('catatyuk_notes')) || initialNotes;
let bookmarks = JSON.parse(localStorage.getItem('catatyuk_bookmarks')) || [];

// DOM Elements
const notesGrid = document.getElementById('notesGrid');
const searchInput = document.getElementById('searchInput');
const filterCategory = document.getElementById('filterCategory');
const filterGrade = document.getElementById('filterGrade');
const filterSubject = document.getElementById('filterSubject');
const resetFilterBtn = document.getElementById('resetFilterBtn');
const emptyState = document.getElementById('emptyState');
const sectionTitle = document.getElementById('sectionTitle');

// Modal Elements
const noteModal = document.getElementById('noteModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const addNoteForm = document.getElementById('addNoteForm');

let activeTab = 'all';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    saveNotesToLocalStorage();
    renderNotes();
    setupEventListeners();
});

function saveNotesToLocalStorage() {
    localStorage.setItem('catatyuk_notes', JSON.stringify(notes));
    localStorage.setItem('catatyuk_bookmarks', JSON.stringify(bookmarks));
}

// Render Notes to DOM
function renderNotes() {
    notesGrid.innerHTML = '';
    
    const query = searchInput.value.toLowerCase();
    const category = filterCategory.value;
    const grade = filterGrade.value;
    const subject = filterSubject.value;

    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(query) || 
                              note.description.toLowerCase().includes(query) ||
                              note.subject.toLowerCase().includes(query);
        const matchesCategory = category === 'all' || note.category === category;
        const matchesGrade = grade === 'all' || note.grade === grade;
        const matchesSubject = subject === 'all' || note.subject === subject;
        const matchesTab = activeTab === 'all' || (activeTab === 'bookmarked' && bookmarks.includes(note.id));

        return matchesSearch && matchesCategory && matchesGrade && matchesSubject && matchesTab;
    });

    if (filteredNotes.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        filteredNotes.forEach(note => {
            const isBookmarked = bookmarks.includes(note.id);
            const card = document.createElement('div');
            card.className = 'note-card';
            card.innerHTML = `
                <div>
                    <div class="card-tags">
                        <span class="badge ${note.category === 'SMA' ? 'badge-sma' : 'badge-smk'}">${note.category}</span>
                        <span class="badge badge-subject">Kelas ${note.grade}</span>
                        <span class="badge badge-subject">${note.subject}</span>
                    </div>
                    <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" onclick="toggleBookmark('${note.id}')">
                        <i class="${isBookmarked ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
                    </button>
                    <h3 class="note-title">${note.title}</h3>
                    <p class="note-desc">${note.description}</p>
                </div>
                <div>
                    <div class="note-author"><i class="fa-regular fa-user"></i> ${note.author}</div>
                    <div class="card-footer">
                        <a href="${note.link}" target="_blank" class="btn-link">Buka Catatan <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                    </div>
                </div>
            `;
            notesGrid.appendChild(card);
        });
    }
}

// Toggle Bookmark Function
window.toggleBookmark = function(id) {
    if (bookmarks.includes(id)) {
        bookmarks = bookmarks.filter(bId => bId !== id);
    } else {
        bookmarks.push(id);
    }
    saveNotesToLocalStorage();
    renderNotes();
};

// Event Listeners Setup
function setupEventListeners() {
    searchInput.addEventListener('input', renderNotes);
    filterCategory.addEventListener('change', renderNotes);
    filterGrade.addEventListener('change', renderNotes);
    filterSubject.addEventListener('change', renderNotes);

    resetFilterBtn.addEventListener('click', () => {
        searchInput.value = '';
        filterCategory.value = 'all';
        filterGrade.value = 'all';
        filterSubject.value = 'all';
        renderNotes();
    });

    // Tab Navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            activeTab = e.target.dataset.tab;
            sectionTitle.textContent = activeTab === 'bookmarked' ? 'Catatan Tersimpan' : 'Daftar Catatan Terbaru';
            renderNotes();
        });
    });

    // Modal Events
    openModalBtn.addEventListener('click', () => noteModal.classList.remove('hidden'));
    closeModalBtn.addEventListener('click', () => noteModal.classList.add('hidden'));
    cancelModalBtn.addEventListener('click', () => noteModal.classList.add('hidden'));

    // Form Submit (Add New Note)
    addNoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newNote = {
            id: Date.now().toString(),
            title: document.getElementById('noteTitle').value,
            category: document.getElementById('noteCategory').value,
            grade: document.getElementById('noteGrade').value,
            subject: document.getElementById('noteSubject').value,
            author: document.getElementById('authorName').value,
            description: document.getElementById('noteDescription').value,
            link: document.getElementById('noteLink').value
        };

        notes.unshift(newNote);
        saveNotesToLocalStorage();
        renderNotes();
        addNoteForm.reset();
        noteModal.classList.add('hidden');
    });
}
