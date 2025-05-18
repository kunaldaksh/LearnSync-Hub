/**
 * LearnSync Hub - Habit Tracker System
 * Features:
 * - Daily habit tracking
 * - Streaks and statistics
 * - Progress visualization
 * - Reminders and notifications
 */

const HabitTracker = (() => {
    // State variables
    let habits = [];
    let stats = {
        totalCompleted: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastCheckDate: null
    };
    
    // Sample habit data
    const sampleHabits = [
        {
            id: 'habit-1',
            title: 'Study Neural Networks',
            description: 'Spend at least 30 minutes studying neural network concepts',
            icon: 'fa-brain',
            color: '#4c6ef5',
            frequency: {
                type: 'daily',
                days: [0, 1, 2, 3, 4, 5, 6] // All days of the week
            },
            timeOfDay: 'morning',
            created: new Date('2023-06-01').toISOString(),
            streak: 3,
            history: generateSampleHistory(15, 0.7) // 70% completion rate
        },
        {
            id: 'habit-2',
            title: 'Read Research Papers',
            description: 'Read at least one AI or ML research paper',
            icon: 'fa-book',
            color: '#82c91e',
            frequency: {
                type: 'weekly',
                days: [1, 3, 5] // Mon, Wed, Fri
            },
            timeOfDay: 'evening',
            created: new Date('2023-06-15').toISOString(),
            streak: 2,
            history: generateSampleHistory(10, 0.6)
        },
        {
            id: 'habit-3',
            title: 'Practice Coding Exercises',
            description: 'Solve at least two programming challenges',
            icon: 'fa-code',
            color: '#f76707',
            frequency: {
                type: 'daily',
                days: [1, 2, 3, 4, 5] // Weekdays only
            },
            timeOfDay: 'afternoon',
            created: new Date('2023-06-10').toISOString(),
            streak: 5,
            history: generateSampleHistory(20, 0.8)
        }
    ];
    
    // Generate sample history for demo purposes
    function generateSampleHistory(days, completionRate) {
        const history = [];
        const now = new Date();
        
        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(now.getDate() - i);
            
            // Random completion based on completion rate
            const completed = Math.random() < completionRate;
            
            history.push({
                date: date.toISOString().split('T')[0],
                completed,
                notes: completed ? 'Completed' : 'Missed'
            });
        }
        
        return history;
    }
    
    // Initialize the tracker
    const init = () => {
        // Load habits from localStorage or use sample data
        const savedHabits = localStorage.getItem('learnsync-habits');
        const savedStats = localStorage.getItem('learnsync-habit-stats');
        
        if (savedHabits) {
            habits = JSON.parse(savedHabits);
        } else {
            habits = sampleHabits;
        }
        
        if (savedStats) {
            stats = JSON.parse(savedStats);
        }
        
        // Check for streak updates (if last check was not today)
        updateStreaks();
        
        // Render the habit list
        renderHabitList();
        updateStats();
    };
    
    // Save habits to localStorage
    const saveHabits = () => {
        localStorage.setItem('learnsync-habits', JSON.stringify(habits));
        localStorage.setItem('learnsync-habit-stats', JSON.stringify(stats));
    };
    
    // Update streaks based on current date
    const updateStreaks = () => {
        const today = new Date().toISOString().split('T')[0];
        
        // If we haven't checked today
        if (stats.lastCheckDate !== today) {
            // Process each habit
            habits.forEach(habit => {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayString = yesterday.toISOString().split('T')[0];
                
                // Find yesterday's record
                const yesterdayRecord = habit.history.find(h => h.date === yesterdayString);
                
                // If yesterday was not completed or there's no record, reset streak
                if (!yesterdayRecord || !yesterdayRecord.completed) {
                    habit.streak = 0;
                }
            });
            
            // Update last check date
            stats.lastCheckDate = today;
            saveHabits();
        }
    };
    
    // Render the habit list
    const renderHabitList = () => {
        const habitListContainer = document.getElementById('habit-list');
        if (!habitListContainer) return;
        
        habitListContainer.innerHTML = '';
        
        // Today's date for highlighting
        const today = new Date().toISOString().split('T')[0];
        const dayOfWeek = new Date().getDay(); // 0-6, where 0 is Sunday
        
        // Sort habits: first active for today, then others
        const sortedHabits = [...habits].sort((a, b) => {
            const aActiveToday = a.frequency.days.includes(dayOfWeek);
            const bActiveToday = b.frequency.days.includes(dayOfWeek);
            
            if (aActiveToday && !bActiveToday) return -1;
            if (!aActiveToday && bActiveToday) return 1;
            return 0;
        });
        
        sortedHabits.forEach(habit => {
            // Check if habit is scheduled for today
            const isActiveToday = habit.frequency.days.includes(dayOfWeek);
            
            // Check if already completed today
            const todayRecord = habit.history.find(h => h.date === today);
            const isCompletedToday = todayRecord && todayRecord.completed;
            
            // Create habit item
            const habitItem = document.createElement('div');
            habitItem.className = `habit-item ${isActiveToday ? 'active-today' : 'inactive-today'}`;
            habitItem.dataset.habitId = habit.id;
            
            habitItem.innerHTML = `
                <div class="habit-header">
                    <div class="habit-icon" style="background-color: ${habit.color}">
                        <i class="fas ${habit.icon}"></i>
                    </div>
                    <div class="habit-info">
                        <h3>${habit.title}</h3>
                        <p>${habit.description}</p>
                    </div>
                    <div class="habit-streak">
                        <div class="streak-count">
                            <i class="fas fa-fire"></i>
                            <span>${habit.streak}</span>
                        </div>
                        <div class="streak-label">Streak</div>
                    </div>
                </div>
                
                <div class="habit-actions">
                    <div class="habit-days">
                        ${generateDayIndicators(habit.frequency.days, dayOfWeek)}
                    </div>
                    
                    <div class="completion-actions">
                        ${isActiveToday ? `
                            <button class="btn ${isCompletedToday ? 'btn-success completed' : 'btn-primary'} toggle-completion" data-habit-id="${habit.id}">
                                ${isCompletedToday ? '<i class="fas fa-check"></i> Completed' : 'Mark Complete'}
                            </button>
                        ` : `
                            <span class="not-scheduled">Not scheduled today</span>
                        `}
                    </div>
                </div>
                
                <div class="habit-history">
                    ${generateHistoryVisualization(habit.history.slice(0, 10).reverse())}
                </div>
            `;
            
            habitListContainer.appendChild(habitItem);
            
            // Add event listener for completion toggle
            const toggleBtn = habitItem.querySelector('.toggle-completion');
            if (toggleBtn) {
                toggleBtn.addEventListener('click', () => toggleHabitCompletion(habit.id));
            }
        });
        
        // Add "Add New Habit" button
        const addButton = document.createElement('div');
        addButton.className = 'add-habit-button';
        addButton.innerHTML = `
            <button id="add-habit-btn" class="btn btn-primary">
                <i class="fas fa-plus"></i> Add New Habit
            </button>
        `;
        habitListContainer.appendChild(addButton);
        
        // Add event listener
        document.getElementById('add-habit-btn')?.addEventListener('click', showAddHabitForm);
    };
    
    // Generate day indicators (S M T W T F S)
    const generateDayIndicators = (activeDays, today) => {
        const dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        
        return dayLetters.map((letter, index) => {
            const isActive = activeDays.includes(index);
            const isToday = index === today;
            
            return `
                <div class="day-indicator 
                    ${isActive ? 'active' : 'inactive'} 
                    ${isToday ? 'today' : ''}">
                    ${letter}
                </div>
            `;
        }).join('');
    };
    
    // Generate history visualization
    const generateHistoryVisualization = (historyEntries) => {
        if (!historyEntries.length) return '';
        
        return `
            <div class="history-chart">
                ${historyEntries.map(entry => `
                    <div class="history-day ${entry.completed ? 'completed' : 'missed'}" 
                         title="${entry.date}: ${entry.completed ? 'Completed' : 'Missed'}">
                    </div>
                `).join('')}
            </div>
        `;
    };
    
    // Toggle habit completion status
    const toggleHabitCompletion = (habitId) => {
        const habitIndex = habits.findIndex(h => h.id === habitId);
        if (habitIndex === -1) return;
        
        const habit = habits[habitIndex];
        const today = new Date().toISOString().split('T')[0];
        
        // Find today's record or create one
        let todayRecord = habit.history.find(h => h.date === today);
        
        if (!todayRecord) {
            todayRecord = {
                date: today,
                completed: false,
                notes: ''
            };
            habit.history.unshift(todayRecord);
        }
        
        // Toggle completion
        todayRecord.completed = !todayRecord.completed;
        
        // Update streak
        if (todayRecord.completed) {
            habit.streak++;
            stats.totalCompleted++;
        } else {
            habit.streak = Math.max(0, habit.streak - 1);
            stats.totalCompleted = Math.max(0, stats.totalCompleted - 1);
        }
        
        // Update longest streak
        stats.longestStreak = Math.max(stats.longestStreak, habit.streak);
        
        // Save changes
        saveHabits();
        
        // Update UI
        renderHabitList();
        updateStats();
    };
    
    // Update overall statistics
    const updateStats = () => {
        const statsContainer = document.getElementById('habit-stats');
        if (!statsContainer) return;
        
        // Calculate completion rate
        const totalHabits = habits.length;
        const activeHabits = habits.filter(h => {
            const today = new Date().getDay();
            return h.frequency.days.includes(today);
        }).length;
        
        const completedToday = habits.filter(h => {
            const today = new Date().toISOString().split('T')[0];
            return h.history.some(entry => entry.date === today && entry.completed);
        }).length;
        
        const completionRate = activeHabits > 0 
            ? Math.round((completedToday / activeHabits) * 100) 
            : 0;
        
        // Update progress bar
        const progressBar = document.getElementById('habit-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${completionRate}%`;
            progressBar.setAttribute('aria-valuenow', completionRate);
        }
        
        // Update stats display
        statsContainer.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${completedToday}/${activeHabits}</div>
                    <div class="stat-label">Today's Progress</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.totalCompleted}</div>
                    <div class="stat-label">Total Completions</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.longestStreak}</div>
                    <div class="stat-label">Longest Streak</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${totalHabits}</div>
                    <div class="stat-label">Total Habits</div>
                </div>
            </div>
        `;
    };
    
    // Show add habit form
    const showAddHabitForm = () => {
        const formContainer = document.getElementById('add-habit-form-container');
        if (!formContainer) return;
        
        formContainer.style.display = 'block';
    };
    
    // Hide add habit form
    const hideAddHabitForm = () => {
        const formContainer = document.getElementById('add-habit-form-container');
        if (!formContainer) return;
        
        formContainer.style.display = 'none';
    };
    
    // Add a new habit
    const addNewHabit = (formData) => {
        const newHabit = {
            id: 'habit-' + Date.now(),
            title: formData.title,
            description: formData.description,
            icon: formData.icon || 'fa-check',
            color: formData.color || '#4c6ef5',
            frequency: {
                type: formData.frequencyType,
                days: formData.frequencyDays
            },
            timeOfDay: formData.timeOfDay,
            created: new Date().toISOString(),
            streak: 0,
            history: []
        };
        
        habits.push(newHabit);
        saveHabits();
        renderHabitList();
        updateStats();
        hideAddHabitForm();
    };
    
    // Public API
    return {
        init,
        addNewHabit,
        toggleHabitCompletion,
        hideAddHabitForm
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize habit tracker
    HabitTracker.init();
    
    // Add event listeners
    const addHabitForm = document.getElementById('add-habit-form');
    if (addHabitForm) {
        addHabitForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = {
                title: document.getElementById('habit-title').value,
                description: document.getElementById('habit-description').value,
                icon: document.getElementById('habit-icon').value,
                color: document.getElementById('habit-color').value,
                frequencyType: document.getElementById('habit-frequency-type').value,
                frequencyDays: Array.from(document.querySelectorAll('input[name="frequency-day"]:checked'))
                    .map(cb => parseInt(cb.value)),
                timeOfDay: document.getElementById('habit-time').value
            };
            
            HabitTracker.addNewHabit(formData);
        });
    }
    
    // Cancel button
    const cancelButton = document.getElementById('cancel-add-habit');
    if (cancelButton) {
        cancelButton.addEventListener('click', (e) => {
            e.preventDefault();
            HabitTracker.hideAddHabitForm();
        });
    }
}); 