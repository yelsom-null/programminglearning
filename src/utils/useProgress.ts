import { useState, useEffect, useCallback } from 'react';
import {
  UserProgress,
  getCurrentProgress,
  saveProgress,
  completeConceptAndAwardPoints,
  getLessonCompletionPercentage,
  isConceptCompleted,
  awardBadge
} from '../services/progressService';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => getCurrentProgress());
  
  // Load progress from localStorage on component mount
  useEffect(() => {
    setProgress(getCurrentProgress());
  }, []);
  
  // Complete a concept and award points
  const completeConcept = useCallback((lessonId: string, conceptId: string | number) => {
    setProgress(current => {
      return completeConceptAndAwardPoints(
        current, 
        lessonId, 
        typeof conceptId === 'number' ? conceptId.toString() : conceptId
      );
    });
  }, []);
  
  // Get completion percentage for a lesson
  const getCompletionPercentage = useCallback((lessonId: string, totalConcepts: number) => {
    return getLessonCompletionPercentage(progress, lessonId, totalConcepts);
  }, [progress]);
  
  // Check if a concept is completed
  const checkConceptCompleted = useCallback((lessonId: string, conceptId: string | number) => {
    return isConceptCompleted(
      progress, 
      lessonId, 
      typeof conceptId === 'number' ? conceptId.toString() : conceptId
    );
  }, [progress]);
  
  // Award a badge
  const giveBadge = useCallback((badgeId: string) => {
    setProgress(current => awardBadge(current, badgeId));
  }, []);
  
  return {
    progress,
    completeConcept,
    getCompletionPercentage,
    checkConceptCompleted,
    giveBadge,
    points: progress.points,
    streak: progress.streak,
    badges: progress.badges
  };
} 