/**
 * LearnSync Hub - Reading Log Module
 * Features:
 * - Track books you're reading or want to read
 * - Rate books and add notes
 * - Sort by various criteria
 * - Filter by status, category, etc.
 */

const ReadingLog = (() => {
    // State
    let books = [];
    let currentSort = {
        field: 'date',
        direction: 'desc'
    };
    
    // Initialize the reading log
    const init = () => {
        // Load books from localStorage or use sample data
        loadBooks();
        
        // Render the book list
        renderReadingLog();
        
        // Update statistics
        updateReadingStats();
        
        // Setup event listeners
        setupEventListeners();
    };
    
    // Load books from localStorage or use sample data
    const loadBooks = () => {
        // Sample books to use if no saved books exist
        const sampleBooks = [
            {
                id: 'book-1',
                title: 'Deep Learning',
                author: 'Ian Goodfellow, Yoshua Bengio & Aaron Courville',
                category: 'Technology',
                progress: 'Completed',
                rating: 5,
                date: '2023-05-10',
                notes: 'Comprehensive overview of deep learning principles and techniques.'
            },
            {
                id: 'book-2',
                title: 'Thinking, Fast and Slow',
                author: 'Daniel Kahneman',
                category: 'Psychology',
                progress: 'In Progress',
                rating: 4,
                date: '2023-06-15',
                notes: 'Fascinating insights into the two systems that drive human thinking.'
            },
            {
                id: 'book-3',
                title: 'The Brain That Changes Itself',
                author: 'Norman Doidge',
                category: 'Neuroscience',
                progress: 'Not Started',
                rating: 0,
                date: '2023-07-01',
                notes: ''
            }
        ];
        
        // Try to load from localStorage first
        const savedBooks = localStorage.getItem('reading-log');
        books = savedBooks ? JSON.parse(savedBooks) : sampleBooks;
    };
    
    // Set up all event listeners
    const setupEventListeners = () => {
        // Add book button
        const addBookBtn = document.getElementById('add-book-btn');
        if (addBookBtn) {
            addBookBtn.addEventListener('click', showAddBookModal);
        }
        
        // Close book modal
        const closeBookModal = document.getElementById('close-book-modal');
        if (closeBookModal) {
            closeBookModal.addEventListener('click', hideAddBookModal);
        }
        
        // Cancel add book
        const cancelAddBook = document.getElementById('cancel-add-book');
        if (cancelAddBook) {
            cancelAddBook.addEventListener('click', hideAddBookModal);
        }
        
        // Add book form
        const addBookForm = document.getElementById('add-book-form');
        if (addBookForm) {
            addBookForm.addEventListener('submit', handleAddBook);
        }
        
        // Rating stars
        setupRatingStars();
        
        // Book search
        const bookSearch = document.getElementById('book-search');
        if (bookSearch) {
            bookSearch.addEventListener('input', handleBookSearch);
        }
        
        // Table sorting
        setupTableSorting();
        
        // View toggle buttons
        setupViewToggle();
    };
    
    // Setup rating stars
    const setupRatingStars = () => {
        const ratingStars = document.querySelectorAll('.rating-input i');
        if (ratingStars.length) {
            ratingStars.forEach(star => {
                star.addEventListener('click', () => {
                    const rating = parseInt(star.getAttribute('data-rating'));
                    document.getElementById('book-rating').value = rating;
                    
                    // Update star visuals
                    ratingStars.forEach(s => {
                        const starRating = parseInt(s.getAttribute('data-rating'));
                        if (starRating <= rating) {
                            s.className = 'fas fa-star';
                        } else {
                            s.className = 'far fa-star';
                        }
                    });
                });
                
                // Add hover effects
                star.addEventListener('mouseenter', () => {
                    const hoverRating = parseInt(star.getAttribute('data-rating'));
                    
                    ratingStars.forEach(s => {
                        const starRating = parseInt(s.getAttribute('data-rating'));
                        if (starRating <= hoverRating) {
                            s.className = 'fas fa-star';
                        } else {
                            s.className = 'far fa-star';
                        }
                    });
                });
                
                // Remove hover effects if not the selected rating
                star.addEventListener('mouseleave', () => {
                    const currentRating = parseInt(document.getElementById('book-rating').value) || 0;
                    
                    ratingStars.forEach(s => {
                        const starRating = parseInt(s.getAttribute('data-rating'));
                        if (starRating <= currentRating) {
                            s.className = 'fas fa-star';
                        } else {
                            s.className = 'far fa-star';
                        }
                    });
                });
            });
        }
    };
    
    // Setup table sorting
    const setupTableSorting = () => {
        const sortableHeaders = document.querySelectorAll('.sortable');
        if (sortableHeaders.length) {
            sortableHeaders.forEach(header => {
                header.addEventListener('click', () => {
                    const sortBy = header.getAttribute('data-sort');
                    
                    // Update sort direction
                    if (currentSort.field === sortBy) {
                        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
                    } else {
                        currentSort.field = sortBy;
                        currentSort.direction = 'asc';
                    }
                    
                    // Update header appearance
                    sortableHeaders.forEach(h => {
                        h.classList.remove('sort-asc', 'sort-desc');
                    });
                    
                    header.classList.add(`sort-${currentSort.direction}`);
                    
                    // Re-render with new sort
                    renderReadingLog();
                });
            });
        }
    };
    
    // Setup view toggle (table/grid)
    const setupViewToggle = () => {
        const viewButtons = document.querySelectorAll('.table-view-controls button');
        if (viewButtons.length) {
            viewButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Remove active class from all buttons
                    viewButtons.forEach(btn => btn.classList.remove('active'));
                    
                    // Add active class to clicked button
                    button.classList.add('active');
                    
                    // Get view type
                    const viewType = button.getAttribute('data-view');
                    
                    // Switch views (in a full implementation)
                    // Here we just log since we're only implementing the table view
                    console.log(`Switching to ${viewType} view`);
                });
            });
        }
    };
    
    // Show add book modal
    const showAddBookModal = () => {
        const modal = document.getElementById('add-book-modal');
        if (modal) {
            modal.style.display = 'block';
            
            // Reset form
            document.getElementById('add-book-form').reset();
            document.getElementById('book-rating').value = 0;
            
            // Reset rating stars
            const ratingStars = document.querySelectorAll('.rating-input i');
            ratingStars.forEach(s => {
                s.className = 'far fa-star';
            });
        }
    };
    
    // Hide add book modal
    const hideAddBookModal = () => {
        const modal = document.getElementById('add-book-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    };
    
    // Handle add book form submission
    const handleAddBook = (e) => {
        e.preventDefault();
        
        // Get form data
        const newBook = {
            id: 'book-' + Date.now(),
            title: document.getElementById('book-title').value,
            author: document.getElementById('book-author').value,
            category: document.getElementById('book-category').value,
            progress: document.getElementById('book-progress').value,
            rating: parseInt(document.getElementById('book-rating').value) || 0,
            date: new Date().toISOString().split('T')[0],
            notes: document.getElementById('book-notes').value
        };
        
        // Add to books array
        books.push(newBook);
        
        // Save to localStorage
        saveBooks();
        
        // Re-render book list
        renderReadingLog();
        updateReadingStats();
        
        // Hide modal
        hideAddBookModal();
    };
    
    // Handle book search
    const handleBookSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        // Filter books based on search term
        const filteredBooks = books.filter(book => {
            return (
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm) ||
                book.category.toLowerCase().includes(searchTerm)
            );
        });
        
        // Render filtered books
        renderReadingLog(filteredBooks);
    };
    
    // Sort books
    const sortBooks = (booksToSort) => {
        return [...booksToSort].sort((a, b) => {
            let valueA, valueB;
            
            // Handle special cases
            if (currentSort.field === 'rating') {
                valueA = a.rating;
                valueB = b.rating;
            } else if (currentSort.field === 'date') {
                valueA = new Date(a.date);
                valueB = new Date(b.date);
            } else {
                valueA = String(a[currentSort.field]).toLowerCase();
                valueB = String(b[currentSort.field]).toLowerCase();
            }
            
            // Compare values
            if (valueA < valueB) {
                return currentSort.direction === 'asc' ? -1 : 1;
            }
            if (valueA > valueB) {
                return currentSort.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };
    
    // Render the reading log table
    const renderReadingLog = (filteredBooks = null) => {
        const tableBody = document.getElementById('reading-log-body');
        if (!tableBody) return;
        
        // Use filtered books if provided, otherwise use all books
        const booksToRender = filteredBooks || books;
        
        // Sort books
        const sortedBooks = sortBooks(booksToRender);
        
        // Clear table body
        tableBody.innerHTML = '';
        
        // Add each book as a row
        sortedBooks.forEach(book => {
            const row = document.createElement('tr');
            
            // Generate star rating HTML
            let ratingHTML = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= book.rating) {
                    ratingHTML += '<i class="fas fa-star"></i>';
                } else {
                    ratingHTML += '<i class="far fa-star"></i>';
                }
            }
            
            // Determine progress style
            const progressClass = book.progress.toLowerCase().replace(' ', '-');
            
            row.innerHTML = `
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.category}</td>
                <td>
                    <span class="status-badge ${progressClass}">
                        ${book.progress}
                    </span>
                </td>
                <td><div class="rating-stars">${ratingHTML}</div></td>
                <td>${formatDate(book.date)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm edit-book" data-id="${book.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm delete-book" data-id="${book.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        addBookActionListeners();
    };
    
    // Add event listeners to book action buttons
    const addBookActionListeners = () => {
        // Edit buttons
        const editButtons = document.querySelectorAll('.edit-book');
        editButtons.forEach(button => {
            button.addEventListener('click', () => {
                const bookId = button.getAttribute('data-id');
                editBook(bookId);
            });
        });
        
        // Delete buttons
        const deleteButtons = document.querySelectorAll('.delete-book');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const bookId = button.getAttribute('data-id');
                deleteBook(bookId);
            });
        });
    };
    
    // Edit a book
    const editBook = (bookId) => {
        // Find the book
        const book = books.find(b => b.id === bookId);
        if (!book) return;
        
        // In a full implementation, we would show an edit modal
        // For this demo, we'll just log
        console.log('Editing book:', book);
        alert('Edit book functionality would be implemented in a full application.');
    };
    
    // Delete a book
    const deleteBook = (bookId) => {
        // Confirm deletion
        if (!confirm('Are you sure you want to delete this book?')) return;
        
        // Remove the book
        books = books.filter(book => book.id !== bookId);
        
        // Save changes
        saveBooks();
        
        // Update UI
        renderReadingLog();
        updateReadingStats();
    };
    
    // Update reading statistics
    const updateReadingStats = () => {
        // Total books
        document.getElementById('total-books').textContent = books.length;
        
        // Completed books
        const completedBooks = books.filter(book => book.progress === 'Completed').length;
        document.getElementById('completed-books').textContent = completedBooks;
        
        // In progress books
        const inProgressBooks = books.filter(book => book.progress === 'In Progress').length;
        document.getElementById('in-progress-books').textContent = inProgressBooks;
        
        // Average rating
        const ratedBooks = books.filter(book => book.rating > 0);
        let avgRating = 0;
        if (ratedBooks.length > 0) {
            avgRating = ratedBooks.reduce((sum, book) => sum + book.rating, 0) / ratedBooks.length;
        }
        document.getElementById('avg-rating').textContent = avgRating.toFixed(1);
    };
    
    // Save books to localStorage
    const saveBooks = () => {
        localStorage.setItem('reading-log', JSON.stringify(books));
    };
    
    // Format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    
    // Public API
    return {
        init
    };
})();

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    ReadingLog.init();
}); 