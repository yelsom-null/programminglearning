import React, { useState, useEffect } from 'react';
import CodeEditor from '../components/CodeEditor';
import { 
  evaluateCodeSafely, 
  evaluateCodeWithAI,
  isStringifiedClassInstance,
  parseStringifiedClass
} from '../utils/codeAnalysis';
import '../styles/LessonStyles.css';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';
import curriculum from '../data/curriculum';

interface BootDevVariablesLessonProps {
  darkMode?: boolean;
  lessonId?: string;
}

const BootDevVariablesLesson: React.FC<BootDevVariablesLessonProps> = ({ 
  darkMode = false,
  lessonId
}) => {
  const [code, setCode] = useState<string>('');
  
  // Set code based on lessonId when component mounts
  useEffect(() => {
    // Default task manager class code
    let initialCode = `// Task Management App - Part 4: Complete Task System
// Let's combine everything into a complete task management system

// Task Manager Class
class TaskManager {
  constructor(userName) {
    this.userName = userName;
    this.tasks = [];
    this.lastId = 0;
    this.categories = ["Work", "Personal", "Learning", "Health"];
  }
  
  // Add a new task
  addTask(name, category = "Work", priority = "medium", hours = 1) {
    this.lastId++;
    const newTask = {
      id: this.lastId,
      name: name,
      category: category,
      completed: false,
      priority: priority,
      hours: hours,
      progress: 0,
      createdDate: new Date().toISOString().split('T')[0],
      dueDate: null
    };
    this.tasks.push(newTask);
    return newTask;
  }
  
  // Update a task
  updateTask(taskId, updates) {
    const index = this.tasks.findIndex(task => task.id === taskId);
    if (index !== -1) {
      // Merge the existing task with updates
      this.tasks[index] = { ...this.tasks[index], ...updates };
      return this.tasks[index];
    }
    return null; // Task not found
  }
  
  // Delete a task
  deleteTask(taskId) {
    const index = this.tasks.findIndex(task => task.id === taskId);
    if (index !== -1) {
      const deletedTask = this.tasks[index];
      this.tasks.splice(index, 1);
      return deletedTask;
    }
    return null; // Task not found
  }
  
  // Mark task as complete
  completeTask(taskId) {
    return this.updateTask(taskId, { 
      completed: true, 
      progress: 100,
      completedDate: new Date().toISOString().split('T')[0]
    });
  }
  
  // Set task due date
  setDueDate(taskId, dueDate) {
    return this.updateTask(taskId, { dueDate: dueDate });
  }
  
  // Get tasks by category
  getTasksByCategory(category) {
    return this.tasks.filter(task => task.category === category);
  }
  
  // Get tasks by priority
  getTasksByPriority(priority) {
    return this.tasks.filter(task => task.priority === priority);
  }
  
  // Get completion statistics
  getStatistics() {
    const completed = this.tasks.filter(task => task.completed).length;
    const total = this.tasks.length;
    const completionRate = total > 0 ? (completed / total * 100) : 0;
    
    const categoryStats = {};
    this.categories.forEach(category => {
      const categoryTasks = this.getTasksByCategory(category);
      categoryStats[category] = {
        total: categoryTasks.length,
        completed: categoryTasks.filter(task => task.completed).length
      };
    });
    
    return {
      totalTasks: total,
      completedTasks: completed,
      completionRate: completionRate,
      byCategory: categoryStats
    };
  }
}

// Create a new task manager
const myTaskManager = new TaskManager("Alex");

// Add some tasks
myTaskManager.addTask("Complete JavaScript course", "Learning", "high", 10);
myTaskManager.addTask("Exercise", "Health", "medium", 1);
myTaskManager.addTask("Grocery shopping", "Personal", "low", 2);
myTaskManager.addTask("Prepare presentation", "Work", "high", 4);

// Update some tasks
myTaskManager.updateTask(1, { progress: 60 });
myTaskManager.setDueDate(1, "2023-04-15");
myTaskManager.completeTask(2);

// Delete a task
myTaskManager.deleteTask(3);

// Show task summary
console.log(\`Task Manager for \${myTaskManager.userName}\`);
console.log(\`Total Tasks: \${myTaskManager.tasks.length}\`);

// Display tasks by category
console.log("\\nTasks by Category:");
myTaskManager.categories.forEach(category => {
  const categoryTasks = myTaskManager.getTasksByCategory(category);
  if (categoryTasks.length > 0) {
    console.log(\`\\n\${category} (\${categoryTasks.length}):\`);
    categoryTasks.forEach(task => {
      console.log(\`  - \${task.name} (\${task.completed ? 'Completed' : task.progress + '%'})\`);
    });
  }
});

// Get statistics
const stats = myTaskManager.getStatistics();
console.log("\\nCompletion Rate:", stats.completionRate.toFixed(1) + "%");

// Try extending the task manager with your own methods and tasks!
`;

    // Specific content based on lessonId
    if (lessonId === 'object-basics') {
      initialCode = `// Task Manager: Task Objects
// Learn how to use objects to represent tasks

// Creating a simple task object
const task1 = {
  id: 1,
  name: "Complete JavaScript course",
  description: "Finish all lessons and exercises",
  priority: "high",
  completed: false,
  dueDate: "2023-12-31",
  category: "Learning",
  tags: ["programming", "education"]
};

// Accessing object properties
console.log("Task name:", task1.name);
console.log("Priority:", task1.priority);
console.log("Due date:", task1.dueDate);

// Modifying object properties
task1.priority = "medium";
task1.progress = 75; // Adding a new property

console.log("Updated task:", task1);

// Object methods
const task2 = {
  id: 2,
  name: "Write project documentation",
  completed: false,
  priority: "medium",
  
  // Method to mark as complete
  markComplete: function() {
    this.completed = true;
    console.log(this.name + " marked as complete");
  },
  
  // Method to change priority
  setPriority: function(newPriority) {
    this.priority = newPriority;
    console.log(this.name + " priority changed to " + newPriority);
  }
};

// Using the object methods
task2.setPriority("high");
task2.markComplete();

console.log("Task 2 after updates:", task2);

// Creating multiple task objects
const tasks = [
  {
    id: 1,
    name: "Complete JavaScript course",
    completed: false,
    priority: "high"
  },
  {
    id: 2,
    name: "Write project documentation",
    completed: true,
    priority: "medium"
  },
  {
    id: 3,
    name: "Prepare presentation",
    completed: false,
    priority: "high"
  }
];

// Working with arrays of objects
console.log("\\nAll tasks:");
for (let i = 0; i < tasks.length; i++) {
  const statusText = tasks[i].completed ? "✓" : "□";
  console.log(\`\${statusText} \${tasks[i].name} (\${tasks[i].priority})\`);
}

// Filtering objects
const highPriorityTasks = tasks.filter(task => task.priority === "high");
console.log("\\nHigh priority tasks:", highPriorityTasks);

// Try creating your own task objects with different properties and methods!
`;
    } else if (lessonId === 'object-methods') {
      initialCode = `// Task Manager: Object Methods
// Learn to add functionality to your task objects

// Create a task object with methods
const task = {
  id: 1,
  name: "Build task manager app",
  description: "Create a task management application with JavaScript",
  priority: "high",
  completed: false,
  createdDate: new Date(),
  dueDate: new Date("2023-12-31"),
  progress: 25,
  timeEstimate: 10, // hours
  
  // Method to update progress
  updateProgress: function(newProgress) {
    if (newProgress < 0 || newProgress > 100) {
      console.log("Progress must be between 0 and 100");
      return false;
    }
    
    this.progress = newProgress;
    
    // Auto-complete when progress reaches 100%
    if (newProgress === 100) {
      this.completed = true;
    }
    
    console.log(\`Progress updated to \${newProgress}%\`);
    return true;
  },
  
  // Method to calculate remaining time
  getRemainingTime: function() {
    const remainingHours = this.timeEstimate * (100 - this.progress) / 100;
    return remainingHours.toFixed(1);
  },
  
  // Method to check if task is overdue
  isOverdue: function() {
    if (this.completed) return false;
    
    const today = new Date();
    return today > this.dueDate;
  },
  
  // Method to get task summary
  getSummary: function() {
    const status = this.completed ? "Completed" : 
                   this.isOverdue() ? "Overdue" : 
                   \`In Progress (\${this.progress}%)\`;
    
    return {
      name: this.name,
      priority: this.priority,
      status: status,
      remainingTime: this.getRemainingTime() + " hours"
    };
  }
};

// Using the task object methods
console.log("Task:", task.name);
console.log("Initial progress:", task.progress + "%");
console.log("Initial remaining time:", task.getRemainingTime() + " hours");

// Update progress
task.updateProgress(50);
console.log("New remaining time:", task.getRemainingTime() + " hours");

// Check if overdue
console.log("Is task overdue?", task.isOverdue());

// Get task summary
const summary = task.getSummary();
console.log("Task summary:", summary);

// Creating a task with shorthand method syntax (ES6+)
const modernTask = {
  id: 2,
  name: "Learn object methods",
  progress: 80,
  timeEstimate: 2,
  
  // Shorthand method syntax
  complete() {
    this.progress = 100;
    console.log(this.name + " completed!");
  },
  
  getRemainingHours() {
    return this.timeEstimate * (100 - this.progress) / 100;
  }
};

console.log("\\nModern task remaining hours:", modernTask.getRemainingHours());
modernTask.complete();

// Try creating your own task objects with methods!
`;
    } else if (lessonId === 'class-basics') {
      initialCode = `// Task Manager: Classes
// Learn how to create a Task class

// Define a Task class
class Task {
  constructor(id, name, priority = "medium") {
    this.id = id;
    this.name = name;
    this.priority = priority;
    this.completed = false;
    this.progress = 0;
    this.createdDate = new Date();
    this.dueDate = null;
  }
  
  // Method to update progress
  updateProgress(newProgress) {
    if (newProgress < 0 || newProgress > 100) {
      console.log("Progress must be between 0 and 100");
      return false;
    }
    
    this.progress = newProgress;
    
    // Auto-complete when progress reaches 100%
    if (newProgress === 100) {
      this.completed = true;
    }
    
    return true;
  }
  
  // Method to mark as complete
  complete() {
    this.completed = true;
    this.progress = 100;
  }
  
  // Method to set due date
  setDueDate(dateString) {
    this.dueDate = new Date(dateString);
  }
  
  // Method to check if task is overdue
  isOverdue() {
    if (this.completed || !this.dueDate) return false;
    
    const today = new Date();
    return today > this.dueDate;
  }
  
  // Method to get human-readable status
  getStatus() {
    if (this.completed) return "Completed";
    if (this.isOverdue()) return "Overdue";
    if (this.progress > 0) return \`In Progress (\${this.progress}%)\`;
    return "Not Started";
  }
  
  // Method to get formatted due date
  getFormattedDueDate() {
    if (!this.dueDate) return "No due date";
    return this.dueDate.toLocaleDateString();
  }
  
  // Method to get task summary
  getSummary() {
    return \`Task #\${this.id}: \${this.name} - \${this.getStatus()}\`;
  }
}

// Creating instances of the Task class
const task1 = new Task(1, "Complete JavaScript tutorial", "high");
const task2 = new Task(2, "Prepare presentation");

console.log("Task 1:", task1);
console.log("Task 2:", task2);

// Using Task methods
task1.updateProgress(75);
task1.setDueDate("2023-12-31");

task2.complete();

// Getting task information
console.log("\\nTask Summaries:");
console.log(task1.getSummary());
console.log(task2.getSummary());

console.log("\\nTask 1 Status:", task1.getStatus());
console.log("Task 1 Due Date:", task1.getFormattedDueDate());
console.log("Task 1 Overdue:", task1.isOverdue());

// Creating an array of tasks
const tasks = [
  new Task(1, "Learn JavaScript", "high"),
  new Task(2, "Build a project", "medium"),
  new Task(3, "Write documentation", "low")
];

tasks[0].updateProgress(60);
tasks[1].updateProgress(25);
tasks[2].complete();

// Display all tasks
console.log("\\nAll Tasks:");
tasks.forEach(task => {
  console.log(\`- \${task.name} (\${task.getStatus()})\`);
});

// Try creating your own Task class with additional properties and methods!
`;
    } else if (lessonId === 'task-manager-class') {
      // Use the default task manager class code
    }
    
    setCode(initialCode);
  }, [lessonId]);
  
  const [runtimeValues, setRuntimeValues] = useState<Record<string, any>>({});
  const [consoleOutput, setConsoleOutput] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAutoExecute, setIsAutoExecute] = useState<boolean>(true);
  const [currentTheorySection, setCurrentTheorySection] = useState<number>(0);
  
  useEffect(() => {
    if (isAutoExecute) {
      executeCode();
    }
  }, [code, isAutoExecute]);

  const executeCode = async () => {
    setError(null);
    
    try {
      // Use AI-enhanced evaluation with fallback to standard
      const result = await evaluateCodeWithAI(code);
      
      if (result.variables) {
        setRuntimeValues(result.variables);
      }
      
      if (result.consoleOutput) {
        setConsoleOutput(Array.isArray(result.consoleOutput) 
          ? result.consoleOutput 
          : [result.consoleOutput]);
      } else {
        setConsoleOutput([]);
      }
      
      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const getValueType = (value: any): string => {
    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    
    // Check for class instances
    if (typeof value === 'object' && value?.__isClass) {
      return 'class';
    }
    
    // Check for stringified class instances
    if (typeof value === 'string' && isStringifiedClassInstance(value).isClass) {
      return 'class';
    }
    
    if (typeof value === 'object') return 'object';
    return typeof value;
  };

  const getTypeColor = (type: string): string => {
    switch(type) {
      case 'string': return 'success';
      case 'number': return 'primary';
      case 'boolean': return 'warning';
      case 'array': return 'danger';
      case 'object': return 'info';
      case 'function': return 'secondary';
      default: return 'light';
    }
  };

  const getTypeExplanation = (type: string): string => {
    switch(type) {
      case 'string': return 'string';
      case 'number': return 'number';
      case 'boolean': return 'boolean';
      case 'array': return 'array';
      case 'object': return 'object';
      case 'class': return 'instance';
      case 'function': return 'action';
      case 'undefined': return 'no value';
      case 'null': return 'empty';
      default: return type;
    }
  };

  const formatValue = (value: any): string => {
    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    
    // Handle stringified class instances
    if (typeof value === 'string' && isStringifiedClassInstance(value).isClass) {
      // Return the original string since it's already formatted nicely
      return value;
    }
    
    if (typeof value === 'string') return `"${value}"`;
    if (typeof value === 'object') {
      try {
        // Don't include internal properties in the formatted output
        if (value?.__isClass || value?.__constructorName) {
          const cleanedValue = { ...value };
          delete cleanedValue.__isClass;
          delete cleanedValue.__constructorName;
          return JSON.stringify(cleanedValue);
        }
        return JSON.stringify(value);
      } catch (e) {
        return `${value}`;
      }
    }
    return `${value}`;
  };
  
  const theoryContent = [
    // Section 0: Introduction
    {
      title: "Building a Complete Task Manager",
      content: (
        <>
          <p className="compact">
            We've reached the final lesson! Now we're going to combine everything we've 
            learned to build a complete task management system, just like the one you saw 
            in the demo at the beginning.
          </p>
          
          <div className="bootdev-info-box">
            <h4>Bringing It All Together</h4>
            <p>Throughout this project, we've learned:</p>
            <ul>
              <li><strong>Lesson 1:</strong> Task variables for storing information</li>
              <li><strong>Lesson 2:</strong> Operations to calculate metrics and priority</li>
              <li><strong>Lesson 3:</strong> Functions to manipulate tasks</li>
              <li><strong>Lesson 4 (current):</strong> Building a complete system</li>
          </ul>
            <p>Now we'll organize everything into a cohesive system using classes.</p>
          </div>
          
          <p className="compact">
            By the end of this lesson, you'll understand how all the pieces fit together 
            to create the functional task manager you saw in the demo.
          </p>
        </>
      )
    },
    // Section 1: Classes in JavaScript
    {
      title: "Using Classes for Our Task Manager",
      content: (
        <>
          <p className="compact">
            A class is a blueprint for creating objects with pre-defined properties and methods.
          </p>
          
            <div className="bootdev-code-example compact">
            <h4>Task Manager Class</h4>
              <pre>
{`class TaskManager {
  constructor(userName) {
    this.userName = userName;
    this.tasks = [];  // Array to store tasks
  }
  
  // Methods to manage tasks
  addTask(name, priority) {
    // Implementation here
  }
}`}
              </pre>
            </div>

            <div className="bootdev-code-example compact">
            <h4>Creating an Instance</h4>
              
{`// Create a new task manager
const myTaskManager = new TaskManager("Alex");

// Use its methods
myTaskManager.addTask("Learn JavaScript", "high");`}
              
          </div>
        </>
      )
    },
    // Section 2: Advanced Object Handling
    {
      title: "Working with Task Objects",
      content: (
        <>
          <p>Each task in our system is an object with properties:</p>
          
          <div className="theory-grid-layout">
            <div className="bootdev-code-example compact">
              <h4>Task Object Structure</h4>
              
{`// A task object
{
  id: 1,
  name: "Complete project",
  category: "Work",
  completed: false,
  priority: "high",
  progress: 25,
  hours: 4,
  createdDate: "2023-04-01",
  dueDate: "2023-04-15"
}`}
            
            </div>

            <div className="bootdev-code-example compact">
              <h4>Updating Objects</h4>
              
{`// Object spread for updates
const updatedTask = { 
  ...existingTask, 
  progress: 50,
  priority: "medium"
};`}
              
            </div>
          </div>
        </>
      )
    },
    // Section 3: Array Methods
    {
      title: "Using Array Methods for Tasks",
      content: (
        <>
          <p className="compact">
            JavaScript array methods are powerful for managing collections of tasks:
          </p>
          
          <div className="theory-grid-layout">
            <div className="bootdev-code-example compact">
              <h4>Filtering Tasks</h4>
              <pre>
{`// Get incomplete tasks
const incompleteTasks = tasks.filter(
  task => !task.completed
);

// High priority tasks
const highPriorityTasks = tasks.filter(
  task => task.priority === "high"
);`}
              </pre>
            </div>

            <div className="bootdev-code-example compact">
              <h4>Finding & Transforming</h4>
              <pre>
{`// Find a specific task
const task = tasks.find(
  task => task.id === taskId
);

// Map tasks to names only
const taskNames = tasks.map(
  task => task.name
);`}
              </pre>
            </div>
          </div>
        </>
      )
    },
    // Section 4: Building Reusable Systems
    {
      title: "Building a Reusable System",
      content: (
        <>
          <p className="compact">
            Our task manager demonstrates how to build a reusable system with organized code:
          </p>
          
          <div className="bootdev-info-box">
            <h4>System Design Principles</h4>
            <ul>
              <li><strong>Encapsulation</strong>: Group related data and operations together</li>
              <li><strong>Abstraction</strong>: Hide implementation details behind simple interfaces</li>
              <li><strong>Modularity</strong>: Build complex systems from simple, reusable pieces</li>
              <li><strong>Separation of Concerns</strong>: Each part of the system has a focused purpose</li>
            </ul>
            </div>

          <p className="compact">
            These principles help us build maintainable code that can grow with our needs.
          </p>
        </>
      )
    },
    // Section 5: Next Steps
    {
      title: "Next Steps and Extensions",
      content: (
        <>
          <p className="compact">
            Our task manager can be extended in many ways:
          </p>
          
          <div className="theory-grid-layout">
            <div className="bootdev-code-example compact">
              <h4>Persistence</h4>
              <pre>
{`// Save tasks to localStorage
saveToStorage() {
  localStorage.setItem(
    'tasks', 
    JSON.stringify(this.tasks)
  );
}

// Load tasks from storage
loadFromStorage() {
  const saved = localStorage.getItem('tasks');
  if (saved) {
    this.tasks = JSON.parse(saved);
  }
}`}
              </pre>
            </div>

            <div>
              <h4>More Extensions:</h4>
              <ul>
                <li><strong>Task Dependencies</strong>: Tasks that depend on others</li>
                <li><strong>Recurring Tasks</strong>: Tasks that repeat on a schedule</li>
                <li><strong>Collaborators</strong>: Assign tasks to different people</li>
                <li><strong>Notifications</strong>: Alerts for upcoming deadlines</li>
                <li><strong>Task Templates</strong>: Create common task patterns</li>
              </ul>
            </div>
          </div>
        </>
      )
    }
  ];
  
  const goToNextTheorySection = () => {
    if (currentTheorySection < theoryContent.length - 1) {
      setCurrentTheorySection(currentTheorySection + 1);
    }
  };
  
  const goToPrevTheorySection = () => {
    if (currentTheorySection > 0) {
      setCurrentTheorySection(currentTheorySection - 1);
    }
  };

  // Add navigation component
  const LessonNavigation = () => {
    // Find current lesson in curriculum
    const currentLessonId = lessonId || 'task-manager-class';
    
    let prevLesson = null;
    let nextLesson = null;
    let currentChapter = null;
    let currentLessonIndex = -1;
    
    // Find current chapter and lesson
    for (const chapter of curriculum) {
      const lessonIndex = chapter.lessons.findIndex(l => l.id === currentLessonId);
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
      <div className="chapter-nav-buttons">
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
        
        <span className="chapter-lesson-indicator">
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
    );
  };

  return (
    <div className="bootdev-lesson-container">
      <div className="bootdev-lesson-header">
        <h1>Building a Complete Task Manager</h1>
        <div className="bootdev-lesson-controls">
          <label className="auto-execute-toggle">
            <input 
              type="checkbox" 
              checked={isAutoExecute} 
              onChange={() => setIsAutoExecute(!isAutoExecute)} 
            />
            Auto-Run Code
          </label>
          {!isAutoExecute && (
            <button 
              className="execute-button" 
              onClick={executeCode}
            >
              Run Code
            </button>
          )}
        </div>
      </div>

      <div className="bootdev-lesson-content">
        <div className="bootdev-theory-panel">
          <div className="bootdev-lesson-section">
            <div className="chapter-navigation">
              <h2>Chapter 3: Complete Task System</h2>
              <LessonNavigation />
            </div>
            
            <h2>{theoryContent[currentTheorySection].title}</h2>
            
            <div className="theory-content">
              {theoryContent[currentTheorySection].content}
            </div>
            
            <div className="theory-navigation">
              <button 
                className="nav-button prev-button" 
                onClick={goToPrevTheorySection}
                disabled={currentTheorySection === 0}
              >
                ← Previous
              </button>
              <span className="theory-pagination">
                {currentTheorySection + 1} / {theoryContent.length}
              </span>
              <button 
                className="nav-button next-button" 
                onClick={goToNextTheorySection}
                disabled={currentTheorySection === theoryContent.length - 1}
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        <div className="bootdev-practice-panel">
          <div className="bootdev-editor-section">
            <div className="bootdev-code-editor">
              <CodeEditor
                value={code}
                onChange={setCode}
                darkMode={darkMode}
              />
            </div>
            
            {error && (
              <div className="bootdev-error-message">
                {error}
              </div>
            )}
          </div>
          
          <div className="bootdev-output-section" style={{ gridTemplateColumns: "1fr", maxHeight: "none" }}>
            <div className="bootdev-output-panel" style={{ width: "100%" }}>
              <h3>Output</h3>
              <div className="bootdev-console-output" style={{ maxHeight: "none" }}>
                {consoleOutput.length > 0 ? (
                  consoleOutput.map((output, index) => (
                    <div key={index} className="bootdev-console-line">
                      {formatValue(output)}
                    </div>
                  ))
                ) : (
                  <div className="bootdev-empty-state">
                    <p>Your code output will appear here.</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bootdev-variables-panel" style={{ width: "100%" }}>
              <h3>Variables</h3>
              {Object.entries(runtimeValues).length > 0 ? (
                <Row xs={1} className="g-3 justify-content-center">
                  {Object.entries(runtimeValues).map(([name, value]) => {
                    const type = getValueType(value);
                    return (
                      <Col key={name} className="">
                        <Card className={`variable-card type-${type}`}>
                          <Card.Header className="variable-name d-flex justify-content-between align-items-center">
                            {name}
                            {value?.aiDescription && (
                              <Badge bg="info" pill title={value.aiDescription}>
                                <i className="bi bi-magic"></i> AI
                              </Badge>
                            )}
                          </Card.Header>
                          <Card.Body>
                            <Card.Title>{getTypeExplanation(type)}</Card.Title>
                            <Card.Text className="variable-value">{formatValue(value)}</Card.Text>
                            
                            {/* Display class name if available */}
                            {type === 'class' && (
                              <>
                                {value?.__constructorName && (
                                  <div className="class-name">
                                    {value.__constructorName}
                                  </div>
                                )}
                                {typeof value === 'string' && isStringifiedClassInstance(value).isClass && (
                                  <div className="class-name">
                                    {isStringifiedClassInstance(value).className}
                                  </div>
                                )}
                              </>
                            )}
                            
                            {/* Display class properties if it's a class instance */}
                            {type === 'class' && (
                              <div className="class-properties">
                                {typeof value === 'object' ? (
                                  // Regular object with properties
                                  Object.entries(value)
                                    .filter(([key]) => !key.startsWith('__')) // Skip internal properties
                                    .slice(0, 5) // Limit to first 5 properties
                                    .map(([key, propValue]) => (
                                      <div key={key} className="class-property">
                                        <span className="class-property-name">{key}:</span>
                                        <span className="class-property-value">
                                          {typeof propValue === 'object' 
                                            ? (propValue === null ? 'null' : '{...}') 
                                            : String(propValue)}
                                        </span>
                                      </div>
                                    ))
                                ) : (
                                  // Stringified class - display a simplified view
                                  <div className="class-property text-center">
                                    <small>Class instance properties visible in value</small>
                                  </div>
                                )}
                                
                                {typeof value === 'object' && 
                                 Object.keys(value).filter(k => !k.startsWith('__')).length > 5 && (
                                  <div className="class-property text-center">
                                    <small>...more properties</small>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            <div className="variable-type-container mt-2">
                              <span className={`variable-type-badge bg-${getTypeColor(type)}`}>
                                {getTypeExplanation(type)}
                              </span>
                            </div>
                            
                            {value?.aiDescription && (
                              <div className="ai-explanation mt-2">
                                <small className="text-muted">{value.aiDescription}</small>
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              ) : (
                <div className="bootdev-empty-state">
                  <p>No variables created yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BootDevVariablesLesson; 