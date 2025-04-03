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
import { useParams, Link } from 'react-router-dom';
import curriculum from '../data/curriculum';

interface UndefinedLessonProps {
  darkMode?: boolean;
}

const UndefinedLesson: React.FC<UndefinedLessonProps> = ({ 
  darkMode = false
}) => {
  // Initial code sample
  const initialCode = `// Understanding Undefined vs Undeclared Variables for Task Management

// Undefined variables - declared but not assigned a value
let taskName;  
let dueDate;
let assignee;

console.log("Task name:", taskName);  // undefined
console.log("Due date:", dueDate);    // undefined
console.log("Assignee:", assignee);   // undefined

// Checking if variables are undefined
if (taskName === undefined) {
  console.log("Task name has not been set yet");
}

// Using typeof to check for undefined (safer method)
if (typeof dueDate === "undefined") {
  console.log("Due date has not been set yet");
}

// Function parameters that aren't provided become undefined
function createTask(title, priority, dueDate) {
  console.log("Creating task with:");
  console.log("- Title:", title);         // provided value
  console.log("- Priority:", priority);   // undefined if not provided
  console.log("- Due date:", dueDate);    // undefined if not provided
  
  // Create task object (with sensible defaults for undefined params)
  return {
    id: Date.now(),
    title: title || "Untitled Task",
    priority: priority || "Medium",
    dueDate: dueDate || null,
    completed: false
  };
}

// Creating a task with missing parameters
let newTask = createTask("Fix navigation bug");
console.log("New task:", newTask);

// Accessing object properties that don't exist
console.log("Task description:", newTask.description);  // undefined (property doesn't exist)

// Functions without a return statement give undefined
function processTask(task) {
  console.log("Processing task:", task.title);
  // No return statement
}
let result = processTask(newTask);
console.log("Process result:", result);  // undefined

// INCORRECT USAGE: Undeclared variables (causes errors)
try {
  // Uncomment the next line to see the error
  // console.log(undeclaredVar);  // ReferenceError: undeclaredVar is not defined
  console.log("This line won't run if undeclaredVar is used");
} catch (error) {
  console.log("Error caught:", error.name);
}

// Common mistake with undeclared variables in functions
function incorrectFunction() {
  taskStatus = "In Progress";  // Missing let/const/var - creates global variable 
}

// Using strict mode to catch these errors
function strictModeExample() {
  "use strict";
  try {
    // Uncomment the next line to see the error
    // taskPriority = "High";  // Error in strict mode
    console.log("This line won't run if taskPriority is assigned without declaration");
  } catch (error) {
    console.log("Strict mode error:", error.name);
  }
}
strictModeExample();

// Best practices for variables in task management
let taskList = [];          // Initialize arrays
let taskCount = 0;          // Initialize numbers
let isCompleted = false;    // Initialize booleans
let taskDescription = "";   // Initialize strings
let taskOwner = null;       // Use null for intentionally empty values

// Safe access pattern for undefined properties
function getTaskDuration(task) {
  // Check if property exists before using it
  if (task && typeof task.duration !== "undefined") {
    return task.duration;
  }
  return 0;  // Default value
}

console.log("Task duration:", getTaskDuration(newTask));
`;
  
  const [code, setCode] = useState(initialCode);
  const [runtimeValues, setRuntimeValues] = useState<Record<string, any>>({});
  const [consoleOutput, setConsoleOutput] = useState<any[]>([]);
  const [executionPath, setExecutionPath] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Handle code changes
  const handleCodeChange = (value: string) => {
    setCode(value);
  };
  
  // Auto-execute code when it changes
  useEffect(() => {
    executeCode();
  }, [code]);

  const executeCode = async () => {
    setError(null);
    
    try {
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
      
      if (result.aiEnhanced && result.executionPath) {
        setExecutionPath(result.executionPath);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const getValueType = (value: any): string => {
    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    
    if (typeof value === 'object' && value?.__isClass) {
      return 'class';
    }
    
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
      case 'class': return 'purple';
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
    
    if (typeof value === 'string' && isStringifiedClassInstance(value).isClass) {
      return value;
    }
    
    if (typeof value === 'string') return `"${value}"`;
    if (typeof value === 'object') {
      try {
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

  return (
    <div className="lesson-container">
      <div className="lesson-header">
        <h1>Lesson 6: Undefined and Undeclared Variables</h1>
        <div className="lesson-meta">
          <div className="chapter-info">
            <span className="chapter-title">Chapter 1: Task Manager Fundamentals</span>
            <div className="lesson-navigation">
              {(() => {
                // Find current lesson in curriculum
                const currentLessonId = "undefined-undeclared";
                
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
                    
                    <span className="lesson-indicator">
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
        </div>
      </div>

      <div className="lesson-content">
        <div className="explanation-panel">
          <h2>Undefined vs. Undeclared Variables</h2>
          <p>
            In JavaScript, understanding the difference between undefined and undeclared variables
            is crucial for building robust task management applications.
          </p>
          
          <h3>Undefined Variables</h3>
          <p>
            A variable is <strong>undefined</strong> when it has been declared but not assigned a value.
            This is a legitimate state in JavaScript and is represented by the special value <code>undefined</code>.
          </p>
          
          <div className="code-example">
{`// Declaring variables without assigning values
let taskName;     // undefined
let dueDate;      // undefined
let isCompleted;  // undefined

console.log(taskName);  // undefined

// Checking if a variable is undefined
if (taskName === undefined) {
  console.log("Task name has not been set yet");
}

// Alternative check for undefined
if (typeof taskName === "undefined") {
  console.log("Task name has not been set yet");
}`}
          </div>
          
          <h3>Common Undefined Scenarios in Task Management</h3>
          <p>
            There are several situations where you'll encounter <code>undefined</code> values:
          </p>
          
          <div className="code-example">
{`// 1. Function parameters that aren't provided
function createTask(title, dueDate) {
  console.log("Due date:", dueDate);  // undefined if not provided
}
createTask("New task");  // Only passing the first parameter

// 2. Object properties that don't exist
let task = { title: "Review code" };
console.log(task.dueDate);  // undefined (property doesn't exist)

// 3. Functions without a return statement
function processTask(task) {
  // No return statement
}
let result = processTask({});
console.log(result);  // undefined

// 4. Accessing array elements that don't exist
let tasks = ["Task 1", "Task 2"];
console.log(tasks[5]);  // undefined (index out of bounds)`}
          </div>
          
          <h3>Undeclared Variables</h3>
          <p>
            An <strong>undeclared</strong> variable is one that has never been declared with
            <code>let</code>, <code>const</code>, or <code>var</code>. Using undeclared variables
            causes errors and can lead to unexpected behavior.
          </p>
          
          <div className="code-example">
{`// This would cause a ReferenceError:
// console.log(undeclaredVar);  // ReferenceError

// Common mistake: forgetting to declare variables in functions
function incorrectFunction() {
  taskStatus = "In Progress";  // Missing let/const/var
  // This creates a global variable if not in strict mode!
}

// Using "use strict" to catch undeclared variables
function strictModeFunction() {
  "use strict";
  // Uncommenting the next line would cause an error in strict mode
  // taskPriority = "High";  // ReferenceError
}`}
          </div>
          
          <h3>Safely Checking for Existence</h3>
          <p>
            When you're not sure if a variable exists at all (it might be undeclared),
            you should use the <code>typeof</code> operator:
          </p>
          
          <div className="code-example">
{`// Safe way to check for undefined/undeclared variables
if (typeof possiblyUndeclaredVar === "undefined") {
  console.log("Variable is undefined or not declared");
}

// This works because typeof returns "undefined" for both
// undefined variables and undeclared variables (without error)`}
          </div>
          
          <h3>Best Practices for Task Management</h3>
          <p>
            To avoid issues with undefined and undeclared variables in your task management app:
          </p>
          <ul>
            <li>Always initialize variables with default values</li>
            <li>Use <code>let</code> or <code>const</code> for all declarations</li>
            <li>Add <code>"use strict";</code> to catch undeclared variables</li>
            <li>Use defensive programming to check for undefined values</li>
            <li>Provide default values for function parameters</li>
          </ul>
          
          <div className="code-example">
{`// Best practices example for task management
"use strict";  // Catch undeclared variables

// Initialize with sensible default values
let taskName = "";
let dueDate = null;
let priority = "medium";
let tags = [];

// Default parameters for functions
function createTask(name, options = {}) {
  return {
    id: Date.now(),
    name,
    priority: options.priority || "medium",
    dueDate: options.dueDate || null,
    completed: false
  };
}

// Safe property access
function getTaskDuration(task) {
  if (task && typeof task.duration !== "undefined") {
    return task.duration;
  }
  return 0;  // Default value
}`}
          </div>
          
          <p>
            Try working with the code editor to experiment with undefined and undeclared variables!
          </p>
        </div>

        <div className="interactive-panel">
          <div className="code-editor-container">
            <CodeEditor
              value={code}
              onChange={handleCodeChange}
              darkMode={darkMode}
            />
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
          </div>

          <div className="visualization-panel">
            <h3>Variable Values</h3>
            <div className="visualization-scroll-container">
              <div className="memory-containers">
                {Object.keys(runtimeValues).length === 0 ? (
                  <div className="empty-state">
                    No variables created yet.
                  </div>
                ) : (
                  <Row xs={1} className="g-3 justify-content-center display-flow">
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
                )}
              </div>

              {consoleOutput.length > 0 && (
                <div className="console-output">
                  <h3>Console Output</h3>
                  {consoleOutput.map((output, index) => (
                    <div key={index} className="console-line">
                      {formatValue(output)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UndefinedLesson; 