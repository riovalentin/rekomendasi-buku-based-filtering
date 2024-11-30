function saveBooks() {
    localStorage.setItem('books', JSON.stringify(books));
}

function loadBooks() {
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
        books = JSON.parse(storedBooks);
    }
}

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

function loadUsers() {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    }
}

// Panggil fungsi-fungsi ini saat aplikasi dimulai
loadBooks();
loadUsers(); 