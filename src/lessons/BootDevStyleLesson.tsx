import React, { useState, useEffect } from 'react';
import CodeEditor from '../components/CodeEditor';
import { evaluateCodeSafely } from '../utils/codeAnalysis';
import '../styles/LessonStyles.css';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import curriculum from '../data/curriculum';

interface BootDevStyleLessonProps {
  darkMode?: boolean;
  lessonId?: string;
}

const BootDevStyleLesson: React.FC<BootDevStyleLessonProps> = ({ 
  darkMode = false,
  lessonId
}) => {
  const [code, setCode] = useState<string>('');
  
  // Set code based on lessonId when component mounts
  useEffect(() => {
    // Default function lesson code
    let initialCode = `// Task Management App - Part 3: Task Functions
// Let's create functions to manage our tasks

// Our task collection
const tasks = [
  { id: 1, name: "Complete JavaScript tutorial", completed: false, priority: "high", hours: 3.5, progress: 25 },
  { id: 2, name: "Build task manager app", completed: false, priority: "medium", hours: 5, progress: 10 }
];

// Function to add a new task
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
}

// Function to mark a task as complete
function completeTask(taskId) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === taskId) {
      tasks[i].completed = true;
      tasks[i].progress = 100;
      return tasks[i];
    }
  }
  return null; // Task not found
}

// Function to update task progress
function updateProgress(taskId, newProgress) {
  // Find the task with the given id
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === taskId) {
      tasks[i].progress = newProgress;
      // If progress is 100%, mark as completed
      if (newProgress >= 100) {
        tasks[i].completed = true;
        tasks[i].progress = 100;
      }
      return tasks[i];
    }
  }
  return null; // Task not found
}

// Let's use our functions
addTask("Create project documentation", "low", 2);
updateProgress(1, 50); // Update first task progress to 50%
completeTask(2);       // Mark second task as complete

// Display all tasks
console.log("All Tasks:");
for (let i = 0; i < tasks.length; i++) {
  const status = tasks[i].completed ? "Completed" : "In Progress";
  console.log(\`\${tasks[i].id}. \${tasks[i].name} (\${status}) - \${tasks[i].progress}% complete\`);
}

// Try adding more tasks or creating new task management functions!
`;

    // Specific content based on lessonId
    if (lessonId === 'function-parameters') {
      initialCode = `// Task Manager: Function Parameters
// Learn how to pass information to functions

// Task data
const tasks = [
  { id: 1, name: "Complete JavaScript course", priority: "high", hours: 3.5 },
  { id: 2, name: "Prepare presentation", priority: "medium", hours: 2 }
];

// Function with parameters
function calculateRemainingHours(totalHours, progressPercent) {
  return totalHours * (100 - progressPercent) / 100;
}

// Using the function with different arguments
let task1RemainingHours = calculateRemainingHours(3.5, 25);
let task2RemainingHours = calculateRemainingHours(2, 50);

console.log("Task 1 remaining hours:", task1RemainingHours);
console.log("Task 2 remaining hours:", task2RemainingHours);

// Function with default parameters
function addTask(name, priority = "medium", hours = 1, progress = 0) {
  const newTask = {
    id: tasks.length + 1,
    name: name,
    priority: priority,
    hours: hours,
    progress: progress
  };
  tasks.push(newTask);
  return newTask;
}

// Using with all parameters
let task3 = addTask("Review code", "high", 1.5, 0);
console.log("Added task with all parameters:", task3);

// Using with default parameters
let task4 = addTask("Team meeting");
console.log("Added task with defaults:", task4);

// Function that takes an object parameter
function updateTask(taskId, updates) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === taskId) {
      // Merge the task with the updates
      Object.assign(tasks[i], updates);
      return tasks[i];
    }
  }
  return null; // Task not found
}

// Using object parameter for flexible updates
updateTask(1, { progress: 50, priority: "medium" });
updateTask(2, { hours: 3 });

console.log("Updated tasks:", tasks);

// Try creating your own functions with different parameter patterns!
`;
    } else if (lessonId === 'return-values') {
      initialCode = `// Task Manager: Function Return Values
// Learn how to get results from functions

// Task data
const tasks = [
  { id: 1, name: "Complete JavaScript course", priority: "high", hours: 3.5, progress: 60 },
  { id: 2, name: "Prepare presentation", priority: "medium", hours: 2, progress: 25 },
  { id: 3, name: "Team meeting", priority: "low", hours: 1, progress: 0 }
];

// Function that returns a value
function calculateRemainingHours(task) {
  if (!task) return 0;
  return task.hours * (100 - task.progress) / 100;
}

// Using the returned value
const task1 = tasks[0];
const remainingHours = calculateRemainingHours(task1);
console.log(\`Task "\${task1.name}" has \${remainingHours.toFixed(1)} hours remaining\`);

// Function that returns an object
function getTaskStats() {
  let totalTasks = tasks.length;
  let completedTasks = 0;
  let totalHours = 0;
  let remainingHours = 0;
  
  for (let i = 0; i < tasks.length; i++) {
    totalHours += tasks[i].hours;
    remainingHours += calculateRemainingHours(tasks[i]);
    
    if (tasks[i].progress === 100) {
      completedTasks++;
    }
  }
  
  return {
    total: totalTasks,
    completed: completedTasks,
    completionRate: (completedTasks / totalTasks) * 100,
    totalHours: totalHours,
    remainingHours: remainingHours
  };
}

// Using the returned object
const stats = getTaskStats();
console.log("Task Statistics:");
console.log(\`- \${stats.completed} of \${stats.total} tasks completed (\${stats.completionRate.toFixed(0)}%)\`);
console.log(\`- \${stats.remainingHours.toFixed(1)} hours of work remaining\`);

// Function that returns a function (advanced)
function createPriorityFilter(priorityLevel) {
  // Return a function that filters tasks by the priority
  return function(task) {
    return task.priority === priorityLevel;
  };
}

// Using the returned function
const highPriorityFilter = createPriorityFilter("high");
const highPriorityTasks = tasks.filter(highPriorityFilter);

console.log("High priority tasks:", highPriorityTasks);

// Early returns for validation
function updateTaskProgress(taskId, newProgress) {
  // Validate input
  if (newProgress < 0 || newProgress > 100) {
    return { success: false, message: "Progress must be between 0 and 100" };
  }
  
  // Find the task
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) {
    return { success: false, message: "Task not found" };
  }
  
  // Update the task
  tasks[taskIndex].progress = newProgress;
  return { 
    success: true, 
    message: "Task updated successfully",
    task: tasks[taskIndex]
  };
}

// Using return values for success/failure
const updateResult = updateTaskProgress(2, 75);
if (updateResult.success) {
  console.log(updateResult.message, updateResult.task);
} else {
  console.log("Error:", updateResult.message);
}

// Try writing functions with different return values!
`;
    }
    
    setCode(initialCode);
  }, [lessonId]);
  
  const [runtimeValues, setRuntimeValues] = useState<Record<string, any>>({});
  const [consoleOutput, setConsoleOutput] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAutoExecute, setIsAutoExecute] = useState<boolean>(true);
  
  useEffect(() => {
    if (isAutoExecute) {
      executeCode();
    }
  }, [code, isAutoExecute]);

  const executeCode = () => {
    setError(null);
    
    try {
      const result = evaluateCodeSafely(code);
      
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

  const formatValue = (value: any): string => {
    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    if (typeof value === 'string') return `"${value}"`;
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch (e) {
        return `${value}`;
      }
    }
    return `${value}`;
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  return (
    <div className="bootdev-lesson-container">
      <div className="bootdev-lesson-header">
        <h1>Building a Task Manager: Functions</h1>
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
                {(() => {
                  // Find current lesson in curriculum
                  const currentLessonId = lessonId || 'function-basics';
                  
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
                    <>
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
                    </>
                  );
                })()}
              </div>
            </div>
            
            <h2>Building a Task Manager: Functions</h2>
            <p>
              We've learned about task variables and operations. Now it's time to organize 
              our code into reusable functions. In the task manager demo, you saw how tasks 
              could be added, deleted, and updated - we'll create functions for each of these actions.
            </p>
            
            <div className="bootdev-info-box">
              <h4>Moving Closer to Our Goal</h4>
              <p>
                Remember the task manager demo? With these functions, we're getting closer 
                to creating that complete application. We're writing code that:
              </p>
              <ul>
                <li>Adds new tasks to our task list</li>
                <li>Updates task progress</li>
                <li>Marks tasks as complete</li>
                <li>Organizes tasks according to priority</li>
              </ul>
            </div>
            
            <div className="bootdev-code-example">
              <pre>
{`// Function to add a task
function addTask(name, priority) {
  // Function body - the code to execute
  const newTask = { name, priority };
  return newTask;  // Return the created task
}`}
              </pre>
            </div>
            
            <h3>Key Task Functions</h3>
            <ul>
              <li><strong>Task Creation</strong>: Functions to add new tasks</li>
              <li><strong>Task Updates</strong>: Functions to modify existing tasks</li>
              <li><strong>Task Completion</strong>: Functions to mark tasks as done</li>
              <li><strong>Task Filtering</strong>: Functions to find specific tasks</li>
            </ul>
            
            <div className="bootdev-info-box">
              <h4>Function Benefits in Our Task Manager</h4>
              <ul>
                <li><strong>Reusability</strong>: Use the same code to process many tasks</li>
                <li><strong>Organization</strong>: Group related operations together</li>
                <li><strong>Modularity</strong>: Build complex features from simpler functions</li>
                <li><strong>Maintainability</strong>: Easier to change behavior in one place</li>
              </ul>
            </div>
            
            <h3>Project Progression</h3>
            <p>We're building our task manager step by step:</p>
            <ol>
              <li>Lesson 1: Define task variables</li>
              <li>Lesson 2: Task calculations and operations</li>
              <li>Lesson 3: Create task management functions (current lesson)</li>
              <li>Lesson 4: Build a complete task system with objects and arrays</li>
            </ol>
            
            <h3>Examples</h3>
            <div className="bootdev-code-example">
              <h4>Update Task Status</h4>
              <pre>
{`function completeTask(taskId) {
  // Find the task by id and update it
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === taskId) {
      tasks[i].completed = true;
      return true;
    }
  }
  return false;  // Task not found
}`}
              </pre>
            </div>
            
            <div className="bootdev-code-example">
              <h4>Calculate Task Metrics</h4>
              <pre>
{`function getCompletionRate() {
  let completed = 0;
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].completed) {
      completed++;
    }
  }
  return (completed / tasks.length) * 100;
}`}
              </pre>
            </div>
          </div>
        </div>

        <div className="bootdev-practice-panel">
          <div className="bootdev-editor-section">
            <div className="bootdev-code-editor">
              <CodeEditor
                value={code}
                onChange={handleCodeChange}
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
                          </Card.Header>
                          <Card.Body>
                            <Card.Title>Value</Card.Title>
                            <Card.Text className="variable-value">{formatValue(value)}</Card.Text>
                            
                            <div className="variable-type-container mt-2">
                              <span className={`variable-type-badge bg-${getTypeColor(type)}`}>
                                {type}
                              </span>
                            </div>
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

export default BootDevStyleLesson; 