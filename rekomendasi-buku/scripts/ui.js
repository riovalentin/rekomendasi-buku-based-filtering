const ITEMS_PER_PAGE = 12;
let currentPage = 1;
let currentBooks = [];
let recommender;
let currentFilters = {
    publisher: '',
    year: '',
    search: ''
};

document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi buku
    currentBooks = bookData.initializeBooks();
    recommender = new ContentBasedRecommender(currentBooks);
    initializeFilters();
    
    // Setup event listeners
    setupEventListeners();
    
    // Tampilkan buku pertama kali
    updateDisplay();
});

function initializeFilters() {
    const publishers = bookData.getUniquePublishers();
    const years = bookData.getUniqueYears();
    
    // Populate publisher filter
    const publisherFilter = document.getElementById('publisherFilter');
    publishers.forEach(publisher => {
        const option = document.createElement('option');
        option.value = publisher;
        option.textContent = publisher;
        publisherFilter.appendChild(option);
    });

    // Populate year filter
    const yearFilter = document.getElementById('yearFilter');
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const publisherFilter = document.getElementById('publisherFilter');
    const yearFilter = document.getElementById('yearFilter');
    const resetFilterBtn = document.getElementById('resetFilter');

    searchInput.addEventListener('input', handleSearch);
    publisherFilter.addEventListener('change', handleFilter);
    yearFilter.addEventListener('change', handleFilter);
    resetFilterBtn.addEventListener('click', resetFilters);
}

function handleSearch(e) {
    currentFilters.search = e.target.value;
    updateDisplay();
}

function handleFilter(e) {
    const filterId = e.target.id;
    if (filterId === 'publisherFilter') {
        currentFilters.publisher = e.target.value;
    } else if (filterId === 'yearFilter') {
        currentFilters.year = e.target.value;
    }
    updateDisplay();
}

function resetFilters() {
    currentFilters = {
        publisher: '',
        year: '',
        search: ''
    };

    // Reset form elements
    document.getElementById('searchInput').value = '';
    document.getElementById('publisherFilter').value = '';
    document.getElementById('yearFilter').value = '';

    updateDisplay();
}

function updateDisplay() {
    const filteredBooks = bookData.filterBooks(currentFilters);
    const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
    
    // Reset to first page when filters change
    if (currentPage > totalPages) {
        currentPage = 1;
    }

    const booksToDisplay = filteredBooks.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    
    displayBooks(booksToDisplay);
    displayPagination(totalPages);
    updateFilterCounts(filteredBooks.length);
}

function updateFilterCounts(totalFiltered) {
    const filterCount = document.createElement('div');
    filterCount.className = 'filter-count';
    filterCount.textContent = `Menampilkan ${totalFiltered} buku`;
    
    const existingCount = document.querySelector('.filter-count');
    if (existingCount) {
        existingCount.remove();
    }
    
    document.querySelector('.filter-section').appendChild(filterCount);
}

function displayBooks(booksToDisplay) {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';

    booksToDisplay.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.className = 'book-card';
        bookElement.innerHTML = `
            <img src="${book.imageUrlM}" alt="${book.title}" 
                 onerror="this.src='https://via.placeholder.com/200x300?text=No+Image'">
            <div class="book-info">
                <h3>${book.title}</h3>
                <p><i class="fas fa-user"></i> ${book.author}</p>
                <p><i class="fas fa-calendar"></i> ${book.year}</p>
                <p><i class="fas fa-building"></i> ${book.publisher}</p>
            </div>
            <button class="recommendation-btn">Lihat Rekomendasi</button>
        `;

        // Tambahkan event listener untuk tombol rekomendasi
        const recButton = bookElement.querySelector('.recommendation-btn');
        recButton.addEventListener('click', (e) => {
            e.stopPropagation();
            showRecommendations(book);
        });
        
        bookList.appendChild(bookElement);
    });
}

function displayPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    // Tambahkan tombol Previous
    const prevButton = document.createElement('button');
    prevButton.className = 'prev';
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updateDisplay();
        }
    });
    pagination.appendChild(prevButton);

    // Tampilkan nomor halaman
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = i === currentPage ? 'active' : '';
        button.addEventListener('click', () => {
            currentPage = i;
            updateDisplay();
        });
        pagination.appendChild(button);
    }

    // Tambahkan tombol Next
    const nextButton = document.createElement('button');
    nextButton.className = 'next';
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            updateDisplay();
        }
    });
    pagination.appendChild(nextButton);
}

function showRecommendations(book) {
    const recommendations = recommender.getRecommendations(book);
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">
                <i class="fas fa-times"></i>
            </button>
            
            <div class="recommendation-header">
                <h2>Rekomendasi Buku Serupa</h2>
                <h3>Berdasarkan: "${book.title}"</h3>
            </div>

            <div class="recommendations-grid">
                ${recommendations.map(rec => `
                    <div class="recommendation-card">
                        <img src="${rec.book.imageUrlM}" 
                             alt="${rec.book.title}"
                             onerror="this.src='assets/images/book-placeholder.jpg'">
                        <div class="recommendation-info">
                            <h4>${rec.book.title}</h4>
                            <div class="book-metadata">
                                <span>
                                    <i class="fas fa-user"></i>
                                    ${rec.book.author}
                                </span>
                                <span>
                                    <i class="fas fa-calendar"></i>
                                    ${rec.book.year}
                                </span>
                                <span>
                                    <i class="fas fa-building"></i>
                                    ${rec.book.publisher}
                                </span>
                            </div>
                            <div class="similarity-badge">
                                ${(rec.similarity * 100).toFixed(0)}% Kemiripan
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
} 