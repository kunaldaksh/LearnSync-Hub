/**
 * LearnSync Hub - Advanced Flashcard System
 * Features:
 * - Beautiful 3D flip animations
 * - Spaced repetition algorithm
 * - Know/Don't Know tracking
 * - Progress statistics
 * - Session history
 */

// Flashcard data structure and state management
const FlashcardSystem = (() => {
    // Flashcard decks data store
    let decks = [];
    let currentDeck = null;
    let currentCardIndex = 0;
    let studyStats = {
        known: 0,
        unknown: 0,
        total: 0,
        startTime: null,
        endTime: null
    };
    
    // Example deck data
    const sampleDecks = [
        {
            id: 'deck-1',
            title: 'Basic Neuroscience',
            description: 'Introduction to brain structures and functions',
            cards: [
                { id: 'card-1', question: 'What is a neuron?', answer: 'A specialized cell that transmits nerve impulses; the basic building block of the nervous system.', level: 1, nextReview: null, reviewCount: 0 },
                { id: 'card-2', question: 'What is the prefrontal cortex responsible for?', answer: 'Executive functions including planning, decision-making, and moderating social behavior.', level: 1, nextReview: null, reviewCount: 0 },
                { id: 'card-3', question: 'What is synaptic plasticity?', answer: 'The ability of synapses to strengthen or weaken over time in response to activity.', level: 1, nextReview: null, reviewCount: 0 },
                { id: 'card-4', question: 'What is the function of myelin?', answer: 'To insulate nerve fibers and increase the speed of nerve impulse transmission.', level: 1, nextReview: null, reviewCount: 0 },
                { id: 'card-5', question: 'What is the hippocampus responsible for?', answer: 'Formation of new memories and spatial navigation.', level: 1, nextReview: null, reviewCount: 0 }
            ],
            created: new Date('2023-05-15').toISOString(),
            lastStudied: null
        },
        {
            id: 'deck-2',
            title: 'Learning Theories',
            description: 'Major theories in educational psychology',
            cards: [
                { id: 'card-6', question: 'What is Constructivism?', answer: 'A theory that suggests learners construct knowledge from their experiences.', level: 1, nextReview: null, reviewCount: 0 },
                { id: 'card-7', question: 'Who developed the Social Learning Theory?', answer: 'Albert Bandura', level: 1, nextReview: null, reviewCount: 0 },
                { id: 'card-8', question: 'What is the Zone of Proximal Development?', answer: 'The difference between what a learner can do without help and what they can achieve with guidance.', level: 1, nextReview: null, reviewCount: 0 }
            ],
            created: new Date('2023-06-10').toISOString(),
            lastStudied: null
        }
    ];
    
    // Initialize the system
    const init = () => {
        // Load decks from localStorage or use sample data
        const savedDecks = localStorage.getItem('flashcard-decks');
        if (savedDecks) {
            decks = JSON.parse(savedDecks);
        } else {
            decks = sampleDecks;
            saveDecks();
        }
        
        renderDeckList();
    };
    
    // Save decks to localStorage
    const saveDecks = () => {
        localStorage.setItem('flashcard-decks', JSON.stringify(decks));
    };
    
    // Render the list of decks on the page
    const renderDeckList = () => {
        const deckList = document.getElementById('flashcard-deck-list');
        if (!deckList) return;
        
        deckList.innerHTML = '';
        
        decks.forEach(deck => {
            const deckCard = document.createElement('div');
            deckCard.className = 'deck-card';
            deckCard.innerHTML = `
                <div class="deck-info">
                    <h3>${deck.title}</h3>
                    <p>${deck.description}</p>
                    <div class="deck-stats">
                        <span><i class="fas fa-layer-group"></i> ${deck.cards.length} cards</span>
                        <span><i class="far fa-calendar-alt"></i> Created: ${new Date(deck.created).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="deck-actions">
                    <button class="btn btn-primary btn-small study-deck" data-deck-id="${deck.id}">Study</button>
                    <button class="btn btn-secondary btn-small edit-deck" data-deck-id="${deck.id}">Edit</button>
                </div>
            `;
            deckList.appendChild(deckCard);
            
            // Add event listeners
            deckCard.querySelector('.study-deck').addEventListener('click', () => startStudySession(deck.id));
            deckCard.querySelector('.edit-deck').addEventListener('click', () => editDeck(deck.id));
        });
        
        // Add a button to create a new deck
        const newDeckBtn = document.createElement('div');
        newDeckBtn.className = 'deck-card new-deck';
        newDeckBtn.innerHTML = `
            <div class="add-deck-content">
                <i class="fas fa-plus"></i>
                <p>Create New Deck</p>
            </div>
        `;
        newDeckBtn.addEventListener('click', createNewDeck);
        deckList.appendChild(newDeckBtn);
    };
    
    // Start a study session with a specific deck
    const startStudySession = (deckId) => {
        currentDeck = decks.find(deck => deck.id === deckId);
        if (!currentDeck) return;
        
        // Update last studied timestamp
        currentDeck.lastStudied = new Date().toISOString();
        
        // Reset stats
        studyStats = {
            known: 0,
            unknown: 0,
            total: currentDeck.cards.length,
            startTime: new Date(),
            endTime: null
        };
        
        // Shuffle cards for the session (Fisher-Yates algorithm)
        currentDeck.cards = shuffleArray([...currentDeck.cards]);
        currentCardIndex = 0;
        
        // Switch to study view
        showStudyInterface();
        
        // Save updated deck
        saveDecks();
    };
    
    // Show the study interface
    const showStudyInterface = () => {
        const flashcardContainer = document.getElementById('flashcard-container');
        const deckListContainer = document.getElementById('flashcard-deck-container');
        
        if (flashcardContainer && deckListContainer) {
            deckListContainer.style.display = 'none';
            flashcardContainer.style.display = 'block';
            
            // Initialize first card
            renderCurrentCard();
            
            // Update progress meter
            updateProgressMeter();
        }
    };
    
    // Render the current flashcard
    const renderCurrentCard = () => {
        const flashcardElement = document.getElementById('flashcard');
        const cardCountElement = document.getElementById('card-count');
        const cardProgressElement = document.getElementById('card-progress-bar');
        
        if (!flashcardElement || !currentDeck || currentCardIndex >= currentDeck.cards.length) {
            // End of deck, show summary
            showSessionSummary();
            return;
        }
        
        const card = currentDeck.cards[currentCardIndex];
        
        // Set card content
        const frontContent = document.getElementById('card-front-content');
        const backContent = document.getElementById('card-back-content');
        
        if (frontContent && backContent) {
            frontContent.innerHTML = card.question;
            backContent.innerHTML = card.answer;
        }
        
        // Reset card state (not flipped)
        flashcardElement.classList.remove('flipped');
        
        // Update card counter
        if (cardCountElement) {
            cardCountElement.textContent = `Card ${currentCardIndex + 1} of ${currentDeck.cards.length}`;
        }
        
        // Update progress bar
        if (cardProgressElement) {
            const progress = ((currentCardIndex) / currentDeck.cards.length) * 100;
            cardProgressElement.style.width = `${progress}%`;
        }
        
        // Hide response buttons until card is flipped
        const responseButtons = document.getElementById('flashcard-response-buttons');
        if (responseButtons) {
            responseButtons.style.display = 'none';
        }
    };
    
    // Flip the current card
    const flipCard = () => {
        const flashcard = document.getElementById('flashcard');
        const responseButtons = document.getElementById('flashcard-response-buttons');
        
        if (flashcard) {
            flashcard.classList.toggle('flipped');
            
            // Show response buttons when card is flipped to answer side
            if (responseButtons) {
                if (flashcard.classList.contains('flipped')) {
                    responseButtons.style.display = 'flex';
                } else {
                    responseButtons.style.display = 'none';
                }
            }
        }
    };
    
    // Handle user's response (known or unknown)
    const processResponse = (known) => {
        if (!currentDeck || currentCardIndex >= currentDeck.cards.length) return;
        
        const card = currentDeck.cards[currentCardIndex];
        
        // Update card's spaced repetition data
        if (known) {
            card.level = Math.min(5, card.level + 1);
            studyStats.known++;
        } else {
            card.level = 1;
            studyStats.unknown++;
        }
        
        // Calculate next review date based on spaced repetition level
        const reviewIntervals = [1, 3, 7, 14, 30]; // days until next review
        const daysToAdd = reviewIntervals[card.level - 1] || 1;
        
        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + daysToAdd);
        card.nextReview = nextReview.toISOString();
        card.reviewCount++;
        
        // Move to next card
        currentCardIndex++;
        renderCurrentCard();
        updateProgressMeter();
        
        // Save updates
        saveDecks();
    };
    
    // Update the progress meter
    const updateProgressMeter = () => {
        const knownCount = document.getElementById('known-count');
        const unknownCount = document.getElementById('unknown-count');
        
        if (knownCount) knownCount.textContent = studyStats.known;
        if (unknownCount) unknownCount.textContent = studyStats.unknown;
    };
    
    // Show study session summary
    const showSessionSummary = () => {
        const flashcardContainer = document.getElementById('flashcard-container');
        const summaryContainer = document.getElementById('session-summary');
        
        if (!flashcardContainer || !summaryContainer) return;
        
        // Update session stats
        studyStats.endTime = new Date();
        const sessionDuration = Math.round((studyStats.endTime - studyStats.startTime) / 1000);
        
        // Build summary content
        summaryContainer.innerHTML = `
            <div class="summary-header">
                <h2>Session Complete!</h2>
                <p>You've completed studying "${currentDeck.title}"</p>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${studyStats.known}</div>
                    <div class="stat-label">Cards Known</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${studyStats.unknown}</div>
                    <div class="stat-label">Cards to Review</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${formatTime(sessionDuration)}</div>
                    <div class="stat-label">Study Time</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${Math.round((studyStats.known / studyStats.total) * 100)}%</div>
                    <div class="stat-label">Success Rate</div>
                </div>
            </div>
            
            <div class="summary-actions">
                <button id="restart-session" class="btn btn-primary">Restart Session</button>
                <button id="return-to-decks" class="btn btn-secondary">Return to Decks</button>
            </div>
        `;
        
        // Add event listeners
        summaryContainer.querySelector('#restart-session').addEventListener('click', () => {
            startStudySession(currentDeck.id);
        });
        
        summaryContainer.querySelector('#return-to-decks').addEventListener('click', () => {
            showDeckList();
        });
        
        // Show summary
        flashcardContainer.style.display = 'none';
        summaryContainer.style.display = 'block';
    };
    
    // Show the deck list
    const showDeckList = () => {
        const flashcardContainer = document.getElementById('flashcard-container');
        const deckListContainer = document.getElementById('flashcard-deck-container');
        const summaryContainer = document.getElementById('session-summary');
        
        if (flashcardContainer) flashcardContainer.style.display = 'none';
        if (summaryContainer) summaryContainer.style.display = 'none';
        if (deckListContainer) deckListContainer.style.display = 'block';
    };
    
    // Create a new deck
    const createNewDeck = () => {
        const newDeck = {
            id: 'deck-' + Date.now(),
            title: 'New Deck',
            description: 'Click to edit description',
            cards: [],
            created: new Date().toISOString(),
            lastStudied: null
        };
        
        decks.push(newDeck);
        saveDecks();
        renderDeckList();
        editDeck(newDeck.id);
    };
    
    // Edit a deck
    const editDeck = (deckId) => {
        const deck = decks.find(d => d.id === deckId);
        if (!deck) return;
        
        // Show edit interface (would implement this fully in a real app)
        console.log('Editing deck:', deck);
        alert('Deck editing would be implemented here in a full application.');
    };
    
    // Utility function to shuffle an array (Fisher-Yates algorithm)
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };
    
    // Format seconds to MM:SS
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };
    
    // Public API
    return {
        init,
        flipCard,
        processResponse,
        showDeckList
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize flashcard system
    FlashcardSystem.init();
    
    // Add event listeners
    const flipButton = document.getElementById('flip-card');
    if (flipButton) {
        flipButton.addEventListener('click', FlashcardSystem.flipCard);
    }
    
    const knownButton = document.getElementById('known-button');
    if (knownButton) {
        knownButton.addEventListener('click', () => FlashcardSystem.processResponse(true));
    }
    
    const unknownButton = document.getElementById('unknown-button');
    if (unknownButton) {
        unknownButton.addEventListener('click', () => FlashcardSystem.processResponse(false));
    }
    
    const returnButton = document.getElementById('return-to-decks-button');
    if (returnButton) {
        returnButton.addEventListener('click', FlashcardSystem.showDeckList);
    }
}); 