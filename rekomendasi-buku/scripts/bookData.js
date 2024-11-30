let books = [];

function initializeBooks() {
    books = window.booksData.books;
    initializeFilters();
    return books;
}

function getUniquePublishers() {
    return [...new Set(books.map(book => book.publisher))].sort();
}

function getUniqueYears() {
    return [...new Set(books.map(book => book.year))].sort((a, b) => b - a);
}

function filterBooks(filters) {
    return books.filter(book => {
        const publisherMatch = !filters.publisher || book.publisher === filters.publisher;
        const yearMatch = !filters.year || book.year === filters.year;
        const searchMatch = !filters.search || 
            book.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            book.author.toLowerCase().includes(filters.search.toLowerCase()) ||
            book.publisher.toLowerCase().includes(filters.search.toLowerCase());
        
        return publisherMatch && yearMatch && searchMatch;
    });
}

window.bookData = {
    initializeBooks,
    getUniquePublishers,
    getUniqueYears,
    filterBooks
};