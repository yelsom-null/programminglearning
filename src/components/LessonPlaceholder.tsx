import React, { useEffect } from 'react';

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
}

const LessonPlaceholder: React.FC<LessonPlaceholderProps> = ({ 
  title, 
  description, 
  status = 'coming-soon' 
}) => {
  
  useEffect(() => {
    // Initialize feather icons when component mounts
    if (window.feather) {
      window.feather.replace();
    }
  }, []);
  
  return (
    <div className="lesson-placeholder p-5">
      <div className="text-center mb-5">
        <div className="mb-4">
          {status === 'coming-soon' && (
            <span className="badge bg-warning text-dark mb-3">Coming Soon</span>
          )}
          {status === 'in-progress' && (
            <span className="badge bg-info text-dark mb-3">In Development</span>
          )}
        </div>
        <h2 className="mb-3">{title}</h2>
        <p className="lead mb-4">{description}</p>
        
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
      </div>
      
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
    </div>
  );
};

export default LessonPlaceholder; 