/**
 * LearnSync Hub - Adaptive Quiz System
 * Features:
 * - Adaptive difficulty based on user performance
 * - Detailed results and analytics
 * - Question categories and tags
 * - Progress tracking
 * - Retry functionality
 */

const QuizSystem = (() => {
    // State variables
    let quizzes = [];
    let currentQuiz = null;
    let currentQuestionIndex = 0;
    let userAnswers = [];
    let timer = null;
    let timeSpent = 0;
    let difficultyLevel = 2; // 1: easy, 2: medium, 3: hard
    let currentCategory = '';
    
    // Sample quiz data
    const sampleQuizzes = [
        {
            id: 'quiz-1',
            title: 'Neural Networks Fundamentals',
            description: 'Test your knowledge of neural network basics and concepts',
            category: 'AI & Machine Learning',
            questions: [
                {
                    id: 'q1',
                    text: 'What is a perceptron?',
                    difficulty: 1,
                    options: [
                        { id: 'a', text: 'A type of activation function' },
                        { id: 'b', text: 'The simplest form of artificial neural network' },
                        { id: 'c', text: 'A dataset used for training neural networks' },
                        { id: 'd', text: 'A programming language for AI' }
                    ],
                    correctAnswer: 'b',
                    explanation: 'A perceptron is the simplest neural network, consisting of a single neuron with binary output.'
                },
                {
                    id: 'q2',
                    text: 'Which of the following is NOT an activation function?',
                    difficulty: 2,
                    options: [
                        { id: 'a', text: 'ReLU' },
                        { id: 'b', text: 'Sigmoid' },
                        { id: 'c', text: 'Tangent' },
                        { id: 'd', text: 'Gaussian' }
                    ],
                    correctAnswer: 'c',
                    explanation: 'Tangent is not an activation function. The hyperbolic tangent (tanh) is an activation function, but "Tangent" itself is not.'
                },
                {
                    id: 'q3',
                    text: 'What does backpropagation do in a neural network?',
                    difficulty: 2,
                    options: [
                        { id: 'a', text: 'Initializes weights randomly' },
                        { id: 'b', text: 'Processes input data in reverse order' },
                        { id: 'c', text: 'Calculates gradients to update weights during training' },
                        { id: 'd', text: 'Optimizes the network architecture' }
                    ],
                    correctAnswer: 'c',
                    explanation: 'Backpropagation is an algorithm that calculates gradients of the error with respect to weights, allowing the network to learn by updating weights.'
                },
                {
                    id: 'q4',
                    text: 'In the context of neural networks, what is a hidden layer?',
                    difficulty: 1,
                    options: [
                        { id: 'a', text: 'A layer that contains encrypted data' },
                        { id: 'b', text: 'A layer between input and output layers' },
                        { id: 'c', text: 'A layer that is not visible to users' },
                        { id: 'd', text: 'A layer used only for testing' }
                    ],
                    correctAnswer: 'b',
                    explanation: 'Hidden layers are the layers between the input and output layers in a neural network, where intermediate processing occurs.'
                },
                {
                    id: 'q5',
                    text: 'What problem does the vanishing gradient problem cause in deep neural networks?',
                    difficulty: 3,
                    options: [
                        { id: 'a', text: 'The network becomes too large to fit in memory' },
                        { id: 'b', text: 'Earlier layers train much slower than later layers' },
                        { id: 'c', text: 'The network generates random outputs' },
                        { id: 'd', text: 'It causes the network to overfit the training data' }
                    ],
                    correctAnswer: 'b',
                    explanation: 'The vanishing gradient problem occurs when gradients become extremely small as they propagate back through layers, causing earlier layers to train very slowly or not at all.'
                },
                {
                    id: 'q6',
                    text: 'Which statement about convolutional neural networks (CNNs) is true?',
                    difficulty: 3,
                    options: [
                        { id: 'a', text: 'They are primarily used for time series analysis' },
                        { id: 'b', text: 'They use fully connected layers exclusively' },
                        { id: 'c', text: 'They excel at processing grid-like data such as images' },
                        { id: 'd', text: 'They require less computational power than simple neural networks' }
                    ],
                    correctAnswer: 'c',
                    explanation: 'CNNs are designed to process data with grid-like topology, such as images, making them highly effective for computer vision tasks.'
                },
                {
                    id: 'q7',
                    text: 'What is dropout in neural networks?',
                    difficulty: 2,
                    options: [
                        { id: 'a', text: 'A technique where neurons are randomly deactivated during training' },
                        { id: 'b', text: 'When the network stops learning due to poor architecture' },
                        { id: 'c', text: 'A final layer that reduces dimensionality' },
                        { id: 'd', text: 'The process of removing unnecessary neurons after training' }
                    ],
                    correctAnswer: 'a',
                    explanation: 'Dropout is a regularization technique where randomly selected neurons are ignored during training, helping to prevent overfitting.'
                },
                {
                    id: 'q8',
                    text: 'In a neural network with stochastic gradient descent, what is "batch size"?',
                    difficulty: 3,
                    options: [
                        { id: 'a', text: 'The total number of training examples' },
                        { id: 'b', text: 'The number of training examples used in one iteration' },
                        { id: 'c', text: 'The size of the neural network' },
                        { id: 'd', text: 'The number of epochs used for training' }
                    ],
                    correctAnswer: 'b',
                    explanation: 'Batch size is the number of training examples utilized in one iteration of training the neural network.'
                }
            ],
            timeLimit: 600, // in seconds
            passingScore: 70
        },
        {
            id: 'quiz-2',
            title: 'Learning Theory Concepts',
            description: 'Explore key concepts in educational and cognitive learning theories',
            category: 'Education',
            questions: [
                {
                    id: 'q1',
                    text: 'Who is associated with the theory of Classical Conditioning?',
                    difficulty: 1,
                    options: [
                        { id: 'a', text: 'B.F. Skinner' },
                        { id: 'b', text: 'Jean Piaget' },
                        { id: 'c', text: 'Ivan Pavlov' },
                        { id: 'd', text: 'Albert Bandura' }
                    ],
                    correctAnswer: 'c',
                    explanation: 'Ivan Pavlov is famous for his experiments with dogs that led to the discovery of classical conditioning.'
                },
                {
                    id: 'q2',
                    text: 'What is the main focus of Vygotsky\'s sociocultural theory?',
                    difficulty: 2,
                    options: [
                        { id: 'a', text: 'Individual cognitive development happens independently of social factors' },
                        { id: 'b', text: 'Learning occurs primarily through observation of rewards and punishments' },
                        { id: 'c', text: 'Social interaction plays a fundamental role in cognitive development' },
                        { id: 'd', text: 'Development must precede learning' }
                    ],
                    correctAnswer: 'c',
                    explanation: 'Vygotsky emphasized that social interaction plays a crucial role in the development of cognition.'
                },
                {
                    id: 'q3',
                    text: 'What is the "spacing effect" in learning?',
                    difficulty: 2,
                    options: [
                        { id: 'a', text: 'Learning is more effective when studying is spread out over time' },
                        { id: 'b', text: 'Students learn better when they have more physical space' },
                        { id: 'c', text: 'Information is better recalled when presented with visual spacing' },
                        { id: 'd', text: 'The effect of classroom arrangement on learning outcomes' }
                    ],
                    correctAnswer: 'a',
                    explanation: 'The spacing effect refers to the finding that learning is more effective when study sessions are spaced out over time, rather than crammed into a single session.'
                }
            ],
            timeLimit: 300,
            passingScore: 60
        },
        {
            id: 'quiz-3',
            title: 'Data Structures Fundamentals',
            description: 'Test your knowledge of basic data structures',
            category: 'Programming',
            questions: [
                {
                    id: 'q1',
                    text: 'Which data structure uses LIFO (Last In First Out) principle?',
                    difficulty: 1,
                    options: [
                        { id: 'a', text: 'Queue' },
                        { id: 'b', text: 'Stack' },
                        { id: 'c', text: 'Linked List' },
                        { id: 'd', text: 'Tree' }
                    ],
                    correctAnswer: 'b',
                    explanation: 'Stack follows the Last In First Out (LIFO) principle where the last element added is the first one to be removed.'
                },
                {
                    id: 'q2',
                    text: 'What is the time complexity of searching an element in a balanced binary search tree?',
                    difficulty: 2,
                    options: [
                        { id: 'a', text: 'O(1)' },
                        { id: 'b', text: 'O(log n)' },
                        { id: 'c', text: 'O(n)' },
                        { id: 'd', text: 'O(n²)' }
                    ],
                    correctAnswer: 'b',
                    explanation: 'The time complexity of searching in a balanced binary search tree is O(log n) because with each comparison, we eliminate approximately half of the remaining tree.'
                },
                {
                    id: 'q3',
                    text: 'Which of the following is NOT a linear data structure?',
                    difficulty: 1,
                    options: [
                        { id: 'a', text: 'Array' },
                        { id: 'b', text: 'Linked List' },
                        { id: 'c', text: 'Stack' },
                        { id: 'd', text: 'Tree' }
                    ],
                    correctAnswer: 'd',
                    explanation: 'Tree is a hierarchical data structure and not a linear data structure. Arrays, linked lists, and stacks are linear data structures.'
                }
            ],
            timeLimit: 300,
            passingScore: 70
        },
        {
            id: 'quiz-4',
            title: 'Algebra Fundamentals',
            description: 'Test your knowledge of algebraic concepts',
            category: 'Mathematics',
            questions: [
                {
                    id: 'q1',
                    text: 'What is the value of x in the equation 2x + 5 = 13?',
                    difficulty: 1,
                    options: [
                        { id: 'a', text: '3' },
                        { id: 'b', text: '4' },
                        { id: 'c', text: '5' },
                        { id: 'd', text: '6' }
                    ],
                    correctAnswer: 'b',
                    explanation: 'To solve for x: 2x + 5 = 13, subtract 5 from both sides to get 2x = 8, then divide both sides by 2 to get x = 4.'
                },
                {
                    id: 'q2',
                    text: 'Which of the following is a polynomial?',
                    difficulty: 1,
                    options: [
                        { id: 'a', text: '1/x' },
                        { id: 'b', text: 'sqrt(x)' },
                        { id: 'c', text: '3x² + 2x - 7' },
                        { id: 'd', text: 'log(x)' }
                    ],
                    correctAnswer: 'c',
                    explanation: 'A polynomial is an expression consisting of variables and coefficients using only addition, subtraction, and multiplication operations. 3x² + 2x - 7 is a polynomial.'
                }
            ],
            timeLimit: 300,
            passingScore: 70
        }
    ];
    
    // Initialize the quiz system
    const init = () => {
        // Check if we have saved quizzes in localStorage
        const savedQuizzes = localStorage.getItem('learnsync-quizzes');
        if (savedQuizzes) {
            quizzes = JSON.parse(savedQuizzes);
        } else {
            quizzes = sampleQuizzes;
            saveQuizzes();
        }
        
        // Set up category buttons
        setupCategoryButtons();
        
        // Hide quiz list container initially
        const quizListContainer = document.getElementById('quiz-list-container');
        if (quizListContainer) {
            quizListContainer.style.display = 'none';
        }
    };
    
    // Set up category buttons
    const setupCategoryButtons = () => {
        const categoryButtons = document.querySelectorAll('.view-category-quizzes');
        
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute('data-category');
                showCategoryQuizzes(category);
            });
        });
        
        // Setup back to categories button
        const backButton = document.querySelector('.back-to-categories');
        if (backButton) {
            backButton.addEventListener('click', () => {
                hideCategoryQuizzes();
            });
        }
    };
    
    // Show quizzes for a specific category
    const showCategoryQuizzes = (category) => {
        currentCategory = category;
        
        // Update category title
        const categoryTitleElement = document.getElementById('current-category');
        if (categoryTitleElement) {
            categoryTitleElement.textContent = category;
        }
        
        // Get quizzes for the category
        const categoryQuizzes = quizzes.filter(quiz => quiz.category === category);
        
        // Get containers
        const categoriesContainer = document.querySelector('.quiz-categories');
        const quizListContainer = document.getElementById('quiz-list-container');
        const quizCardContainer = document.querySelector('.quiz-cards-container');
        const recentQuizzesContainer = document.getElementById('recent-quizzes');
        
        // Hide categories and recent quizzes
        if (categoriesContainer) categoriesContainer.style.display = 'none';
        if (recentQuizzesContainer) recentQuizzesContainer.style.display = 'none';
        
        // Show quiz list container
        if (quizListContainer) quizListContainer.style.display = 'block';
        
        // Clear and populate quiz cards
        if (quizCardContainer) {
            quizCardContainer.innerHTML = '';
            
            if (categoryQuizzes.length === 0) {
                quizCardContainer.innerHTML = '<div class="empty-state"><p>No quizzes available in this category yet.</p></div>';
                return;
            }
            
            categoryQuizzes.forEach(quiz => {
                const quizCard = document.createElement('div');
                quizCard.className = 'quiz-card';
                quizCard.innerHTML = `
                    <div class="quiz-card-left">
                        <div class="quiz-title">${quiz.title}</div>
                        <div class="quiz-meta">
                            <span><i class="fas fa-question-circle"></i> ${quiz.questions.length} Questions</span>
                            <span><i class="fas fa-clock"></i> ${formatTime(quiz.timeLimit)}</span>
                        </div>
                        <p>${quiz.description}</p>
                        <div class="quiz-card-action">
                            <button class="btn btn-primary start-quiz" data-quiz-id="${quiz.id}">Start Quiz</button>
                        </div>
                    </div>
                    <div class="quiz-card-right">
                        <div class="quiz-difficulty">
                            <div class="difficulty-label">Difficulty</div>
                            <div class="difficulty-level">${getDifficultyLabel(quiz)}</div>
                        </div>
                    </div>
                `;
                
                quizCardContainer.appendChild(quizCard);
                
                // Add event listener to start button
                quizCard.querySelector('.start-quiz').addEventListener('click', () => {
                    startQuiz(quiz.id);
                });
            });
        }
    };
    
    // Render quiz list (navigate back to category view)
    const renderQuizList = () => {
        if (currentCategory) {
            // If we're in a specific category, show that category's quizzes
            showCategoryQuizzes(currentCategory);
        } else {
            // Otherwise hide results and list containers, show categories
            const resultsContainer = document.getElementById('quiz-results-container');
            const quizContainer = document.getElementById('quiz-container');
            const quizListContainer = document.getElementById('quiz-list-container');
            const categoriesContainer = document.querySelector('.quiz-categories');
            const recentQuizzesContainer = document.getElementById('recent-quizzes');
            
            if (resultsContainer) resultsContainer.style.display = 'none';
            if (quizContainer) quizContainer.style.display = 'none';
            if (quizListContainer) quizListContainer.style.display = 'none';
            
            if (categoriesContainer) categoriesContainer.style.display = 'grid';
            if (recentQuizzesContainer) recentQuizzesContainer.style.display = 'block';
        }
    };
    
    // Hide category quizzes and show categories
    const hideCategoryQuizzes = () => {
        // Get containers
        const categoriesContainer = document.querySelector('.quiz-categories');
        const quizListContainer = document.getElementById('quiz-list-container');
        const recentQuizzesContainer = document.getElementById('recent-quizzes');
        
        // Show categories and recent quizzes
        if (categoriesContainer) categoriesContainer.style.display = 'grid';
        if (recentQuizzesContainer) recentQuizzesContainer.style.display = 'block';
        
        // Hide quiz list container
        if (quizListContainer) quizListContainer.style.display = 'none';
        
        // Reset current category
        currentCategory = '';
    };
    
    // Get difficulty label for a quiz
    const getDifficultyLabel = (quiz) => {
        const avgDifficulty = quiz.questions.reduce((sum, q) => sum + q.difficulty, 0) / quiz.questions.length;
        
        if (avgDifficulty < 1.7) return 'Easy';
        if (avgDifficulty < 2.4) return 'Medium';
        return 'Hard';
    };
    
    // Save quizzes to localStorage
    const saveQuizzes = () => {
        localStorage.setItem('learnsync-quizzes', JSON.stringify(quizzes));
    };
    
    // Start a specific quiz
    const startQuiz = (quizId) => {
        // Find the quiz by ID
        currentQuiz = quizzes.find(quiz => quiz.id === quizId);
        
        if (!currentQuiz) {
            console.error(`Quiz with ID ${quizId} not found.`);
            return;
        }
        
        // Reset quiz state
        currentQuestionIndex = 0;
        userAnswers = [];
        timeSpent = 0;
        
        // Prepare adaptive questions if needed
        prepareAdaptiveQuestions();
        
        // Show quiz interface
        showQuizInterface();
        
        // Start the timer
        startQuizTimer();
        
        // Render the first question
        renderCurrentQuestion();
    };
    
    // Prepare questions based on adaptive difficulty
    const prepareAdaptiveQuestions = () => {
        if (!currentQuiz) return;
        
        // Filter questions by difficulty level
        // For a real adaptive quiz, this would use more sophisticated algorithms
        
        if (difficultyLevel === 1) {
            // Easy: focus on easy questions
            currentQuiz.activeQuestions = currentQuiz.questions.filter(q => q.difficulty <= 2);
        } else if (difficultyLevel === 2) {
            // Medium: balanced mix
            currentQuiz.activeQuestions = currentQuiz.questions;
        } else {
            // Hard: include all questions but prioritize harder ones
            currentQuiz.activeQuestions = [...currentQuiz.questions];
            currentQuiz.activeQuestions.sort((a, b) => b.difficulty - a.difficulty);
        }
        
        // Shuffle the questions
        currentQuiz.activeQuestions = shuffleArray(currentQuiz.activeQuestions);
    };
    
    // Show the quiz interface
    const showQuizInterface = () => {
        const quizListContainer = document.getElementById('quiz-list-container');
        const quizContainer = document.getElementById('quiz-container');
        const resultsContainer = document.getElementById('quiz-results-container');
        
        if (quizListContainer && quizContainer) {
            quizListContainer.style.display = 'none';
            if (resultsContainer) resultsContainer.style.display = 'none';
            quizContainer.style.display = 'block';
            
            // Update quiz header
            const quizTitle = document.getElementById('quiz-title');
            if (quizTitle) quizTitle.textContent = currentQuiz.title;
            
            // Render first question
            renderCurrentQuestion();
        }
    };
    
    // Start the quiz timer
    const startQuizTimer = () => {
        const timerDisplay = document.getElementById('quiz-timer');
        if (!timerDisplay || !currentQuiz) return;
        
        // Clear any existing timer
        if (timer) clearInterval(timer);
        
        let remainingTime = currentQuiz.timeLimit;
        updateTimerDisplay(remainingTime);
        
        timer = setInterval(() => {
            remainingTime--;
            timeSpent++;
            
            if (remainingTime <= 0) {
                clearInterval(timer);
                completeQuiz(true); // Force complete due to time up
            } else {
                updateTimerDisplay(remainingTime);
            }
        }, 1000);
    };
    
    // Update the timer display
    const updateTimerDisplay = (seconds) => {
        const timerDisplay = document.getElementById('quiz-timer');
        if (timerDisplay) {
            timerDisplay.textContent = formatTime(seconds);
            
            // Add warning class when time is running low (less than 10%)
            if (seconds < currentQuiz.timeLimit * 0.1) {
                timerDisplay.classList.add('timer-warning');
            } else {
                timerDisplay.classList.remove('timer-warning');
            }
        }
    };
    
    // Render the current question
    const renderCurrentQuestion = () => {
        if (!currentQuiz || !currentQuiz.activeQuestions || currentQuestionIndex >= currentQuiz.activeQuestions.length) {
            // No more questions, complete the quiz
            completeQuiz();
            return;
        }
        
        const questionContainer = document.getElementById('question-container');
        const progressBar = document.getElementById('quiz-progress-bar');
        const progressText = document.getElementById('quiz-progress-text');
        
        if (questionContainer) {
            const question = currentQuiz.activeQuestions[currentQuestionIndex];
            
            // Update question text and options
            questionContainer.innerHTML = `
                <div class="question-header">
                    <div class="difficulty-indicator difficulty-${question.difficulty}">
                        ${'★'.repeat(question.difficulty)}${'☆'.repeat(3 - question.difficulty)}
                    </div>
                    <h3 class="question-text">${question.text}</h3>
                </div>
                <div class="options-container">
                    ${question.options.map(option => `
                        <div class="option" data-option-id="${option.id}">
                            <div class="option-marker">${option.id.toUpperCase()}</div>
                            <div class="option-text">${option.text}</div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            // Add click event listeners to options
            const optionElements = questionContainer.querySelectorAll('.option');
            optionElements.forEach(optionEl => {
                optionEl.addEventListener('click', () => {
                    // Record user's answer
                    const selectedOptionId = optionEl.dataset.optionId;
                    submitAnswer(selectedOptionId);
                    
                    // Update UI to show selection
                    optionElements.forEach(el => el.classList.remove('selected'));
                    optionEl.classList.add('selected');
                });
            });
            
            // Update progress indicators
            if (progressBar) {
                const progress = ((currentQuestionIndex) / currentQuiz.activeQuestions.length) * 100;
                progressBar.style.width = `${progress}%`;
            }
            
            if (progressText) {
                progressText.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuiz.activeQuestions.length}`;
            }
        }
    };
    
    // Submit an answer for the current question
    const submitAnswer = (optionId) => {
        if (!currentQuiz || currentQuestionIndex >= currentQuiz.activeQuestions.length) return;
        
        const question = currentQuiz.activeQuestions[currentQuestionIndex];
        const isCorrect = optionId === question.correctAnswer;
        
        // Record the answer
        userAnswers.push({
            questionId: question.id,
            selectedOption: optionId,
            isCorrect,
            timeSpent,
            questionDifficulty: question.difficulty
        });
        
        // Reset time spent for next question
        timeSpent = 0;
        
        // Enable the next button
        const nextButton = document.getElementById('next-question');
        if (nextButton) {
            nextButton.disabled = false;
        }
    };
    
    // Move to the next question
    const nextQuestion = () => {
        currentQuestionIndex++;
        
        // If this was the last question, complete the quiz
        if (currentQuestionIndex >= currentQuiz.activeQuestions.length) {
            completeQuiz();
        } else {
            renderCurrentQuestion();
            
            // Disable next button until user selects an answer
            const nextButton = document.getElementById('next-question');
            if (nextButton) {
                nextButton.disabled = true;
            }
        }
    };
    
    // Complete the quiz and show results
    const completeQuiz = (timeUp = false) => {
        // Clear timer
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        
        // Calculate results
        const results = calculateResults();
        
        // Adjust difficulty for future quizzes based on performance
        adjustDifficulty(results.percentageScore);
        
        // Show results
        showQuizResults(results, timeUp);
    };
    
    // Calculate quiz results
    const calculateResults = () => {
        if (!currentQuiz || !userAnswers.length) {
            return {
                totalQuestions: 0,
                answeredQuestions: 0,
                correctAnswers: 0,
                incorrectAnswers: 0,
                unansweredQuestions: 0,
                percentageScore: 0,
                passed: false,
                timeSpent: 0,
                difficultyBreakdown: { easy: 0, medium: 0, hard: 0 }
            };
        }
        
        const totalQuestions = currentQuiz.activeQuestions.length;
        const answeredQuestions = userAnswers.length;
        const correctAnswers = userAnswers.filter(a => a.isCorrect).length;
        const incorrectAnswers = answeredQuestions - correctAnswers;
        const unansweredQuestions = totalQuestions - answeredQuestions;
        const percentageScore = Math.round((correctAnswers / totalQuestions) * 100);
        const passed = percentageScore >= currentQuiz.passingScore;
        
        // Calculate difficulty breakdown
        const difficultyBreakdown = { easy: 0, medium: 0, hard: 0 };
        userAnswers.forEach(answer => {
            if (answer.isCorrect) {
                if (answer.questionDifficulty === 1) difficultyBreakdown.easy++;
                else if (answer.questionDifficulty === 2) difficultyBreakdown.medium++;
                else difficultyBreakdown.hard++;
            }
        });
        
        return {
            totalQuestions,
            answeredQuestions,
            correctAnswers,
            incorrectAnswers,
            unansweredQuestions,
            percentageScore,
            passed,
            timeSpent: calculateTotalTimeSpent(),
            difficultyBreakdown
        };
    };
    
    // Calculate total time spent on the quiz
    const calculateTotalTimeSpent = () => {
        return currentQuiz.timeLimit - parseInt(document.getElementById('quiz-timer')?.textContent?.split(':')?.reduce((m, s) => m * 60 + parseInt(s), 0) || 0);
    };
    
    // Adjust difficulty based on performance
    const adjustDifficulty = (score) => {
        if (score > 85) {
            // User did very well, increase difficulty
            difficultyLevel = Math.min(3, difficultyLevel + 1);
        } else if (score < 60) {
            // User struggled, decrease difficulty
            difficultyLevel = Math.max(1, difficultyLevel - 1);
        }
        // If score is between 60-85, keep the same difficulty
    };
    
    // Show quiz results
    const showQuizResults = (results, timeUp = false) => {
        const quizContainer = document.getElementById('quiz-container');
        const resultsContainer = document.getElementById('quiz-results-container');
        
        if (!quizContainer || !resultsContainer) return;
        
        quizContainer.style.display = 'none';
        resultsContainer.style.display = 'block';
        
        // Create results content
        let resultsHTML = `
            <div class="results-header">
                <h2>${timeUp ? 'Time\'s Up!' : 'Quiz Completed!'}</h2>
                <h3>${currentQuiz.title}</h3>
            </div>
            
            <div class="results-score ${results.passed ? 'passed' : 'failed'}">
                <div class="score-circle">
                    <span class="score-value">${results.percentageScore}%</span>
                    <span class="score-label">${results.passed ? 'PASSED' : 'FAILED'}</span>
                </div>
            </div>
            
            <div class="results-stats">
                <div class="stat-row">
                    <div class="stat-label">Correct Answers:</div>
                    <div class="stat-value">${results.correctAnswers} of ${results.totalQuestions}</div>
                </div>
                <div class="stat-row">
                    <div class="stat-label">Time Spent:</div>
                    <div class="stat-value">${formatTime(results.timeSpent)}</div>
                </div>
                <div class="stat-row">
                    <div class="stat-label">Difficulty Level:</div>
                    <div class="stat-value">${getDifficultyName(difficultyLevel)}</div>
                </div>
            </div>
            
            <div class="results-breakdown">
                <h4>Performance Breakdown</h4>
                <div class="breakdown-chart">
                    <div class="chart-bar correct" style="width: ${(results.correctAnswers / results.totalQuestions) * 100}%"></div>
                    <div class="chart-bar incorrect" style="width: ${(results.incorrectAnswers / results.totalQuestions) * 100}%"></div>
                    <div class="chart-bar unanswered" style="width: ${(results.unansweredQuestions / results.totalQuestions) * 100}%"></div>
                </div>
                <div class="chart-legend">
                    <div class="legend-item"><span class="color-box correct"></span> Correct (${results.correctAnswers})</div>
                    <div class="legend-item"><span class="color-box incorrect"></span> Incorrect (${results.incorrectAnswers})</div>
                    <div class="legend-item"><span class="color-box unanswered"></span> Unanswered (${results.unansweredQuestions})</div>
                </div>
            </div>
        `;
        
        // Add detailed answers section (collapsible)
        resultsHTML += `
            <div class="detailed-answers">
                <div class="answers-header" id="toggle-answers">
                    <h4>Question Details</h4>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="answers-content" id="answers-content" style="display: none;">
                    ${userAnswers.map((answer, index) => {
                        const question = currentQuiz.activeQuestions[index];
                        const selectedOption = question.options.find(o => o.id === answer.selectedOption);
                        const correctOption = question.options.find(o => o.id === question.correctAnswer);
                        
                        return `
                            <div class="answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}">
                                <div class="answer-question">
                                    <span class="question-number">${index + 1}.</span>
                                    ${question.text}
                                </div>
                                <div class="answer-details">
                                    <div class="answer-row">
                                        <span class="answer-label">Your Answer:</span>
                                        <span class="answer-value ${answer.isCorrect ? 'correct-text' : 'incorrect-text'}">
                                            ${selectedOption ? selectedOption.text : 'No answer'}
                                        </span>
                                    </div>
                                    ${!answer.isCorrect ? `
                                        <div class="answer-row">
                                            <span class="answer-label">Correct Answer:</span>
                                            <span class="answer-value correct-text">${correctOption.text}</span>
                                        </div>
                                    ` : ''}
                                    <div class="answer-explanation">
                                        <i class="fas fa-info-circle"></i> ${question.explanation}
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
        
        // Add action buttons
        resultsHTML += `
            <div class="results-actions">
                <button id="retry-quiz" class="btn btn-primary">Retry Quiz</button>
                <button id="back-to-quizzes" class="btn btn-secondary">Back to Quizzes</button>
            </div>
        `;
        
        // Set the HTML content
        resultsContainer.innerHTML = resultsHTML;
        
        // Add event listeners
        document.getElementById('toggle-answers')?.addEventListener('click', () => {
            const content = document.getElementById('answers-content');
            const icon = document.querySelector('#toggle-answers i');
            
            if (content && icon) {
                if (content.style.display === 'none') {
                    content.style.display = 'block';
                    icon.className = 'fas fa-chevron-up';
                } else {
                    content.style.display = 'none';
                    icon.className = 'fas fa-chevron-down';
                }
            }
        });
        
        document.getElementById('retry-quiz')?.addEventListener('click', () => {
            startQuiz(currentQuiz.id);
        });
        
        document.getElementById('back-to-quizzes')?.addEventListener('click', () => {
            renderQuizList();
        });
    };
    
    // Helper: Convert difficulty level to name
    const getDifficultyName = (level) => {
        switch (level) {
            case 1: return 'Easy';
            case 2: return 'Medium';
            case 3: return 'Hard';
            default: return 'Medium';
        }
    };
    
    // Format seconds to MM:SS
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSecs = seconds % 60;
        return `${minutes}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
    };
    
    // Shuffle array helper (Fisher-Yates algorithm)
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };
    
    // Public API
    return {
        init,
        startQuiz,
        nextQuestion,
        renderQuizList
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize quiz system
    QuizSystem.init();
    
    // Add global event listeners
    const nextQuestionBtn = document.getElementById('next-question');
    if (nextQuestionBtn) {
        nextQuestionBtn.addEventListener('click', QuizSystem.nextQuestion);
        // Initially disable until an answer is selected
        nextQuestionBtn.disabled = true;
    }
    
    const backToQuizzesBtn = document.getElementById('back-to-quizzes');
    if (backToQuizzesBtn) {
        backToQuizzesBtn.addEventListener('click', QuizSystem.renderQuizList);
    }
}); 