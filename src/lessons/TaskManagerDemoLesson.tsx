import React from 'react';
import '../styles/LessonStyles.css';
import TaskManagerDemo from '../components/TaskManagerDemo';

interface TaskManagerDemoLessonProps {
  darkMode?: boolean;
}

const TaskManagerDemoLesson: React.FC<TaskManagerDemoLessonProps> = ({ darkMode = false }) => {
  return (
    <div className="bootdev-lesson-container">
      <div className="bootdev-lesson-header">
        <h1>Task Manager: Project Overview</h1>
      </div>

      <div className="bootdev-lesson-content">
        <div className="bootdev-theory-panel">
          <div className="bootdev-lesson-section">
            <div className="chapter-navigation">
              <h2>Task Manager Project</h2>
              <div className="chapter-nav-buttons">
                <button 
                  className="chapter-nav-button" 
                  disabled={true}
                  title="This is the introduction"
                >
                  ← Previous
                </button>
                <span className="chapter-lesson-indicator">Introduction</span>
                <a 
                  href="/lesson/variables-intro" 
                  className="chapter-nav-button" 
                  title="Next: Variables Lesson"
                >
                  Start First Lesson →
                </a>
              </div>
            </div>
            
            <h2>Welcome to the Task Manager Project</h2>
            <p>
              In this series of lessons, you'll build a complete task management application 
              using JavaScript. Before we start coding, let's explore what we'll be building.
            </p>
            
            <div className="bootdev-info-box">
              <h4>What You'll Learn</h4>
              <p>Throughout this project, you'll learn:</p>
              <ul>
                <li>Creating and managing variables to represent task data</li>
                <li>Performing calculations on task information (progress, priorities)</li>
                <li>Building functions to manipulate tasks (add, delete, update)</li>
                <li>Creating a complete task management system with classes and objects</li>
              </ul>
            </div>
            
            <h3>The Final Application</h3>
            <p>
              Below is a working demo of the complete application we'll build. Take some time to explore it:
            </p>
            <ul>
              <li>Try adding new tasks</li>
              <li>Mark tasks as complete by checking the checkbox</li>
              <li>Update task progress using the slider</li>
              <li>Delete tasks you no longer need</li>
              <li>Filter tasks by their status</li>
            </ul>
            
            <h3>Project Breakdown</h3>
            <p>
              We'll build this application step by step across four lessons:
            </p>
            
            <div className="bootdev-code-example">
              <h4>Lesson 1: Task Variables</h4>
              <p>Learn how to represent task data using variables of different types.</p>
              <pre>{`// Task variables example
let taskName = "Complete JavaScript tutorial";
let isCompleted = false;
let priority = "high";
let percentComplete = 25;`}</pre>
            </div>
            
            <div className="bootdev-code-example">
              <h4>Lesson 2: Task Operations</h4>
              <p>Perform calculations on task data to create useful metrics.</p>
              <pre>{`// Calculate remaining hours
let task1RemainingHours = task1Hours * (100 - task1Progress) / 100;

// Calculate priority score
let task1Score = task1Priority * (100 - task1Progress) / 100;`}</pre>
            </div>
            
            <div className="bootdev-code-example">
              <h4>Lesson 3: Task Functions</h4>
              <p>Create functions to manage task operations.</p>
              <pre>{`// Function to add a new task
function addTask(name, priority = "medium", hours = 1) {
  const newTask = {
    id: tasks.length + 1,
    name: name,
    completed: false,
    priority: priority,
    hours: hours,
    progress: 0
  };
  tasks.push(newTask);
  return newTask;
}`}</pre>
            </div>
            
            <div className="bootdev-code-example">
              <h4>Lesson 4: Complete Task System</h4>
              <p>Build a comprehensive task management system with classes.</p>
              <pre>{`// Task Manager Class
class TaskManager {
  constructor(userName) {
    this.userName = userName;
    this.tasks = [];
    this.categories = ["Work", "Personal", "Learning", "Health"];
  }
  
  // Methods to manage tasks
  addTask(name, category, priority, hours) {
    // Implementation
  }
  
  getStatistics() {
    // Return task statistics
  }
}`}</pre>
            </div>
            
            <div className="bootdev-info-box">
              <h4>Ready to Begin?</h4>
              <p>
                Now that you have a good understanding of what we're building, 
                click the "Start First Lesson" button above to begin your journey 
                to building this task manager app!
              </p>
            </div>
          </div>
        </div>
        
        <div className="bootdev-practice-panel demo-panel">
          <div className="demo-container">
            <h3 className="demo-title">Interactive Demo</h3>
            <p className="demo-description">
              Try out the task manager application we'll be building:
            </p>
            
            <TaskManagerDemo />
            
            <div className="demo-explanation">
              <p>
                This working demo shows the complete application with all features.
                As you progress through the lessons, you'll learn how to build each part 
                of this application, from basic task variables to the complete system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManagerDemoLesson; 