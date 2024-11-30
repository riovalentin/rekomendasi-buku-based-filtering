function toggleFavorite(bookId) {
    if (!currentUser) {
        alert('Please login to add favorites');
        return;
    }

    const index = currentUser.favorites.indexOf(bookId);
    if (index === -1) {
        currentUser.favorites.push(bookId);
        alert('Book added to favorites');
    } else {
        currentUser.favorites.splice(index, 1);
        alert('Book removed from favorites');
    }
    
    // Update user data in localStorage
    updateUserData();
    
    // Refresh the book details display
    const book = books.find(b => b.id === bookId);
    displayBookDetails(book);
}

function isBookFavorite(bookId) {
    return currentUser && currentUser.favorites.includes(bookId);
}

function rateBook(bookId, rating) {
    if (!currentUser) {
        alert('Please login to rate books');
        return;
    }

    const book = books.find(b => b.id === bookId);
    if (!book.ratings) {
        book.ratings = [];
    }
    book.ratings.push(rating);
    book.averageRating = book.ratings.reduce((a, b) => a + b) / book.ratings.length;
    
    // Update books data in localStorage
    localStorage.setItem('books', JSON.stringify(books));
    
    displayBookDetails(book);
    alert(`You rated "${book.title}" ${rating} stars!`);
}

function updateUserData() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = users.map(u => u.id === currentUser.id ? currentUser : u);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
} 