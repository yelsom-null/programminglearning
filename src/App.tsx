import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';
import './App.css';
import './styles/LessonStyles.css';
import './styles/HomePage.css';
import './styles/LessonSidebar.css';
import './styles/DuraluxIntegration.css';
import HomePage from './components/HomePage';
import LessonPlaceholder from './components/LessonPlaceholder';
import VariablesLesson from './lessons/VariablesLesson';
import BasicOperationsLesson from './lessons/BasicOperationsLesson';
import BootDevStyleLesson from './lessons/BootDevStyleLesson';
import BootDevVariablesLesson from './lessons/BootDevVariablesLesson';
import TaskManagerDemoLesson from './lessons/TaskManagerDemoLesson';
import StringConcatenationLesson from './lessons/StringConcatenationLesson';
import NumbersLesson from './lessons/NumbersLesson';
import IncrementDecrementLesson from './lessons/IncrementDecrementLesson';
import ConsoleLesson from './lessons/ConsoleLesson';
import UndefinedLesson from './lessons/UndefinedLesson';
import NullUndefinedLesson from './lessons/NullUndefinedLesson';
import curriculum, { Chapter, Lesson } from './data/curriculum';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const toggleTheme = useCallback(() => {
    setDarkMode((prev) => {
      const newMode = !prev;
      document.body.classList.toggle('dark-theme', newMode);
      return newMode;
    });
  }, []);

  useEffect(() => {
    // Add Duralux CSS to the document head
    const linkBootstrap = document.createElement('link');
    linkBootstrap.rel = 'stylesheet';
    linkBootstrap.type = 'text/css';
    linkBootstrap.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css';
    document.head.appendChild(linkBootstrap);

    const linkFeather = document.createElement('link');
    linkFeather.rel = 'stylesheet';
    linkFeather.href = 'https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.css';
    document.head.appendChild(linkFeather);
    
    const linkBootstrapIcons = document.createElement('link');
    linkBootstrapIcons.rel = 'stylesheet';
    linkBootstrapIcons.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css';
    document.head.appendChild(linkBootstrapIcons);

    // Add scripts
    const scriptFeather = document.createElement('script');
    scriptFeather.src = 'https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js';
    document.body.appendChild(scriptFeather);

    const scriptBootstrap = document.createElement('script');
    scriptBootstrap.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js';
    document.body.appendChild(scriptBootstrap);

    // Initialize feather icons after scripts are loaded
    scriptFeather.onload = () => {
      // @ts-ignore
      feather.replace();
    };

    // Initialize dark mode
    document.body.classList.toggle('dark-theme', darkMode);

    // Clean up function to remove the links when the component unmounts
    return () => {
      document.head.removeChild(linkBootstrap);
      document.head.removeChild(linkFeather);
      document.head.removeChild(linkBootstrapIcons);
      document.body.removeChild(scriptFeather);
      document.body.removeChild(scriptBootstrap);
    };
  }, [darkMode]);

  // Function to get the appropriate lesson component
  const getLessonComponent = (lessonId: string): React.ReactNode => {
    // Find the lesson data
    let foundLesson: Lesson | null = null;
    
    for (const chapter of curriculum) {
      const lesson = chapter.lessons.find(l => l.id === lessonId);
      if (lesson) {
        foundLesson = lesson;
        break;
      }
    }
    
    if (!foundLesson) {
      return <div>Lesson not found</div>;
    }
    
    // Map lesson IDs to their respective components
    switch (lessonId) {
      // Task manager demo
      case 'task-manager-demo':
        return <TaskManagerDemoLesson darkMode={darkMode} />;
        
      // Chapter 1: JavaScript Fundamentals
      case 'variables-intro':
        return <VariablesLesson darkMode={darkMode} moduleId={1} />;
        
      case 'console':
        return <ConsoleLesson darkMode={darkMode} />;
        
      case 'string-concatenation':
        return <StringConcatenationLesson darkMode={darkMode} />;
        
      case 'numbers-in-js':
        return <NumbersLesson darkMode={darkMode} />;
        
      case 'increment-decrement':
        return <IncrementDecrementLesson darkMode={darkMode} />;
        
      case 'undefined-undeclared':
        return <UndefinedLesson darkMode={darkMode} />;
        
      case 'null-undefined':
        return <NullUndefinedLesson darkMode={darkMode} />;
        
      // Chapter 2: Task Operations
      case 'basic-operations':
        return <BasicOperationsLesson darkMode={darkMode} />;
        
      case 'comparison-operators':
        return <BasicOperationsLesson darkMode={darkMode} topic="comparison" />;
        
      case 'logical-operators':
        return <BasicOperationsLesson darkMode={darkMode} topic="logical" />;
      
      // Chapter 3: Task Functions
      case 'function-basics':
      case 'function-parameters':
      case 'return-values':
        return <BootDevStyleLesson darkMode={darkMode} lessonId={lessonId} />;
      
      // Chapter 4: Complete Task System
      case 'object-basics':
      case 'object-methods':
      case 'class-basics':
      case 'task-manager-class':
        return <BootDevVariablesLesson darkMode={darkMode} lessonId={lessonId} />;
      
      default:
        // For any unmapped lesson, show the LessonPlaceholder component
        return (
          <LessonPlaceholder 
            title={foundLesson.title}
            description={foundLesson.description}
            status={foundLesson.status}
            lessonId={foundLesson.id}
          />
        );
    }
  };

  const AppLayout: React.FC = () => {
    const location = useLocation();
    const currentLessonId = location.pathname.startsWith('/lesson/') 
      ? location.pathname.split('/lesson/')[1] 
      : '';
    
    return (
      <div className={darkMode ? 'dark-theme' : ''}>
        {/* Main wrapper */}
        <div className="nxl-main">
          {/* Navigation */}
          <nav className={`nxl-navigation ${isSidebarOpen ? '' : 'nxl-navigation-close'}`}>
            <div className="navbar-wrapper">
              <div className="m-header">
                <a href="/" className="b-brand">
                  {/* Logo */}
                  <span className="logo logo-lg h4 mb-0 text-primary">JS Academy</span>
                  <span className="logo logo-sm h4 mb-0 text-primary">JS</span>
                </a>
              </div>
              
              <div className="navbar-content">
                <ul className="nxl-navbar">
                  <li className="nxl-item nxl-caption">
                    <label>Learning Paths</label>
                  </li>
                  
                  {/* Curriculum Navigation */}
                  {curriculum.map((chapter: Chapter) => (
                    <li key={chapter.id} className="nxl-item nxl-hasmenu">
                      <a 
                        href="#" 
                        className="nxl-link"
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        <span className="nxl-micon">
                          <i data-feather="code"></i>
                        </span>
                        <span className="nxl-mtext">{chapter.title}</span>
                        <span className="nxl-arrow">
                          <i data-feather="chevron-right"></i>
                        </span>
                      </a>
                      <ul className="nxl-submenu">
                        {chapter.lessons.map((lesson: Lesson) => (
                          <li key={lesson.id} className="nxl-item">
                            <a 
                              className={`nxl-link ${currentLessonId === lesson.id ? 'active' : ''}`} 
                              href={`/lesson/${lesson.id}`}
                            >
                              {lesson.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                  
                  {/* Settings */}
                  <li className="nxl-item nxl-hasmenu">
                    <a 
                      href="#" 
                      className="nxl-link"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <span className="nxl-micon">
                        <i data-feather="settings"></i>
                      </span>
                      <span className="nxl-mtext">Settings</span>
                      <span className="nxl-arrow">
                        <i data-feather="chevron-right"></i>
                      </span>
                    </a>
                    <ul className="nxl-submenu">
                      <li className="nxl-item">
                        <a 
                          href="#" 
                          className="nxl-link" 
                          onClick={(e) => {
                            e.preventDefault();
                            toggleTheme();
                          }}
                        >
                          {darkMode ? 'Light Mode' : 'Dark Mode'}
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
                
                <div className="card text-center mt-4">
                  <div className="card-body">
                    <i data-feather="code" className="fs-4 text-primary"></i>
                    <h6 className="mt-4 fw-bolder">JavaScript Academy</h6>
                    <p className="fs-11 my-3">
                      Interactive learning platform for JavaScript programming.
                    </p>
                    <a href="/" className="btn btn-primary w-100">Dashboard</a>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          
          {/* Header */}
          <header className="nxl-header">
            <div className="header-wrapper">
              {/* Header Left */}
              <div className="header-left d-flex align-items-center gap-4">
                {/* Single hamburger button for sidebar toggle */}
                <div className="nxl-sidebar-toggle">
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      toggleSidebar();
                    }}
                    className="sidebar-toggle-btn"
                  >
                    <div className="hamburger hamburger--squeeze">
                      <div className="hamburger-box">
                        <div className="hamburger-inner"></div>
                      </div>
                    </div>
                  </a>
                </div>
                
                {/* Current lesson title */}
                {currentLessonId && (
                  <h5 className="mb-0">
                    {curriculum.find(c => c.lessons.some(l => l.id === currentLessonId))
                      ?.lessons.find(l => l.id === currentLessonId)?.title || 'Lesson'}
                  </h5>
                )}
              </div>
              
              {/* Header Right */}
              <div className="header-right">
                <ul className="navbar-right d-flex align-items-center">
                  {/* Theme toggle */}
                  <li className="nav-item dropdown d-flex align-items-center">
                    <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        toggleTheme();
                      }} 
                      className="px-3"
                    >
                      <i data-feather={darkMode ? "sun" : "moon"} style={{ fontSize: '20px' }}></i>
                    </a>
                  </li>
                  
                  {/* User dropdown */}
                  <li className="nav-item dropdown ps-3 d-flex align-items-center">
                    <a 
                      href="#" 
                      className="nav-link dropdown-toggle" 
                      id="userDropdown" 
                      data-bs-toggle="dropdown" 
                      aria-expanded="false"
                      onClick={(e) => e.preventDefault()}
                    >
                      <div className="avatar-md">
                        <span className="avatar-text avatar-md bg-primary text-white">
                          JS
                        </span>
                      </div>
                    </a>
                    <div className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                      <a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}>
                        <i data-feather="user" className="me-2"></i> Profile
                      </a>
                      <a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}>
                        <i data-feather="settings" className="me-2"></i> Settings
                      </a>
                      <div className="dropdown-divider"></div>
                      <a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}>
                        <i data-feather="log-out" className="me-2"></i> Logout
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </header>
          
          {/* Main content */}
          <div className="nxl-main-content">
            <div className="container-fluid">
              <Routes>
                <Route path="/" element={
                  <div className="row">
                    <div className="col-12">
                      <div className="card">
                        <div className="card-body">
                          <HomePage darkMode={darkMode} onSelectLesson={(id: string) => window.location.href = `/lesson/${id}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                } />
                <Route 
                  path="/lesson/:lessonId" 
                  element={
                    <div className="row">
                      <div className="col-12">
                        <div className="card">
                          <div className="card-body p-0">
                            {currentLessonId && getLessonComponent(currentLessonId)}
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                />
                <Route 
                  path="/chapter/:chapterId" 
                  element={
                    <div className="row">
                      <div className="col-12">
                        <div className="card">
                          <div className="card-body">
                            <div className="p-4">
                              <h2>Chapter Overview</h2>
                              <p>This page is still in development.</p>
                              <a href="/" className="btn btn-primary">Back to Dashboard</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App; 