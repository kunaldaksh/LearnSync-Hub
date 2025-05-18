/**
 * LearnSync Hub - Main Application Script
 * Implements a multi-tab interface for educational tools 
 * Linear.app inspired UI
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize tabs and navigation
    initializeTabs();
    
    // Initialize reading log
    initializeReadingLog();
    
    // Initialize markdown editor
    initializeMarkdownEditor();
    
    // Add animations to UI elements
    addUIAnimations();
});

/**
 * Tab System Management
 */
function initializeTabs() {
    // Get all navigation items
    const navItems = document.querySelectorAll('.nav-item');
    
    // Add click event listeners to each nav item
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Get the target tab
            const targetTab = item.getAttribute('data-tab');
            
            // Switch active tab
            switchTab(targetTab);
        });
    });
}

/**
 * Switch to the selected tab
 */
function switchTab(tabId) {
    // Get all tabs and nav items
    const tabs = document.querySelectorAll('.content-tab');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Remove active class from all tabs and nav items
    tabs.forEach(tab => tab.classList.remove('active'));
    navItems.forEach(item => item.classList.remove('active'));
    
    // Add active class to selected tab and nav item
    const targetTab = document.getElementById(`${tabId}-tab`);
    targetTab.classList.add('active');
    document.querySelector(`.nav-item[data-tab="${tabId}"]`).classList.add('active');
    
    // Add animation class to the tab content
    targetTab.classList.add('fade-in');
    // Remove animation class after animation is complete
    setTimeout(() => {
        targetTab.classList.remove('fade-in');
    }, 500);
}

/**
 * Add animations and interactive effects to UI elements
 */
function addUIAnimations() {
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    });
    
    // Add ripple effect to cards
    const cards = document.querySelectorAll('.deck-card, .course-card, .habit-item');
    cards.forEach(card => {
        card.addEventListener('click', createRippleEffect);
    });
    
    // Add subtle hover effects to table rows
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.backgroundColor = 'var(--surface-hover)';
            row.style.transition = 'background-color 0.2s ease';
        });
        
        row.addEventListener('mouseleave', () => {
            row.style.backgroundColor = '';
        });
    });
    
    // Add animation to sidebar items
    animateSidebarItems();
}

/**
 * Creates a ripple effect on clicked elements
 */
function createRippleEffect(event) {
    const element = this;
    
    // Create a ripple element
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');
    
    // Position the ripple where clicked
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    // Add ripple to element
    element.appendChild(ripple);
    
    // Remove after animation completes
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

/**
 * Animate sidebar items on page load
 */
function animateSidebarItems() {
    const sidebarItems = document.querySelectorAll('.nav-item');
    
    sidebarItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-10px)';
        
        setTimeout(() => {
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 100 + (index * 50)); // Staggered animation
    });
}

/**
 * Reading Log Management
 */
