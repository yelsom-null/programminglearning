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

interface BootDevVariablesLessonProps {
  darkMode?: boolean;
}

const BootDevVariablesLesson: React.FC<BootDevVariablesLessonProps> = ({ darkMode = false }) => {
  const [code, setCode] = useState<string>(
`// Task Management App - Part 4: Complete Task System
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
`
  );
  
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
            <pre>
{`// Create a new task manager
const myTaskManager = new TaskManager("Alex");

// Use its methods
myTaskManager.addTask("Learn JavaScript", "high");`}
            </pre>
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
              <pre>
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
              </pre>
            </div>

            <div className="bootdev-code-example compact">
              <h4>Updating Objects</h4>
              <pre>
{`// Object spread for updates
const updatedTask = { 
  ...existingTask, 
  progress: 50,
  priority: "medium"
};`}
              </pre>
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

  return (
    <div className="bootdev-lesson-container">
      <div className="bootdev-lesson-header">
        <h1>Building a Task Manager: Complete System</h1>
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
              <h2>Chapter 2: Advanced Task Management</h2>
              <div className="chapter-nav-buttons">
                <a 
                  href="/lesson/boot-dev-style" 
                  className="chapter-nav-button" 
                  title="Previous: Functions"
                >
                  ← Previous Lesson
                </a>
                <span className="chapter-lesson-indicator">Lesson 4 of 4</span>
                <button 
                  className="chapter-nav-button" 
                  disabled={true}
                  title="This is the last lesson"
                >
                  Next Lesson →
                </button>
              </div>
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