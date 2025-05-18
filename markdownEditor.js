/**
 * LearnSync Hub - Markdown Editor Module
 * Features:
 * - Real-time markdown preview
 * - Basic markdown formatting tools
 * - Note organization and management
 */

const MarkdownEditor = (() => {
    // State
    let notes = [];
    let currentNoteId = null;
    
    // DOM elements
    let markdownInput;
    let markdownPreview;
    let notesList;
    
    // Initialize the editor
    const init = () => {
        // Get DOM elements
        markdownInput = document.getElementById('markdown-input');
        markdownPreview = document.getElementById('markdown-preview');
        notesList = document.getElementById('notes-list');
        
        // Check for saved notes or use sample data
        loadNotes();
        
        // Setup event listeners
        setupEventListeners();
        
        // Render notes list
        renderNotesList();
        
        // Select the first note by default
        if (notes.length > 0) {
            selectNote(notes[0].id);
        }
    };
    
    // Load notes from localStorage
    const loadNotes = () => {
        // Sample notes to use if no saved notes exist
        const sampleNotes = [
            {
                id: 'note-1',
                title: 'Neural Networks',
                content: '# Neural Networks\n\nA neural network is a series of algorithms that endeavors to recognize relationships in a data set through a process that mimics the way the human brain operates.\n\n## Types of Neural Networks\n\n- Convolutional Neural Networks (CNN)\n- Recurrent Neural Networks (RNN)\n- Long Short-Term Memory Networks (LSTM)\n\n```python\nimport tensorflow as tf\nmodel = tf.keras.Sequential([\n    tf.keras.layers.Dense(128, activation="relu"),\n    tf.keras.layers.Dense(10, activation="softmax")\n])\n```',
                created: new Date('2023-05-15').toISOString(),
                updated: new Date('2023-05-15').toISOString()
            },
            {
                id: 'note-2',
                title: 'Learning Techniques',
                content: '# Effective Learning Techniques\n\n## Spaced Repetition\nSpaced repetition is an evidence-based learning technique that incorporates increasing intervals of time between subsequent review of previously learned material.\n\n## Active Recall\nActive recall is a principle of efficient learning, which suggests that retrieving information improves and strengthens memory.\n\n## The Pomodoro Technique\n1. Decide on the task to be done\n2. Set the timer for 25 minutes\n3. Work on the task until the timer rings\n4. Take a short break (5 minutes)\n5. After four pomodoros, take a longer break (15-30 minutes)',
                created: new Date('2023-06-01').toISOString(),
                updated: new Date('2023-06-01').toISOString()
            }
        ];
        
        // Try to load from localStorage first
        const savedNotes = localStorage.getItem('markdown-notes');
        notes = savedNotes ? JSON.parse(savedNotes) : sampleNotes;
    };
    
    // Set up all event listeners
    const setupEventListeners = () => {
        // New note button
        const newNoteBtn = document.getElementById('new-note');
        if (newNoteBtn) {
            newNoteBtn.addEventListener('click', createNewNote);
        }
        
        // Save note button
        const saveNoteBtn = document.getElementById('save-note');
        if (saveNoteBtn) {
            saveNoteBtn.addEventListener('click', saveCurrentNote);
        }
        
        // Live markdown preview
        if (markdownInput) {
            markdownInput.addEventListener('input', updatePreview);
        }
        
        // Markdown toolbar buttons
        const toolbarButtons = document.querySelectorAll('.editor-toolbar button');
        toolbarButtons.forEach(button => {
            button.addEventListener('click', () => {
                const command = button.getAttribute('data-command');
                insertMarkdownSyntax(command);
            });
        });
        
        // Search notes
        const searchInput = document.querySelector('.search-notes input');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                const searchTerm = searchInput.value.toLowerCase();
                filterNotes(searchTerm);
            });
        }
    };
    
    // Render the list of notes
    const renderNotesList = () => {
        if (!notesList) return;
        
        notesList.innerHTML = '';
        
        notes.forEach(note => {
            const noteItem = document.createElement('div');
            noteItem.className = 'note-item';
            noteItem.dataset.noteId = note.id;
            
            if (note.id === currentNoteId) {
                noteItem.classList.add('active');
            }
            
            // Extract a short excerpt from the content
            let excerpt = note.content
                .replace(/#+\s|_|\*\*|\*|`|#/g, '')  // Remove markdown syntax
                .substring(0, 60);                    // Get first 60 chars
                
            if (excerpt.length === 60) excerpt += '...';
            
            noteItem.innerHTML = `
                <div class="note-title">${note.title}</div>
                <div class="note-excerpt">${excerpt}</div>
            `;
            
            noteItem.addEventListener('click', () => {
                selectNote(note.id);
            });
            
            notesList.appendChild(noteItem);
        });
        
        // Save to localStorage
        localStorage.setItem('markdown-notes', JSON.stringify(notes));
    };
    
    // Filter notes based on search term
    const filterNotes = (searchTerm) => {
        if (!notesList) return;
        
        const noteItems = notesList.querySelectorAll('.note-item');
        
        noteItems.forEach(item => {
            const title = item.querySelector('.note-title').textContent.toLowerCase();
            const excerpt = item.querySelector('.note-excerpt').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    };
    
    // Select a note to edit
    const selectNote = (noteId) => {
        if (!markdownInput || !markdownPreview) return;
        
        currentNoteId = noteId;
        const note = notes.find(note => note.id === noteId);
        
        if (!note) return;
        
        // Update active state in sidebar
        const noteItems = document.querySelectorAll('.note-item');
        noteItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.noteId === noteId) {
                item.classList.add('active');
            }
        });
        
        // Update editor with note content
        markdownInput.value = note.content;
        
        // Update preview
        updatePreview();
    };
    
    // Create a new note
    const createNewNote = () => {
        const newNote = {
            id: 'note-' + Date.now(),
            title: 'Untitled Note',
            content: '# Untitled Note\n\nStart writing here...',
            created: new Date().toISOString(),
            updated: new Date().toISOString()
        };
        
        // Add to beginning of notes array
        notes.unshift(newNote);
        
        // Update UI
        renderNotesList();
        selectNote(newNote.id);
    };
    
    // Save the current note
    const saveCurrentNote = () => {
        if (!currentNoteId || !markdownInput) return;
        
        const content = markdownInput.value;
        const noteIndex = notes.findIndex(note => note.id === currentNoteId);
        
        if (noteIndex !== -1) {
            // Extract title from first heading
            let title = 'Untitled Note';
            const firstLineMatch = content.match(/^# (.+)$/m);
            
            if (firstLineMatch && firstLineMatch[1]) {
                title = firstLineMatch[1].trim();
            }
            
            // Update note data
            notes[noteIndex].title = title;
            notes[noteIndex].content = content;
            notes[noteIndex].updated = new Date().toISOString();
            
            // Update UI
            renderNotesList();
            
            // Show save confirmation
            showSaveConfirmation();
        }
    };
    
    // Update the markdown preview
    const updatePreview = () => {
        if (!markdownInput || !markdownPreview) return;
        
        const content = markdownInput.value;
        
        // Use marked.js library for rendering if available
        if (window.marked && window.DOMPurify) {
            // Use DOMPurify to sanitize the HTML for security
            markdownPreview.innerHTML = DOMPurify.sanitize(marked.parse(content));
        } else {
            // Fallback if libraries aren't loaded
            markdownPreview.textContent = content;
        }
    };
    
    // Insert markdown syntax based on toolbar button
    const insertMarkdownSyntax = (command) => {
        if (!markdownInput) return;
        
        const start = markdownInput.selectionStart;
        const end = markdownInput.selectionEnd;
        const text = markdownInput.value;
        const selection = text.substring(start, end);
        
        let insertion = '';
        let cursorOffset = 0; // Where to place cursor after insertion
        
        switch (command) {
            case 'bold':
                insertion = `**${selection || 'bold text'}**`;
                if (!selection) cursorOffset = -2;
                break;
                
            case 'italic':
                insertion = `*${selection || 'italic text'}*`;
                if (!selection) cursorOffset = -1;
                break;
                
            case 'heading':
                insertion = `### ${selection || 'Heading'}`;
                if (!selection) cursorOffset = 0;
                break;
                
            case 'list-ul':
                insertion = `\n- ${selection || 'List item'}\n- \n- `;
                if (!selection) cursorOffset = -4;
                break;
                
            case 'list-ol':
                insertion = `\n1. ${selection || 'List item'}\n2. \n3. `;
                if (!selection) cursorOffset = -6;
                break;
                
            case 'link':
                insertion = `[${selection || 'link text'}](https://example.com)`;
                if (!selection) cursorOffset = -1;
                break;
                
            case 'image':
                insertion = `![${selection || 'alt text'}](https://example.com/image.jpg)`;
                if (!selection) cursorOffset = -1;
                break;
                
            case 'code':
                // Check if selection has multiple lines
                if (selection.includes('\n')) {
                    insertion = `\`\`\`\n${selection || 'code block'}\n\`\`\``;
                } else {
                    insertion = `\`${selection || 'code'}\``;
                    if (!selection) cursorOffset = -1;
                }
                break;
        }
        
        // Insert the text
        const newText = text.substring(0, start) + insertion + text.substring(end);
        markdownInput.value = newText;
        
        // Set cursor position
        const newPosition = start + insertion.length + cursorOffset;
        markdownInput.setSelectionRange(newPosition, newPosition);
        
        // Focus back on the textarea
        markdownInput.focus();
        
        // Update the preview
        updatePreview();
    };
    
    // Show a brief save confirmation
    const showSaveConfirmation = () => {
        const saveButton = document.getElementById('save-note');
        if (!saveButton) return;
        
        const originalText = saveButton.textContent;
        saveButton.textContent = 'Saved!';
        saveButton.classList.add('saved');
        
        // Reset button after 1.5 seconds
        setTimeout(() => {
            saveButton.textContent = originalText;
            saveButton.classList.remove('saved');
        }, 1500);
    };
    
    // Public API
    return {
        init
    };
})();

// Initialize the editor when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    MarkdownEditor.init();
}); 