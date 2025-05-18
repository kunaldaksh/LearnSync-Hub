/**
 * LearnSync Hub - Course Catalog System
 * Features:
 * - Course listing and details
 * - Advanced filtering by topic, duration, and difficulty
 * - Search functionality
 * - Progress tracking
 * - Responsive grid layout
 */

const CourseSystem = (() => {
    // State variables
    let courses = [];
    let activeFilters = {
        topic: 'all',
        maxTime: null, // in hours
        difficulty: 'all',
        searchTerm: ''
    };
    
    // Sample course data
    const sampleCourses = [
        {
            id: 'course-1',
            title: 'Neural Networks Fundamentals',
            description: 'A comprehensive introduction to neural networks covering basic concepts, architecture types, and common applications.',
            image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485',
            topics: ['Machine Learning', 'Deep Learning', 'AI'],
            difficulty: 'beginner',
            estimatedTime: 10, // hours
            modules: [
                { title: 'Introduction to Neural Networks', duration: 1.5 },
                { title: 'Perceptrons and Activation Functions', duration: 2 },
                { title: 'Backpropagation Explained', duration: 2.5 },
                { title: 'Building Your First Neural Network', duration: 3 },
                { title: 'Applications and Future Directions', duration: 1 }
            ],
            instructor: 'Dr. Sarah Chen',
            enrollmentCount: 1240,
            rating: 4.7,
            released: '2023-04-15'
        },
        {
            id: 'course-2',
            title: 'Advanced Deep Learning Architectures',
            description: 'Explore cutting-edge deep learning architectures including transformers, GANs, and reinforcement learning networks.',
            image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c',
            topics: ['Deep Learning', 'Computer Vision', 'NLP'],
            difficulty: 'advanced',
            estimatedTime: 15, // hours
            modules: [
                { title: 'Review of Neural Network Basics', duration: 1 },
                { title: 'Convolutional Neural Networks in Depth', duration: 3 },
                { title: 'Recurrent Networks and LSTM', duration: 3 },
                { title: 'Transformer Architectures', duration: 4 },
                { title: 'Generative Adversarial Networks', duration: 2 },
                { title: 'Reinforcement Learning Networks', duration: 2 }
            ],
            instructor: 'Prof. Michael Reynolds',
            enrollmentCount: 850,
            rating: 4.9,
            released: '2023-06-10'
        },
        {
            id: 'course-3',
            title: 'Machine Learning for Data Analysis',
            description: 'Learn practical machine learning techniques for data analysis and predictive modeling in real-world business applications.',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
            topics: ['Machine Learning', 'Data Science', 'Statistics'],
            difficulty: 'intermediate',
            estimatedTime: 12, // hours
            modules: [
                { title: 'Data Preparation and Preprocessing', duration: 2 },
                { title: 'Feature Selection and Engineering', duration: 2.5 },
                { title: 'Regression Models for Prediction', duration: 2 },
                { title: 'Classification Techniques', duration: 2.5 },
                { title: 'Ensemble Methods', duration: 1.5 },
                { title: 'Model Evaluation and Deployment', duration: 1.5 }
            ],
            instructor: 'Dr. Rachel Kim',
            enrollmentCount: 1876,
            rating: 4.6,
            released: '2023-03-22'
        },
        {
            id: 'course-4',
            title: 'Introduction to Cognitive Science',
            description: 'Explore the interdisciplinary field of cognitive science, focusing on how the mind processes information and learns.',
            image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
            topics: ['Cognitive Science', 'Psychology', 'Neuroscience'],
            difficulty: 'beginner',
            estimatedTime: 8, // hours
            modules: [
                { title: 'Foundations of Cognitive Science', duration: 1.5 },
                { title: 'Perception and Attention', duration: 1.5 },
                { title: 'Memory Systems', duration: 1.5 },
                { title: 'Language and Communication', duration: 1.5 },
                { title: 'Decision Making and Problem Solving', duration: 2 }
            ],
            instructor: 'Prof. David Martinez',
            enrollmentCount: 923,
            rating: 4.5,
            released: '2023-02-15'
        },
        {
            id: 'course-5',
            title: 'Natural Language Processing Fundamentals',
            description: 'Learn the core concepts and techniques in NLP, from tokenization to advanced language models.',
            image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd',
            topics: ['NLP', 'Machine Learning', 'AI'],
            difficulty: 'intermediate',
            estimatedTime: 14, // hours
            modules: [
                { title: 'Introduction to NLP', duration: 1.5 },
                { title: 'Text Processing and Tokenization', duration: 2 },
                { title: 'Word Embeddings', duration: 3 },
                { title: 'Sequence Models for NLP', duration: 3.5 },
                { title: 'Transformer Models', duration: 2 },
                { title: 'Building NLP Applications', duration: 2 }
            ],
            instructor: 'Dr. Lisa Johnson',
            enrollmentCount: 1320,
            rating: 4.8,
            released: '2023-05-08'
        },
        {
            id: 'course-6',
            title: 'Educational Psychology and Learning Theory',
            description: 'Understand how humans learn and the psychological principles that can improve educational outcomes.',
            image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
            topics: ['Psychology', 'Education', 'Learning Theory'],
            difficulty: 'beginner',
            estimatedTime: 7, // hours
            modules: [
                { title: 'Foundations of Educational Psychology', duration: 1 },
                { title: 'Cognitive Development and Learning', duration: 1.5 },
                { title: 'Motivation and Engagement', duration: 1.5 },
                { title: 'Learning Styles and Strategies', duration: 1.5 },
                { title: 'Assessment and Evaluation', duration: 1.5 }
            ],
            instructor: 'Dr. Emily Rodriguez',
            enrollmentCount: 1540,
            rating: 4.7,
            released: '2023-01-10'
        }
    ];
    
    // Initialize the system
    const init = () => {
        // Load courses from localStorage or use sample data
        const savedCourses = localStorage.getItem('learnsync-courses');
        if (savedCourses) {
            courses = JSON.parse(savedCourses);
        } else {
            courses = sampleCourses;
            saveCourses();
        }
        
        // Render course list
        renderCourses();
        
        // Set up filter listeners
        setupFilterListeners();
    };
    
    // Save courses to localStorage
    const saveCourses = () => {
        localStorage.setItem('learnsync-courses', JSON.stringify(courses));
    };
    
    // Set up event listeners for filters
    const setupFilterListeners = () => {
        // Topic filter
        const topicFilter = document.getElementById('topic-filter');
        if (topicFilter) {
            // First populate the topics dropdown
            populateTopicFilter(topicFilter);
            
            topicFilter.addEventListener('change', () => {
                activeFilters.topic = topicFilter.value;
                renderCourses();
            });
        }
        
        // Max time filter
        const timeFilter = document.getElementById('time-filter');
        if (timeFilter) {
            timeFilter.addEventListener('input', () => {
                activeFilters.maxTime = timeFilter.value ? parseInt(timeFilter.value) : null;
                renderCourses();
            });
        }
        
        // Difficulty filter
        const difficultyFilter = document.getElementById('difficulty-filter');
        if (difficultyFilter) {
            difficultyFilter.addEventListener('change', () => {
                activeFilters.difficulty = difficultyFilter.value;
                renderCourses();
            });
        }
        
        // Search box
        const searchBox = document.getElementById('course-search');
        if (searchBox) {
            // Debounce search to improve performance
            let searchTimeout;
            searchBox.addEventListener('input', () => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    activeFilters.searchTerm = searchBox.value.toLowerCase().trim();
                    renderCourses();
                }, 300);
            });
        }
        
        // Clear filters button
        const clearFiltersBtn = document.getElementById('clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', clearAllFilters);
        }
    };
    
    // Populate topic filter with unique topics
    const populateTopicFilter = (selectElement) => {
        // Get all unique topics
        const allTopics = new Set();
        courses.forEach(course => {
            course.topics.forEach(topic => allTopics.add(topic));
        });
        
        // Sort topics alphabetically
        const sortedTopics = Array.from(allTopics).sort();
        
        // Add default option
        selectElement.innerHTML = '<option value="all">All Topics</option>';
        
        // Add topic options
        sortedTopics.forEach(topic => {
            const option = document.createElement('option');
            option.value = topic;
            option.textContent = topic;
            selectElement.appendChild(option);
        });
    };
    
    // Apply filters to courses
    const getFilteredCourses = () => {
        return courses.filter(course => {
            // Topic filter
            if (activeFilters.topic !== 'all' && !course.topics.includes(activeFilters.topic)) {
                return false;
            }
            
            // Max time filter
            if (activeFilters.maxTime && course.estimatedTime > activeFilters.maxTime) {
                return false;
            }
            
            // Difficulty filter
            if (activeFilters.difficulty !== 'all' && course.difficulty !== activeFilters.difficulty) {
                return false;
            }
            
            // Search term
            if (activeFilters.searchTerm) {
                const searchIn = [
                    course.title,
                    course.description,
                    course.instructor,
                    ...course.topics,
                    ...course.modules.map(m => m.title)
                ].join(' ').toLowerCase();
                
                return searchIn.includes(activeFilters.searchTerm);
            }
            
            return true;
        });
    };
    
    // Render courses with current filters
    const renderCourses = () => {
        const coursesList = document.getElementById('courses-list');
        if (!coursesList) return;
        
        // Apply filters
        const filteredCourses = getFilteredCourses();
        
        // Update results count
        updateResultsCount(filteredCourses.length);
        
        // Clear previous courses
        coursesList.innerHTML = '';
        
        if (filteredCourses.length === 0) {
            // Show no results message
            coursesList.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No courses found</h3>
                    <p>Try adjusting your filters or search terms</p>
                    <button id="clear-filters-empty" class="btn btn-secondary">Clear Filters</button>
                </div>
            `;
            
            document.getElementById('clear-filters-empty')?.addEventListener('click', clearAllFilters);
            return;
        }
        
        // Render each course card
        filteredCourses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = 'course-card';
            courseCard.dataset.courseId = course.id;
            
            // Calculate total time from modules
            const totalTime = course.modules.reduce((sum, module) => sum + module.duration, 0);
            
            courseCard.innerHTML = `
                <div class="course-image">
                    <img src="${course.image}" alt="${course.title}">
                    <div class="course-difficulty ${course.difficulty}">${capitalizeFirst(course.difficulty)}</div>
                </div>
                <div class="course-content">
                    <div class="course-topics">
                        ${course.topics.map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
                    </div>
                    <h3 class="course-title">${course.title}</h3>
                    <p class="course-description">${truncateText(course.description, 120)}</p>
                    <div class="course-meta">
                        <div class="meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${totalTime} hours</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-book"></i>
                            <span>${course.modules.length} modules</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-star"></i>
                            <span>${course.rating}</span>
                        </div>
                    </div>
                    <div class="course-footer">
                        <div class="instructor">
                            <i class="fas fa-chalkboard-teacher"></i>
                            <span>${course.instructor}</span>
                        </div>
                        <button class="btn btn-primary view-course" data-course-id="${course.id}">View Course</button>
                    </div>
                </div>
            `;
            
            coursesList.appendChild(courseCard);
            
            // Add event listener for view course button
            courseCard.querySelector('.view-course').addEventListener('click', () => {
                viewCourseDetails(course.id);
            });
        });
    };
    
    // Update the results count display
    const updateResultsCount = (count) => {
        const countElement = document.getElementById('courses-count');
        if (countElement) {
            countElement.textContent = `${count} course${count !== 1 ? 's' : ''} found`;
        }
    };
    
    // Clear all filters and reset to default
    const clearAllFilters = () => {
        // Reset filter state
        activeFilters = {
            topic: 'all',
            maxTime: null,
            difficulty: 'all',
            searchTerm: ''
        };
        
        // Reset UI elements
        const topicFilter = document.getElementById('topic-filter');
        if (topicFilter) topicFilter.value = 'all';
        
        const timeFilter = document.getElementById('time-filter');
        if (timeFilter) timeFilter.value = '';
        
        const difficultyFilter = document.getElementById('difficulty-filter');
        if (difficultyFilter) difficultyFilter.value = 'all';
        
        const searchBox = document.getElementById('course-search');
        if (searchBox) searchBox.value = '';
        
        // Re-render courses
        renderCourses();
    };
    
    // View detailed information about a course
    const viewCourseDetails = (courseId) => {
        const course = courses.find(c => c.id === courseId);
        if (!course) return;
        
        // Get containers
        const catalogContainer = document.getElementById('course-catalog-container');
        const detailsContainer = document.getElementById('course-details-container');
        
        if (!catalogContainer || !detailsContainer) return;
        
        // Hide catalog, show details
        catalogContainer.style.display = 'none';
        detailsContainer.style.display = 'block';
        
        // Calculate total time
        const totalTime = course.modules.reduce((sum, module) => sum + module.duration, 0);
        
        // Build details HTML
        detailsContainer.innerHTML = `
            <div class="course-details-header">
                <button id="back-to-catalog" class="btn btn-secondary">
                    <i class="fas fa-arrow-left"></i> Back to Catalog
                </button>
                <h2>${course.title}</h2>
                <div class="course-topics">
                    ${course.topics.map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
                </div>
            </div>
            
            <div class="course-details-grid">
                <div class="course-main-info">
                    <div class="course-banner">
                        <img src="${course.image}" alt="${course.title}">
                        <div class="course-difficulty ${course.difficulty}">${capitalizeFirst(course.difficulty)}</div>
                    </div>
                    
                    <div class="course-description-full">
                        <h3>About This Course</h3>
                        <p>${course.description}</p>
                    </div>
                    
                    <div class="course-modules">
                        <h3>Course Content</h3>
                        <div class="modules-info">
                            <span>${course.modules.length} modules</span>
                            <span>${totalTime} total hours</span>
                        </div>
                        
                        <div class="modules-list">
                            ${course.modules.map((module, index) => `
                                <div class="module-item">
                                    <div class="module-number">${index + 1}</div>
                                    <div class="module-info">
                                        <h4>${module.title}</h4>
                                        <span><i class="fas fa-clock"></i> ${module.duration} hours</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="course-sidebar">
                    <div class="course-meta-card">
                        <div class="meta-item">
                            <i class="fas fa-clock"></i>
                            <div class="meta-info">
                                <span class="meta-label">Total Duration</span>
                                <span class="meta-value">${totalTime} hours</span>
                            </div>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-signal"></i>
                            <div class="meta-info">
                                <span class="meta-label">Difficulty Level</span>
                                <span class="meta-value">${capitalizeFirst(course.difficulty)}</span>
                            </div>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-chalkboard-teacher"></i>
                            <div class="meta-info">
                                <span class="meta-label">Instructor</span>
                                <span class="meta-value">${course.instructor}</span>
                            </div>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-users"></i>
                            <div class="meta-info">
                                <span class="meta-label">Enrolled</span>
                                <span class="meta-value">${course.enrollmentCount.toLocaleString()} students</span>
                            </div>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-calendar-alt"></i>
                            <div class="meta-info">
                                <span class="meta-label">Released</span>
                                <span class="meta-value">${formatDate(course.released)}</span>
                            </div>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-star"></i>
                            <div class="meta-info">
                                <span class="meta-label">Rating</span>
                                <span class="meta-value">${course.rating} / 5</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="enrollment-card">
                        <button class="btn btn-primary btn-full">Enroll in Course</button>
                        <button class="btn btn-secondary btn-full">Add to Wishlist</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listener to back button
        document.getElementById('back-to-catalog')?.addEventListener('click', () => {
            catalogContainer.style.display = 'block';
            detailsContainer.style.display = 'none';
        });
    };
    
    // Helper: Capitalize first letter
    const capitalizeFirst = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    
    // Helper: Truncate text with ellipsis
    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };
    
    // Helper: Format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    
    // Public API
    return {
        init,
        clearAllFilters
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the course system
    CourseSystem.init();
}); 