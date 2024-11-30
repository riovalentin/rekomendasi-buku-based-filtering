class ContentBasedRecommender {
    constructor(books) {
        this.books = books;
    }

    // Hitung similarity berdasarkan atribut yang ada
    calculateSimilarity(book1, book2) {
        const authorSimilarity = book1.author === book2.author ? 1 : 0;
        const publisherSimilarity = book1.publisher === book2.publisher ? 1 : 0;
        const yearSimilarity = 1 - Math.abs(parseInt(book1.year) - parseInt(book2.year)) / 100;

        // Bobot untuk setiap fitur
        return (
            authorSimilarity * 0.5 +
            publisherSimilarity * 0.3 +
            yearSimilarity * 0.2
        );
    }

    // Dapatkan rekomendasi untuk buku tertentu
    getRecommendations(book, numRecommendations = 5) {
        const similarities = this.books
            .filter(b => b.isbn !== book.isbn)
            .map(b => ({
                book: b,
                similarity: this.calculateSimilarity(book, b)
            }))
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, numRecommendations);

        return similarities;
    }
}

// Export untuk digunakan di file lain
window.ContentBasedRecommender = ContentBasedRecommender; 