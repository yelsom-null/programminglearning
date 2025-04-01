import React, { useState } from 'react';
import curriculum, { Chapter, Lesson } from '../data/curriculum';
import '../styles/LessonSidebar.css';

interface LessonSidebarProps {
  darkMode: boolean;
  onSelectLesson: (chapterId: string, lessonId: string) => void;
  activeChapterId?: string;
  activeLessonId?: string;
}

const LessonSidebar: React.FC<LessonSidebarProps> = ({ 
  darkMode, 
  onSelectLesson, 
  activeChapterId,
  activeLessonId
}) => {
  // Track which chapters are expanded
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>(() => {
    // Initialize with active chapter expanded and others collapsed
    const expanded: Record<string, boolean> = {};
    curriculum.forEach(chapter => {
      expanded[chapter.id] = chapter.id === activeChapterId;
    });
    return expanded;
  });
  
  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };
  
  const getChapterStatus = (chapter: Chapter) => {
    const availableLessons = chapter.lessons.filter(lesson => lesson.status === 'available').length;
    
    if (availableLessons === 0) return 'locked';
    if (availableLessons === chapter.lessons.length) return 'completed';
    return 'in-progress';
  };
  
  const getLessonStatusIcon = (lesson: Lesson) => {
    switch (lesson.status) {
      case 'available': return '●';
      case 'in-progress': return '○';
      case 'coming-soon': return '◔';
      default: return '○';
    }
  };

  return (
    <div className={`lesson-sidebar ${darkMode ? 'dark' : 'light'}`}>
      <div className="sidebar-header">
        <h2>Course Content</h2>
      </div>
      
      <nav className="sidebar-navigation">
        <ul className="chapter-list">
          {curriculum.map((chapter) => (
            <li 
              key={chapter.id} 
              className={`chapter-item ${expandedChapters[chapter.id] ? 'expanded' : 'collapsed'} ${chapter.id === activeChapterId ? 'active' : ''}`}
            >
              <div 
                className="chapter-header"
                onClick={() => toggleChapter(chapter.id)}
              >
                <div className="chapter-info">
                  <span className="chapter-number">{chapter.order}</span>
                  <span className="chapter-title">{chapter.title}</span>
                </div>
                <span className="expand-icon">
                  {expandedChapters[chapter.id] ? '▼' : '▶'}
                </span>
              </div>
              
              {expandedChapters[chapter.id] && (
                <ul className="lesson-list">
                  {chapter.lessons.map((lesson) => (
                    <li 
                      key={lesson.id}
                      className={`lesson-item ${lesson.status} ${lesson.id === activeLessonId ? 'active' : ''}`}
                      onClick={() => lesson.status !== 'coming-soon' && onSelectLesson(chapter.id, lesson.id)}
                    >
                      <div className="lesson-info">
                        <span className="lesson-status-icon">
                          {getLessonStatusIcon(lesson)}
                        </span>
                        <span className="lesson-title">
                          {lesson.title}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default LessonSidebar; 