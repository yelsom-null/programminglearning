import React, { useState, ReactNode } from 'react';
import LessonSidebar from './LessonSidebar';
import '../styles/LessonLayout.css';

interface LessonLayoutProps {
  children: ReactNode;
  darkMode: boolean;
  onSelectLesson: (chapterId: string, lessonId: string) => void;
  activeChapterId?: string;
  activeLessonId?: string;
}

const LessonLayout: React.FC<LessonLayoutProps> = ({
  children,
  darkMode,
  onSelectLesson,
  activeChapterId,
  activeLessonId
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className={`lesson-layout ${darkMode ? 'dark' : 'light'}`}>
      {/* Main sidebar toggle (inside sidebar) */}
      <button 
        className="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        style={{ display: isSidebarOpen ? 'flex' : 'none' }}
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>
      
      {/* Collapsed state toggle (fixed to left edge when sidebar is closed) */}
      <button
        className={`sidebar-collapsed-toggle ${isSidebarOpen ? 'hidden' : ''}`}
        onClick={toggleSidebar}
        aria-label="Open sidebar"
      >
        ☰
      </button>
      
      {/* Sidebar */}
      <div className={`lesson-layout-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <LessonSidebar 
          darkMode={darkMode}
          onSelectLesson={onSelectLesson}
          activeChapterId={activeChapterId}
          activeLessonId={activeLessonId}
        />
      </div>
      
      {/* Main content */}
      <div className="lesson-layout-content" style={{ 
        marginLeft: isSidebarOpen ? '0' : '0',
        width: isSidebarOpen ? 'calc(100% - 280px)' : '100%'
      }}>
        {children}
      </div>
    </div>
  );
};

export default LessonLayout; 