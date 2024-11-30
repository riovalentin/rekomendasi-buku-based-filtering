class EnhancedRecommender {
    constructor(books) {
        this.books = books;
        this.userPreferences = new UserPreference();
        this.preprocessBooks();
    }

    preprocessBooks() {
        this.books.forEach(book => {
            // Preprocess description
            book.processedDescription = this.preprocessText(book.description);
            // Generate TF-IDF vectors
            book.tfidfVector = this.calculateTFIDF(book.processedDescription);
            // Process genres
            book.genreVector = this.processGenres(book.genre);
        });
    }

    preprocessText(text) {
        return text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => !this.stopWords.includes(word));
    }

    processGenres(genres) {
        const allGenres = this.getAllUniqueGenres();
        const vector = new Array(allGenres.length).fill(0);
        genres.forEach(genre => {
            const index = allGenres.indexOf(genre);
            if (index !== -1) vector[index] = 1;
        });
        return vector;
    }

    calculateTFIDF(terms) {
        const tf = this.calculateTF(terms);
        const idf = this.calculateIDF(terms);
        const vector = {};
        
        Object.keys(tf).forEach(term => {
            vector[term] = tf[term] * (idf[term] || 0);
        });
        
        return vector;
    }

    calculateCosineSimilarity(vec1, vec2) {
        const dotProduct = Object.keys(vec1).reduce((sum, key) => {
            return sum + (vec1[key] * (vec2[key] || 0));
        }, 0);

        const magnitude1 = Math.sqrt(Object.values(vec1).reduce((sum, val) => sum + val * val, 0));
        const magnitude2 = Math.sqrt(Object.values(vec2).reduce((sum, val) => sum + val * val, 0));

        return dotProduct / (magnitude1 * magnitude2) || 0;
    }

    calculateJaccardSimilarity(set1, set2) {
        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const union = new Set([...set1, ...set2]);
        return intersection.size / union.size;
    }

    calculateSimilarity(book1, book2) {
        // Content similarity
        const descriptionSimilarity = this.calculateCosineSimilarity(
            book1.tfidfVector,
            book2.tfidfVector
        );

        const genreSimilarity = this.calculateCosineSimilarity(
            book1.genreVector,
            book2.genreVector
        );

        const keywordSimilarity = this.calculateJaccardSimilarity(
            new Set(book1.keywords),
            new Set(book2.keywords)
        );

        // Metadata similarity
        const authorSimilarity = book1.author === book2.author ? 1 : 0;
        const publisherSimilarity = book1.publisher === book2.publisher ? 1 : 0;
        const yearDiff = Math.abs(parseInt(book1.year) - parseInt(book2.year));
        const yearSimilarity = Math.max(0, 1 - yearDiff / 100);

        // Weighted combination
        return (
            descriptionSimilarity * 0.3 +
            genreSimilarity * 0.25 +
            keywordSimilarity * 0.2 +
            authorSimilarity * 0.15 +
            publisherSimilarity * 0.05 +
            yearSimilarity * 0.05
        );
    }

    getRecommendations(book, numRecommendations = 5) {
        // Get basic content-based recommendations
        const contentBasedScores = this.books
            .filter(b => b.isbn !== book.isbn)
            .map(b => ({
                book: b,
                similarity: this.calculateSimilarity(book, b)
            }));

        // Adjust scores based on user preferences
        const adjustedScores = contentBasedScores.map(item => ({
            ...item,
            score: this.adjustScoreWithPreferences(item.book, item.similarity)
        }));

        // Sort and return top recommendations
        return adjustedScores
            .sort((a, b) => b.score - a.score)
            .slice(0, numRecommendations);
    }

    adjustScoreWithPreferences(book, baseScore) {
        let adjustedScore = baseScore;

        // Boost score if genre matches user preferences
        if (book.genre.some(g => this.userPreferences.preferredGenres.has(g))) {
            adjustedScore *= 1.2;
        }

        // Boost score if author matches user preferences
        if (this.userPreferences.preferredAuthors.has(book.author)) {
            adjustedScore *= 1.1;
        }

        // Reduce score if book has been read
        if (this.userPreferences.readBooks.has(book.isbn)) {
            adjustedScore *= 0.1;
        }

        return adjustedScore;
    }

    // Stop words list
    stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
}

class UserPreference {
    constructor() {
        this.preferredGenres = new Set();
        this.preferredAuthors = new Set();
        this.readBooks = new Set();
        this.loadPreferences();
    }

    loadPreferences() {
        const savedPreferences = localStorage.getItem('userPreferences');
        if (savedPreferences) {
            const prefs = JSON.parse(savedPreferences);
            this.preferredGenres = new Set(prefs.genres);
            this.preferredAuthors = new Set(prefs.authors);
            this.readBooks = new Set(prefs.readBooks);
        }
    }

    savePreferences() {
        const prefsToSave = {
            genres: Array.from(this.preferredGenres),
            authors: Array.from(this.preferredAuthors),
            readBooks: Array.from(this.readBooks)
        };
        localStorage.setItem('userPreferences', JSON.stringify(prefsToSave));
    }

    updateFromBook(book) {
        book.genre.forEach(g => this.preferredGenres.add(g));
        this.preferredAuthors.add(book.author);
        this.readBooks.add(book.isbn);
        this.savePreferences();
    }
}

// Export untuk digunakan di file lain
window.EnhancedRecommender = EnhancedRecommender;
