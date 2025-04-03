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

interface ConsoleLessonProps {
  darkMode?: boolean;
}

const ConsoleLesson: React.FC<ConsoleLessonProps> = ({ 
  darkMode = false
}) => {
  // Initial code sample
  const initialCode = `// Console Logging for Task Management
// Use console methods to output task information

// Task data
let task = {
  id: 123,
  title: "Implement user authentication",
  assignee: "John Doe",
  dueDate: "2023-12-15",
  priority: "High",
  status: "In Progress",
  progress: 60,
  tags: ["frontend", "security"]
};

// Basic console.log
console.log("Task information:");
console.log(task);

// Logging with string formatting
console.log("Task #%d: %s (Priority: %s)", task.id, task.title, task.priority);

// Using console.log with multiple arguments
console.log("Assigned to:", task.assignee, "Due date:", task.dueDate);

// Using template literals (modern approach)
console.log(\`Progress: \${task.progress}% complete\`);

// Different console methods for different types of messages
console.info("Task tags:", task.tags);
console.warn("Task is due in 5 days!");
console.error("Deadline missed for task: " + task.title);

// Grouping related log messages
console.group("Task Details");
console.log("Title:", task.title);
console.log("Status:", task.status);
console.log("Assignee:", task.assignee);
console.groupEnd();

// Console table for structured data
let tasks = [
  { id: 1, title: "Setup project", status: "Completed", progress: 100 },
  { id: 2, title: "Create UI components", status: "In Progress", progress: 70 },
  { id: 3, title: "Connect API", status: "Not Started", progress: 0 }
];
console.table(tasks);

// Tracking time for task performance
console.time("Task Processing Time");
// Simulate some processing
for (let i = 0; i < 1000000; i++) {
  // Processing task...
}
console.timeEnd("Task Processing Time");
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
        <h1>Lesson 2: Console Logging Task Variables</h1>
        <div className="lesson-meta">
          <div className="chapter-info">
            <span className="chapter-title">Chapter 1: Task Manager Fundamentals</span>
            <div className="lesson-navigation">
              {(() => {
                // Find current lesson in curriculum
                const currentLessonId = "console";
                
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
          <h2>Console Logging for Task Management</h2>
          <p>
            The console is a powerful debugging tool that allows you to output information about your tasks
            and track the execution of your code. It's essential for developing and maintaining a task management system.
          </p>
          
          <h3>Basic Console.log</h3>
          <p>
            The most common console method is <code>console.log()</code>, which outputs information to the console:
          </p>
          
          <div className="code-example">
{`// Simple string output
console.log("Hello, Task Manager!");

// Logging variables
let taskName = "Complete project setup";
console.log(taskName);  // "Complete project setup"

// Logging multiple values
let priority = "High";
let dueDate = "2023-12-31";
console.log(taskName, priority, dueDate);

// Logging objects (tasks)
let task = {
  id: 123,
  title: "Create wireframes",
  completed: false
};
console.log(task);  // Displays the entire task object`}
          </div>
          
          <h3>Formatted Console Output</h3>
          <p>
            You can format your console output to make it more readable:
          </p>
          
          <div className="code-example">
{`// Using string concatenation
console.log("Task: " + task.title + " (ID: " + task.id + ")");

// Using template literals (modern approach)
console.log(\`Task: \${task.title} (ID: \${task.id})\`);

// Using string formatting with placeholders
console.log("Task: %s (ID: %d)", task.title, task.id);
// %s = string, %d = number, %o = object, %f = float`}
          </div>
          
          <h3>Different Console Methods</h3>
          <p>
            The console object provides several methods for different types of messages:
          </p>
          
          <div className="code-example">
{`// Regular informational message
console.log("Task updated successfully");

// Informational message (blue 'i' icon in browser)
console.info("New task created at 2:45 PM");

// Warning message (yellow warning icon)
console.warn("Task approaching deadline!");

// Error message (red 'x' icon)
console.error("Failed to save task");

// Debug message (only shown if debug level enabled)
console.debug("Task object initialized with default values");`}
          </div>
          
          <h3>Advanced Console Features</h3>
          <p>
            The console offers more advanced features for structuring and analyzing task data:
          </p>
          
          <div className="code-example">
{`// Grouping related logs
console.group("Task Operations");
console.log("Loading tasks...");
console.log("Sorting by priority...");
console.log("Filtering completed tasks...");
console.groupEnd();

// Creating tables for structured data
let tasks = [
  { id: 1, title: "Setup project", status: "Completed" },
  { id: 2, title: "Create UI", status: "In Progress" },
  { id: 3, title: "Write tests", status: "Not Started" }
];
console.table(tasks);  // Displays a formatted table

// Timing operations
console.time("Task Loading");
// ... code to load tasks
console.timeEnd("Task Loading");  // "Task Loading: 1.23ms"`}
          </div>
          
          <h3>Console in Task Management Applications</h3>
          <p>
            For task management applications, the console is useful for:
          </p>
          <ul>
            <li>Debugging task creation and updates</li>
            <li>Monitoring performance of task operations</li>
            <li>Logging user interactions with tasks</li>
            <li>Displaying task data in development</li>
            <li>Tracing execution flow of task operations</li>
          </ul>
          
          <p>
            Try experimenting with the console methods in the code editor!
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

export default ConsoleLesson; 