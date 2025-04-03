import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import curriculum from '../data/curriculum';

// Add type declaration for feather
declare global {
  interface Window {
    feather: {
      replace: () => void;
    };
  }
}

interface LessonPlaceholderProps {
  title: string;
  description: string;
  status?: 'coming-soon' | 'in-progress' | 'available';
  content?: React.ReactNode;
  lessonId?: string;
}

const LessonPlaceholder: React.FC<LessonPlaceholderProps> = ({ 
  title, 
  description, 
  status = 'coming-soon',
  content,
  lessonId
}) => {
  
  useEffect(() => {
    // Initialize feather icons when component mounts
    if (window.feather) {
      window.feather.replace();
    }
  }, []);
  
  // Find current lesson in curriculum
  const currentLessonId = lessonId || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  let prevLesson = null;
  let nextLesson = null;
  let currentChapter = null;
  let currentLessonIndex = -1;
  
  // Find current chapter and lesson
  for (const chapter of curriculum) {
    const lessonIndex = chapter.lessons.findIndex(l => 
      l.id === currentLessonId || l.title === title);
    if (lessonIndex !== -1) {
      currentChapter = chapter;
      currentLessonIndex = lessonIndex;
      
      // Get previous lesson
      if (lessonIndex > 0) {
        prevLesson = chapter.lessons[lessonIndex - 1];
      } else {
        // Look for last lesson in previous chapter
        const chapterIndex = curriculum.findIndex(c => c.id === chapter.id);
        if (chapterIndex > 0) {
          const prevChapter = curriculum[chapterIndex - 1];
          prevLesson = prevChapter.lessons[prevChapter.lessons.length - 1];
        }
      }
      
      // Get next lesson
      if (lessonIndex < chapter.lessons.length - 1) {
        nextLesson = chapter.lessons[lessonIndex + 1];
      } else {
        // Look for first lesson in next chapter
        const chapterIndex = curriculum.findIndex(c => c.id === chapter.id);
        if (chapterIndex < curriculum.length - 1) {
          const nextChapter = curriculum[chapterIndex + 1];
          nextLesson = nextChapter.lessons[0];
        }
      }
      
      break;
    }
  }
  
  return (
    <div className="lesson-placeholder p-4">
      <div className="lesson-header mb-5">
        <h1>{title}</h1>
        <div className="lesson-meta">
          <div className="chapter-info">
            <span className="chapter-title">{currentChapter?.title || "Chapter 1: JavaScript Fundamentals"}</span>
            <div className="lesson-navigation">
              {prevLesson ? (
                <Link 
                  to={prevLesson.route}
                  className="chapter-nav-button"
                  title={`Previous: ${prevLesson.title}`}
                >
                  ← Previous Lesson
                </Link>
              ) : (
                <button 
                  className="chapter-nav-button" 
                  disabled={true}
                  title="This is the first lesson"
                >
                  ← Previous Lesson
                </button>
              )}
              
              <span className="lesson-indicator">
                {currentChapter && currentLessonIndex !== -1 
                  ? `Lesson ${currentLessonIndex + 1} of ${currentChapter.lessons.length}`
                  : "Lesson"}
              </span>
              
              {nextLesson ? (
                <Link 
                  to={nextLesson.route}
                  className="chapter-nav-button"
                  title={`Next: ${nextLesson.title}`}
                >
                  Next Lesson →
                </Link>
              ) : (
                <button 
                  className="chapter-nav-button" 
                  disabled={true}
                  title="This is the last lesson"
                >
                  Next Lesson →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mb-5">
        <div className="mb-4">
          {status === 'coming-soon' && (
            <span className="badge bg-warning text-dark mb-3">Coming Soon</span>
          )}
          {status === 'in-progress' && (
            <span className="badge bg-info text-dark mb-3">In Development</span>
          )}
        </div>
        <p className="lead mb-4">{description}</p>
        
        {!content && (
          <>
            <div className="alert alert-info d-inline-flex align-items-center p-3 mb-4">
              <i data-feather="info" className="me-2"></i>
              <span>This interactive lesson is still in development.</span>
            </div>
            
            <div className="mt-4">
              <a href="/" className="btn btn-primary me-2">
                <i data-feather="arrow-left" className="me-2"></i>
                Back to Dashboard
              </a>
              <a href="#" className="btn btn-outline-secondary" onClick={(e) => { 
                e.preventDefault();
                window.history.back();
              }}>
                <i data-feather="chevron-left" className="me-2"></i>
                Previous Page
              </a>
            </div>
          </>
        )}
      </div>
      
      {content ? (
        <div className="lesson-content mt-3">
          {content}
        </div>
      ) : (
        <div className="row mt-5">
          <div className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">
                  <i data-feather="book-open" className="me-2"></i>
                  What you'll learn
                </h5>
                <p className="card-text">
                  This lesson will cover important concepts related to {title.toLowerCase()}
                  in JavaScript. Check back soon for the interactive version!
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">
                  <i data-feather="calendar" className="me-2"></i>
                  Estimated Completion
                </h5>
                <p className="card-text">
                  This lesson should take approximately 20-30 minutes to complete
                  once it's available.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonPlaceholder; 