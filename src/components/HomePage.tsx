import React from 'react';
import curriculum, { Chapter } from '../data/curriculum';
import '../styles/HomePage.css';

interface HomePageProps {
  darkMode: boolean;
  onSelectLesson: (id: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ darkMode, onSelectLesson }) => {
  // Count available lessons across all chapters
  const availableLessons = curriculum.reduce((count, chapter) => {
    return count + chapter.lessons.filter(lesson => lesson.status === 'available').length;
  }, 0);
  
  const totalLessons = curriculum.reduce((count, chapter) => {
    return count + chapter.lessons.length;
  }, 0);
  
  const getStatusClass = (status: Chapter['status']) => {
    switch (status) {
      case 'available': return 'status-available';
      case 'in-progress': return 'status-in-progress';
      case 'coming-soon': return 'status-coming-soon';
      default: return '';
    }
  };
  
  const getStatusIcon = (status: Chapter['status']) => {
    switch (status) {
      case 'available': return '✓';
      case 'in-progress': return '⋯';
      case 'coming-soon': return '⧗';
      default: return '';
    }
  };
  
  const getAvailableLessonsCount = (chapter: Chapter) => {
    return chapter.lessons.filter(lesson => lesson.status === 'available').length;
  };

  return (
    <div className={`home-container ${darkMode ? 'dark' : 'light'}`}>
      <div className="home-header">
        <h1>JavaScript Fundamentals</h1>
        <p className="course-description">
          Master JavaScript from the ground up with interactive lessons and real-time code visualizations
        </p>
        <div className="course-stats">
          <div className="stat-item">
            <span className="stat-value">{availableLessons}</span>
            <span className="stat-label">Lessons Available</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{totalLessons}</span>
            <span className="stat-label">Total Lessons</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">20-30</span>
            <span className="stat-label">Minutes Per Lesson</span>
          </div>
        </div>
      </div>

      <div className="curriculum-container">
        <h2>Course Curriculum</h2>
        <div className="curriculum-grid">
          {curriculum.map((chapter) => (
            <div 
              key={chapter.id} 
              className={`lesson-card ${getStatusClass(chapter.status)}`}
              onClick={() => {
                if (chapter.status === 'available' && chapter.lessons.length > 0) {
                  // Find first available lesson in chapter
                  const firstAvailableLesson = chapter.lessons.find(lesson => lesson.status === 'available');
                  if (firstAvailableLesson) {
                    onSelectLesson(firstAvailableLesson.id);
                  }
                }
              }}
            >
              <div className="lesson-card-content">
                <div className="lesson-card-header">
                  <span className="chapter-number">Chapter {chapter.order}</span>
                  <span className={`lesson-status ${getStatusClass(chapter.status)}`}>
                    {chapter.status === 'available' ? 'Available' : 
                     chapter.status === 'in-progress' ? 'In Progress' : 'Coming Soon'}
                  </span>
                </div>
                <div className="lesson-info">
                  <h3 className="lesson-title">{chapter.title}</h3>
                  <p className="lesson-description">{chapter.description}</p>
                  
                  <div className="lesson-count">
                    <span className="available-lessons">
                      {getAvailableLessonsCount(chapter)} of {chapter.lessons.length} lessons available
                    </span>
                  </div>
                </div>
              </div>
              <div className="lesson-footer">
                <span className={`status-indicator ${getStatusClass(chapter.status)}`}>
                  {getStatusIcon(chapter.status)}
                </span>
                {chapter.status === 'available' && (
                  <button className="start-button">
                    Start Chapter
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="home-footer">
        <div className="footer-content">
          <h3>Learning Approach</h3>
          <div className="approach-grid">
            <div className="approach-item">
              <h4>Interactive Code Editor</h4>
              <p>Type code and see the results in real-time with instant feedback</p>
            </div>
            <div className="approach-item">
              <h4>Visual Learning</h4>
              <p>Understand variable values, scope, and execution flow visually</p>
            </div>
            <div className="approach-item">
              <h4>Progressive Exercises</h4>
              <p>Build knowledge gradually with exercises that increase in complexity</p>
            </div>
            <div className="approach-item">
              <h4>Comprehensive Curriculum</h4>
              <p>Complete course from variables to advanced JavaScript concepts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;