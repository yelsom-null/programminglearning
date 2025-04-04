// Progress Tracking Service
// This service handles tracking user progress, storing completion status,
// and managing gamification elements like points and streaks

// Types for user progress data
export interface ConceptProgress {
  id: string; // Concept ID - typically in format "lessonId-conceptNumber"
  completed: boolean;
  completedAt?: Date;
}

export interface LessonProgress {
  id: string; // Lesson ID
  conceptsCompleted: string[]; // Array of completed concept IDs
  completed: boolean;
  completedAt?: Date;
  lastVisited: Date;
}

export interface UserProgress {
  userId: string;
  points: number;
  streak: number;
  lastActive: Date;
  badges: string[];
  lessonsProgress: Record<string, LessonProgress>;
  conceptsProgress: Record<string, ConceptProgress>;
}

// Default empty progress object
const defaultProgress: UserProgress = {
  userId: 'default',
  points: 0,
  streak: 0,
  lastActive: new Date(),
  badges: [],
  lessonsProgress: {},
  conceptsProgress: {}
};

// Local storage keys
const PROGRESS_STORAGE_KEY = 'visagent_user_progress';
const LAST_ACTIVE_DATE_KEY = 'visagent_last_active_date';

/**
 * Initialize user progress from localStorage or create default
 */
export const initializeProgress = (): UserProgress => {
  try {
    const storedProgress = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (storedProgress) {
      const progress = JSON.parse(storedProgress) as UserProgress;
      
      // Convert date strings back to Date objects
      progress.lastActive = new Date(progress.lastActive);
      Object.values(progress.lessonsProgress).forEach(lesson => {
        if (lesson.completedAt) lesson.completedAt = new Date(lesson.completedAt);
        lesson.lastVisited = new Date(lesson.lastVisited);
      });
      Object.values(progress.conceptsProgress).forEach(concept => {
        if (concept.completedAt) concept.completedAt = new Date(concept.completedAt);
      });
      
      // Update streak if needed
      updateStreak(progress);
      
      return progress;
    }
  } catch (error) {
    console.error('Error loading progress:', error);
  }
  
  return {...defaultProgress};
};

/**
 * Save progress to localStorage
 */
export const saveProgress = (progress: UserProgress): void => {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

/**
 * Mark a concept as completed and award points
 */
export const completeConceptAndAwardPoints = (
  progress: UserProgress,
  lessonId: string,
  conceptId: string,
  points: number = 5
): UserProgress => {
  const updatedProgress = {...progress};
  const fullConceptId = `${lessonId}-${conceptId}`;
  
  // Don't award points if already completed
  if (updatedProgress.conceptsProgress[fullConceptId]?.completed) {
    return updatedProgress;
  }
  
  // Update concept completion
  updatedProgress.conceptsProgress[fullConceptId] = {
    id: fullConceptId,
    completed: true,
    completedAt: new Date()
  };
  
  // Initialize lesson progress if needed
  if (!updatedProgress.lessonsProgress[lessonId]) {
    updatedProgress.lessonsProgress[lessonId] = {
      id: lessonId,
      conceptsCompleted: [],
      completed: false,
      lastVisited: new Date()
    };
  }
  
  // Add to completed concepts for this lesson
  const lessonProgress = updatedProgress.lessonsProgress[lessonId];
  if (!lessonProgress.conceptsCompleted.includes(fullConceptId)) {
    lessonProgress.conceptsCompleted.push(fullConceptId);
    
    // Award points
    updatedProgress.points += points;
  }
  
  // Update last active date
  updatedProgress.lastActive = new Date();
  
  // Save the updated progress
  saveProgress(updatedProgress);
  
  return updatedProgress;
};

/**
 * Calculate completion percentage for a lesson
 */
export const getLessonCompletionPercentage = (
  progress: UserProgress,
  lessonId: string,
  totalConcepts: number
): number => {
  if (!progress.lessonsProgress[lessonId]) {
    return 0;
  }
  
  const completedCount = progress.lessonsProgress[lessonId].conceptsCompleted.length;
  return Math.round((completedCount / totalConcepts) * 100);
};

/**
 * Update the streak based on daily activity
 */
const updateStreak = (progress: UserProgress): void => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastActive = new Date(progress.lastActive);
  lastActive.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // If last active was today, do nothing
  if (lastActive.getTime() === today.getTime()) {
    return;
  }
  
  // If last active was yesterday, increment streak
  if (lastActive.getTime() === yesterday.getTime()) {
    progress.streak += 1;
  } 
  // If more than a day has passed, reset streak
  else if (lastActive < yesterday) {
    progress.streak = 0;
  }
  
  progress.lastActive = today;
};

/**
 * Award a badge to the user
 */
export const awardBadge = (
  progress: UserProgress,
  badgeId: string
): UserProgress => {
  const updatedProgress = {...progress};
  
  // Don't add duplicate badges
  if (!updatedProgress.badges.includes(badgeId)) {
    updatedProgress.badges.push(badgeId);
    
    // Give bonus points for badges
    updatedProgress.points += 25;
    
    // Save the updated progress
    saveProgress(updatedProgress);
  }
  
  return updatedProgress;
};

/**
 * Check if a concept is completed
 */
export const isConceptCompleted = (
  progress: UserProgress,
  lessonId: string,
  conceptId: string
): boolean => {
  const fullConceptId = `${lessonId}-${conceptId}`;
  return !!progress.conceptsProgress[fullConceptId]?.completed;
};

/**
 * Get current user progress from local storage
 */
export const getCurrentProgress = (): UserProgress => {
  return initializeProgress();
}; 