function initializeReadingLog() {
    // Sample reading log data
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
    
    // Check for existing data in localStorage
    let books = JSON.parse(localStorage.getItem('reading-log')) || sampleBooks;
    
    // Render the book list
    renderReadingLog(books);
    updateReadingStats(books);
    
    // Setup event listeners
    
    // Add book button
    const addBookBtn = document.getElementById('add-book-btn');
    if (addBookBtn) {
        addBookBtn.addEventListener('click', () => {
            const modal = document.getElementById('add-book-modal');
            if (modal) {
                modal.style.display = 'block';
                // Add animation class
                modal.querySelector('.modal-content').classList.add('bounce');
                // Remove animation class after animation completes
                setTimeout(() => {
                    modal.querySelector('.modal-content').classList.remove('bounce');
                }, 500);
            }
        });
    }
    
    // Close book modal
    const closeBookModal = document.getElementById('close-book-modal');
    if (closeBookModal) {
        closeBookModal.addEventListener('click', () => {
            const modal = document.getElementById('add-book-modal');
            if (modal) modal.style.display = 'none';
        });
    }
    
    // Cancel add book
    const cancelAddBook = document.getElementById('cancel-add-book');
    if (cancelAddBook) {
        cancelAddBook.addEventListener('click', () => {
            const modal = document.getElementById('add-book-modal');
            if (modal) modal.style.display = 'none';
        });
    }
    
    // Rating stars
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
        });
    }
    
    // Add book form
    const addBookForm = document.getElementById('add-book-form');
    if (addBookForm) {
        addBookForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const newBook = {
                id: 'book-' + Date.now(),
                title: document.getElementById('book-title').value,
                author: document.getElementById('book-author').value,
                category: document.getElementById('book-category').value,
                progress: document.getElementById('book-progress').value,
                rating: parseInt(document.getElementById('book-rating').value),
                date: new Date().toISOString().split('T')[0],
                notes: document.getElementById('book-notes').value
            };
            
            // Add to books array
            books.push(newBook);
            
            // Save to localStorage
            localStorage.setItem('reading-log', JSON.stringify(books));
            
            // Re-render book list
            renderReadingLog(books);
            updateReadingStats(books);
            
            // Close modal and reset form
            document.getElementById('add-book-modal').style.display = 'none';
            addBookForm.reset();
            
            // Reset rating stars
            ratingStars.forEach(s => {
                s.className = 'far fa-star';
            });
            
            // Show success toast notification
            showToast('Book added successfully!', 'success');
        });
    }
    
    // Book search functionality
    const bookSearch = document.getElementById('book-search');
    if (bookSearch) {
        bookSearch.addEventListener('input', () => {
            const searchTerm = bookSearch.value.toLowerCase();
            const filteredBooks = books.filter(book => {
                return (
                    book.title.toLowerCase().includes(searchTerm) ||
                    book.author.toLowerCase().includes(searchTerm) ||
                    book.category.toLowerCase().includes(searchTerm)
                );
            });
            renderReadingLog(filteredBooks);
        });
    }
    
    // Table sort functionality
    const sortableHeaders = document.querySelectorAll('.sortable');
    if (sortableHeaders.length) {
        sortableHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const sortBy = header.getAttribute('data-sort');
                let sortDirection = 'asc';
                
                // Toggle sort direction
                if (header.classList.contains('sort-asc')) {
                    sortDirection = 'desc';
                    header.classList.remove('sort-asc');
                    header.classList.add('sort-desc');
                } else if (header.classList.contains('sort-desc')) {
                    sortDirection = 'asc';
                    header.classList.remove('sort-desc');
                    header.classList.add('sort-asc');
                } else {
                    // Remove all sort classes first
                    sortableHeaders.forEach(h => {
                        h.classList.remove('sort-asc', 'sort-desc');
                    });
                    // Add sort class
                    header.classList.add('sort-asc');
                }
                
                // Sort books
                const sortedBooks = sortBooks(books, sortBy, sortDirection);
                renderReadingLog(sortedBooks);
                
                // Add subtle animation to table body
                const tableBody = document.getElementById('reading-log-body');
                if (tableBody) {
                    tableBody.classList.add('fade-in');
                    setTimeout(() => {
                        tableBody.classList.remove('fade-in');
                    }, 500);
                }
            });
        });
    }
}

/**
 * Render the reading log table
 */
