document.addEventListener('DOMContentLoaded', () => {
    // Ambil ID buku dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = parseInt(urlParams.get('id'));

    if (bookId) {
        displayBookDetail(bookId);
    } else {
        window.location.href = 'index.html';
    }
});

function displayBookDetail(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) {
        window.location.href = 'index.html';
        return;
    }

    const container = document.getElementById('bookDetailContainer');
    container.innerHTML = `
        <div class="book-detail">
            <img src="${book.coverImage}" alt="${book.title} cover">
            <div class="book-info">
                <h2>${book.title}</h2>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Genre:</strong> ${book.genre.join(', ')}</p>
                <p><strong>Average Rating:</strong> ${book.averageRating.toFixed(1)}</p>
                <p class="description"><strong>Description:</strong><br>${book.description}</p>
            </div>
            <div class="rating-section">
                <h3>Rate this book:</h3>
                <div class="rating">
                    ${generateStarRating(book)}
                </div>
            </div>
            <div class="action-buttons">
                <button onclick="toggleFavorite(${book.id})">
                    ${isBookFavorite(book.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
                <button onclick="showRecommendations(${book.id})">Get Recommendations</button>
            </div>
        </div>
    `;

    // Tampilkan rekomendasi secara default
    showRecommendations(bookId);
}

function showRecommendations(bookId) {
    const targetBook = books.find(book => book.id === bookId);
    const recommendations = getRecommendations(targetBook, books);
    
    const recommendationsSection = document.getElementById('recommendations');
    recommendationsSection.innerHTML = `
        <h2>Similar Books You Might Like</h2>
        <div class="book-grid">
            ${recommendations.map(book => `
                <div class="book" onclick="window.location.href='bookDetail.html?id=${book.id}'">
                    <img src="${book.coverImage}" alt="${book.title} cover">
                    <h3>${book.title}</h3>
                    <p>${book.author}</p>
                    <p>Rating: ${book.averageRating.toFixed(1)}</p>
                </div>
            `).join('')}
        </div>
    `;
} 