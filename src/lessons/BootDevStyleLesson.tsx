import React, { useState, useEffect } from 'react';
import CodeEditor from '../components/CodeEditor';
import { evaluateCodeSafely } from '../utils/codeAnalysis';
import '../styles/LessonStyles.css';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

interface BootDevStyleLessonProps {
  darkMode?: boolean;
}

const BootDevStyleLesson: React.FC<BootDevStyleLessonProps> = ({ darkMode = false }) => {
  const [code, setCode] = useState<string>(
`// Task Management App - Part 3: Task Functions
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
`
  );
  
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
                <a 
                  href="/lesson/basic-operations" 
                  className="chapter-nav-button" 
                  title="Previous: Operations"
                >
                  ← Previous Lesson
                </a>
                <span className="chapter-lesson-indicator">Lesson 3 of 4</span>
                <a 
                  href="/lesson/boot-dev-variables" 
                  className="chapter-nav-button" 
                  title="Next: Complete System"
                >
                  Next Lesson →
                </a>
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