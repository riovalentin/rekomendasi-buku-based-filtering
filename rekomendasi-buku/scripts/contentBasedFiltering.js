function calculateSimilarity(book1, book2) {
    const genreSimilarity = book1.genre.filter(g => book2.genre.includes(g)).length / 
                            Math.max(book1.genre.length, book2.genre.length);
    
    // Implementasi sederhana untuk kesamaan deskripsi menggunakan Jaccard similarity
    const words1 = new Set(book1.description.toLowerCase().split(/\W+/));
    const words2 = new Set(book2.description.toLowerCase().split(/\W+/));
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const descriptionSimilarity = intersection.size / (words1.size + words2.size - intersection.size);
    
    // Bobot untuk setiap faktor
    const genreWeight = 0.6;
    const descriptionWeight = 0.4;
    
    return (genreSimilarity * genreWeight) + (descriptionSimilarity * descriptionWeight);
}

function getRecommendations(targetBook, allBooks, numRecommendations = 5) {
    const similarities = allBooks
        .filter(book => book.id !== targetBook.id)
        .map(book => ({
            book,
            similarity: calculateSimilarity(targetBook, book)
        }))
        .sort((a, b) => b.similarity - a.similarity);

    return similarities.slice(0, numRecommendations).map(item => item.book);
} 