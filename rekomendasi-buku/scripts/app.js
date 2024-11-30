document.addEventListener('DOMContentLoaded', () => {
    // Display initial books
    displayBooks(books, 1);

    // Setup search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        const searchResults = searchBooks(query);
        displayBooks(searchResults, 1);
    });

    // Setup sort functionality
    const sortSelect = document.getElementById('sortSelect');
    sortSelect.addEventListener('change', (e) => {
        const sortBy = e.target.value;
        const sortedBooks = sortBooks(sortBy);
        displayBooks(sortedBooks, 1);
    });
}); 