function renderReadingLog(books) {
    const tableBody = document.getElementById('reading-log-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    books.forEach((book, index) => {
        const row = document.createElement('tr');
        
        // Add animation delay for staggered effect
        row.style.opacity = '0';
        row.style.transform = 'translateY(10px)';
        
        // Generate star rating HTML
        let ratingHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= book.rating) {
                ratingHTML += '<i class="fas fa-star"></i>';
            } else {
                ratingHTML += '<i class="far fa-star"></i>';
            }
        }
        
        // Add status badge class based on progress
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
        
        // Trigger animation with staggered delay
        setTimeout(() => {
            row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, 50 * index);
    });
    
    // Add event listeners for edit and delete buttons
    addBookActionListeners();
    
    // If no books found, show a message
    if (books.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="7" class="empty-state">
                <div class="empty-message">
                    <i class="fas fa-book-open"></i>
                    <p>No books found. Add some books to your reading log!</p>
                </div>
            </td>
        `;
        tableBody.appendChild(emptyRow);
    }
}

/**
 * Update reading log statistics
 */
function updateReadingStats(books) {
    // Get all stat elements
    const totalBooksEl = document.getElementById('total-books');
    const completedBooksEl = document.getElementById('completed-books');
    const inProgressBooksEl = document.getElementById('in-progress-books');
    const avgRatingEl = document.getElementById('avg-rating');
    
    // Animate the stats change
    if (totalBooksEl) animateCounterValue(totalBooksEl, books.length);
    
    const completedBooks = books.filter(book => book.progress === 'Completed').length;
    if (completedBooksEl) animateCounterValue(completedBooksEl, completedBooks);
    
    const inProgressBooks = books.filter(book => book.progress === 'In Progress').length;
    if (inProgressBooksEl) animateCounterValue(inProgressBooksEl, inProgressBooks);
    
    // Calculate average rating
    const ratedBooks = books.filter(book => book.rating > 0);
    let avgRating = 0;
    if (ratedBooks.length > 0) {
        avgRating = ratedBooks.reduce((sum, book) => sum + book.rating, 0) / ratedBooks.length;
    }
    if (avgRatingEl) animateCounterValue(avgRatingEl, avgRating, 1);
}

/**
 * Animate a counter from its current value to a target value
 */
function animateCounterValue(element, targetValue, decimals = 0) {
    const startValue = parseFloat(element.textContent) || 0;
    const duration = 500; // Animation duration in milliseconds
    const startTime = performance.now();
    
    function updateValue(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Use easeOutQuad for smooth animation
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const currentValue = startValue + (targetValue - startValue) * easeProgress;
        
        element.textContent = currentValue.toFixed(decimals);
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        } else {
            element.textContent = targetValue.toFixed(decimals);
        }
    }
    
    requestAnimationFrame(updateValue);
}

/**
 * Add event listeners to book action buttons
 */
function addBookActionListeners() {
    // Edit buttons
    const editButtons = document.querySelectorAll('.edit-book');
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const bookId = button.getAttribute('data-id');
            // Edit functionality would be implemented here
            console.log('Edit book', bookId);
        });
    });
    
    // Delete buttons
    const deleteButtons = document.querySelectorAll('.delete-book');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const bookId = button.getAttribute('data-id');
            
            // Add confirmation dialog with animation
            if (confirm('Are you sure you want to delete this book?')) {
                const books = JSON.parse(localStorage.getItem('reading-log')) || [];
                const updatedBooks = books.filter(book => book.id !== bookId);
                localStorage.setItem('reading-log', JSON.stringify(updatedBooks));
                
                // Find the row to animate before removal
                const row = button.closest('tr');
                if (row) {
                    row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    row.style.opacity = '0';
                    row.style.transform = 'translateY(10px)';
                    
                    // Wait for animation to complete before removing
                    setTimeout(() => {
                        renderReadingLog(updatedBooks);
                        updateReadingStats(updatedBooks);
                        showToast('Book deleted successfully', 'info');
                    }, 300);
                } else {
                    renderReadingLog(updatedBooks);
                    updateReadingStats(updatedBooks);
                }
            }
        });
    });
}

/**
 * Sort books by the specified property
 */
function sortBooks(books, sortBy, direction) {
    return [...books].sort((a, b) => {
        let valueA, valueB;
        
        // Handle special cases
        if (sortBy === 'rating') {
            valueA = a.rating;
            valueB = b.rating;
        } else if (sortBy === 'date') {
            valueA = new Date(a.date);
            valueB = new Date(b.date);
        } else {
            valueA = a[sortBy].toLowerCase();
            valueB = b[sortBy].toLowerCase();
        }
        
        if (valueA < valueB) {
            return direction === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
            return direction === 'asc' ? 1 : -1;
        }
        return 0;
    });
}

/**
 * Format date to a more readable form
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

/**
 * Show a toast notification
 */
function showToast(message, type = 'info') {
    // Check if toast container exists, if not create it
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Add appropriate icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    
    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        toast.style.opacity = '0';
        
        // Remove from DOM after animation
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

/**
 * Markdown Editor Management
 */
function initializeMarkdownEditor() {
    // Sample notes
    const sampleNotes = [
        {
            id: 'note-1',
            title: 'Neural Networks',
            content: '# Neural Networks\n\nA neural network is a series of algorithms that endeavors to recognize relationships in a data set through a process that mimics the way the human brain operates.\n\n## Types of Neural Networks\n\n- Convolutional Neural Networks (CNN)\n- Recurrent Neural Networks (RNN)\n- Long Short-Term Memory Networks (LSTM)\n\n```python\nimport tensorflow as tf\nmodel = tf.keras.Sequential([\n    tf.keras.layers.Dense(128, activation="relu"),\n    tf.keras.layers.Dense(10, activation="softmax")\n])\n```',
            created: '2023-05-15T14:23:00Z',
            updated: '2023-05-15T14:23:00Z'
        },
        {
            id: 'note-2',
            title: 'Learning Techniques',
            content: '# Effective Learning Techniques\n\n## Spaced Repetition\nSpaced repetition is an evidence-based learning technique that incorporates increasing intervals of time between subsequent review of previously learned material.\n\n## Active Recall\nActive recall is a principle of efficient learning, which suggests that retrieving information improves and strengthens memory.\n\n## The Pomodoro Technique\n1. Decide on the task to be done\n2. Set the timer for 25 minutes\n3. Work on the task until the timer rings\n4. Take a short break (5 minutes)\n5. After four pomodoros, take a longer break (15-30 minutes)',
            created: '2023-06-01T10:15:00Z',
            updated: '2023-06-01T10:15:00Z'
        }
    ];
    
    // Check for existing notes in localStorage
    let notes = JSON.parse(localStorage.getItem('markdown-notes')) || sampleNotes;
    
    // DOM elements
    const markdownInput = document.getElementById('markdown-input');
    const markdownPreview = document.getElementById('markdown-preview');
    const notesList = document.getElementById('notes-list');
    const newNoteBtn = document.getElementById('new-note');
    const saveNoteBtn = document.getElementById('save-note');
    
    // Current note being edited
    let currentNoteId = null;
    
    // Render notes list
    renderNotesList(notes);
    
    // Select first note by default
    if (notes.length > 0 && markdownInput && markdownPreview) {
        selectNote(notes[0].id);
    }
    
    // New note button
    if (newNoteBtn) {
        newNoteBtn.addEventListener('click', () => {
            const newNote = {
                id: 'note-' + Date.now(),
                title: 'Untitled Note',
                content: '# Untitled Note\n\nStart writing here...',
                created: new Date().toISOString(),
                updated: new Date().toISOString()
            };
            
            notes.unshift(newNote);
            renderNotesList(notes);
            selectNote(newNote.id);
            
            // Show success message
            showToast('New note created!', 'success');
        });
    }
    
    // Save note button
    if (saveNoteBtn && markdownInput) {
        saveNoteBtn.addEventListener('click', () => {
            if (!currentNoteId) return;
            
            const content = markdownInput.value;
            const noteIndex = notes.findIndex(note => note.id === currentNoteId);
            
            if (noteIndex !== -1) {
                // Extract title from first line (assuming it's a heading)
                let title = 'Untitled Note';
                const firstLine = content.split('\n')[0];
                if (firstLine.startsWith('# ')) {
                    title = firstLine.substring(2).trim();
                }
                
                notes[noteIndex].title = title;
                notes[noteIndex].content = content;
                notes[noteIndex].updated = new Date().toISOString();
                
                localStorage.setItem('markdown-notes', JSON.stringify(notes));
                renderNotesList(notes);
                
                // Re-select the current note to update the active state
                selectNote(currentNoteId);
                
                // Show saved confirmation
                saveNoteBtn.textContent = 'Saved!';
                saveNoteBtn.classList.add('saved');
                
                setTimeout(() => {
                    saveNoteBtn.textContent = 'Save Note';
                    saveNoteBtn.classList.remove('saved');
                }, 1500);
            }
        });
    }
    
    // Live preview
    if (markdownInput && markdownPreview) {
        markdownInput.addEventListener('input', updateMarkdownPreview);
    }
    
    // Markdown toolbar buttons
    const toolbarButtons = document.querySelectorAll('.editor-toolbar button');
    toolbarButtons.forEach(button => {
        button.addEventListener('click', () => {
            const command = button.getAttribute('data-command');
            insertMarkdownSyntax(command);
        });
    });
    
    /**
     * Render the notes list in the sidebar
     */
    function renderNotesList(notes) {
        if (!notesList) return;
        
        notesList.innerHTML = '';
        
        notes.forEach((note, index) => {
            const noteItem = document.createElement('div');
            noteItem.className = 'note-item';
            noteItem.dataset.noteId = note.id;
            
            // Set initial state for animation
            noteItem.style.opacity = '0';
            noteItem.style.transform = 'translateX(-10px)';
            
            if (note.id === currentNoteId) {
                noteItem.classList.add('active');
            }
            
            // Extract a short excerpt from the content
            let excerpt = note.content.replace(/#+\s|_|\*\*|\*|`|#/g, '').substring(0, 60);
            if (excerpt.length === 60) excerpt += '...';
            
            noteItem.innerHTML = `
                <div class="note-title">${note.title}</div>
                <div class="note-excerpt">${excerpt}</div>
            `;
            
            noteItem.addEventListener('click', () => {
                selectNote(note.id);
            });
            
            notesList.appendChild(noteItem);
            
            // Animate in with staggered delay
            setTimeout(() => {
                noteItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                noteItem.style.opacity = '1';
                noteItem.style.transform = 'translateX(0)';
            }, 30 * index);
        });
        
        // Save to localStorage
        localStorage.setItem('markdown-notes', JSON.stringify(notes));
    }
    
    /**
     * Select a note to edit
     */
    function selectNote(noteId) {
        currentNoteId = noteId;
        
        const note = notes.find(note => note.id === noteId);
        if (!note || !markdownInput || !markdownPreview) return;
        
        // Update active state in the sidebar
        const noteItems = document.querySelectorAll('.note-item');
        noteItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.noteId === noteId) {
                item.classList.add('active');
            }
        });
        
        // Update editor with animation
        markdownInput.style.opacity = '0';
        setTimeout(() => {
            markdownInput.value = note.content;
            updateMarkdownPreview();
            markdownInput.style.transition = 'opacity 0.3s ease';
            markdownInput.style.opacity = '1';
        }, 100);
    }
    
    /**
     * Update the markdown preview
     */
    function updateMarkdownPreview() {
        if (!markdownInput || !markdownPreview) return;
        
        const content = markdownInput.value;
        
        // Use the marked library and DOMPurify for safe rendering
        if (window.marked && window.DOMPurify) {
            // Briefly add fade out/in effect
            markdownPreview.style.opacity = '0.7';
            
            setTimeout(() => {
                markdownPreview.innerHTML = DOMPurify.sanitize(marked.parse(content));
                markdownPreview.style.transition = 'opacity 0.3s ease';
                markdownPreview.style.opacity = '1';
            }, 50);
        } else {
            // Fallback if libraries are not loaded
            markdownPreview.innerHTML = `<pre>${content}</pre>`;
        }
    }
    
    /**
     * Insert markdown syntax based on the selected toolbar button
     */
    function insertMarkdownSyntax(command) {
        if (!markdownInput) return;
        
        const start = markdownInput.selectionStart;
        const end = markdownInput.selectionEnd;
        const text = markdownInput.value;
        const selection = text.substring(start, end);
        
        let insertion = '';
        
        switch (command) {
            case 'bold':
                insertion = `**${selection || 'bold text'}**`;
                break;
            case 'italic':
                insertion = `*${selection || 'italic text'}*`;
                break;
            case 'heading':
                insertion = `### ${selection || 'Heading'}`;
                break;
            case 'list-ul':
                insertion = `\n- ${selection || 'Item 1'}\n- Item 2\n- Item 3`;
                break;
            case 'list-ol':
                insertion = `\n1. ${selection || 'Item 1'}\n2. Item 2\n3. Item 3`;
                break;
            case 'link':
                insertion = `[${selection || 'link text'}](https://example.com)`;
                break;
            case 'image':
                insertion = `![${selection || 'alt text'}](https://example.com/image.jpg)`;
                break;
            case 'code':
                insertion = selection.includes('\n') 
                    ? `\`\`\`\n${selection || 'code block'}\n\`\`\``
                    : `\`${selection || 'inline code'}\``;
                break;
        }
        
        const newText = text.substring(0, start) + insertion + text.substring(end);
        markdownInput.value = newText;
        
        // Update preview
        updateMarkdownPreview();
        
        // Focus back on the textarea
        markdownInput.focus();
        
        // Calculate new cursor position
        const newPosition = start + insertion.length;
        markdownInput.setSelectionRange(newPosition, newPosition);
        
        // Add a flash effect to the inserted text
        const highlightInsertedText = () => {
            const textarea = markdownInput;
            const highlighter = document.createElement('div');
            highlighter.className = 'text-highlight';
            highlighter.style.position = 'absolute';
            highlighter.style.backgroundColor = 'rgba(94, 106, 210, 0.2)';
            highlighter.style.pointerEvents = 'none';
            
            // Position would require more complex calculations to be accurate
            // This is a simplified version just to show the concept
            document.body.appendChild(highlighter);
            
            setTimeout(() => {
                highlighter.remove();
            }, 500);
        };
        
        // Only implement this in a full version as it requires complex positioning logic
        // highlightInsertedText();
    }
} 