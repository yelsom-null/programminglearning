import React, { useState, useEffect } from 'react';
import CodeEditor from '../components/CodeEditor';
import { 
  evaluateCodeSafely, 
  evaluateCodeWithAI, 
  isStringifiedClassInstance,
  parseStringifiedClass 
} from '../utils/codeAnalysis';
import '../styles/LessonStyles.css';
import { Card, CardHeader, CardContent, Typography, Grid, Chip, Box } from '@mui/material';
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useParams, Link } from 'react-router-dom';
import curriculum from '../data/curriculum';
import CodeBlock from '../components/CodeBlock';
import ConceptCard from '../components/ConceptCard';

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
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
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

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="lesson-container">
      <div className="lesson-header">
        <Typography variant="h3" component="h1" gutterBottom>Lesson 2: Console Logging Task Variables</Typography>
        <div className="lesson-meta">
          <div className="chapter-info">
            <Typography variant="subtitle1" gutterBottom>Chapter 1: Task Manager Fundamentals</Typography>
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
                        <Typography variant="button">← Previous Lesson</Typography>
                      </Link>
                    ) : (
                      <button 
                        className="chapter-nav-button" 
                        disabled={true}
                        title="This is the first lesson"
                      >
                        <Typography variant="button">← Previous Lesson</Typography>
                      </button>
                    )}
                    
                    <Typography variant="body2" className="lesson-indicator">
                      {currentChapter && currentLessonIndex !== -1 
                        ? `Lesson ${currentLessonIndex + 1} of ${currentChapter.lessons.length}`
                        : "Lesson"}
                    </Typography>
                    
                    {nextLesson ? (
                      <Link 
                        to={nextLesson.route}
                        className="chapter-nav-button"
                        title={`Next: ${nextLesson.title}`}
                      >
                        <Typography variant="button">Next Lesson →</Typography>
                      </Link>
                    ) : (
                      <button 
                        className="chapter-nav-button" 
                        disabled={true}
                        title="This is the last lesson"
                      >
                        <Typography variant="button">Next Lesson →</Typography>
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
          <Typography variant="h4" gutterBottom>Console Logging for Task Management</Typography>

          <Typography variant="body1" paragraph>
            The console is a powerful debugging tool that allows you to output information about your tasks
            and track the execution of your code. It's essential for developing and maintaining a task management system.
          </Typography>
          
          <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Basic Console Usage
          </Typography>
          <Typography variant="body1" paragraph>
            The <Box component="code" sx={{ backgroundColor: 'rgba(0,0,0,0.05)', px: 0.5 }}>console.log()</Box> method is the most commonly used console method. 
            It outputs a message to the web console:
          </Typography>
          
          <ConceptCard title="Basic Console Logging">
            <Typography variant="body1" gutterBottom>
              The simplest way to output information is with console.log():
            </Typography>
            <CodeBlock>
// Basic console.log
console.log("Hello, Task Manager!");

// Logging variables
let taskName = "Complete project plan";
let isCompleted = false;
let dueDate = "2023-12-31";

console.log(taskName);     // Complete project plan
console.log(isCompleted);  // false
console.log(dueDate);      // 2023-12-31

// Logging multiple values at once
console.log(taskName, isCompleted, dueDate);
// Complete project plan false 2023-12-31

// Logging with descriptive labels
console.log("Task:", taskName);
console.log("Completed:", isCompleted);
console.log("Due Date:", dueDate);
            </CodeBlock>
          </ConceptCard>
          
          <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Enhanced Console Methods
          </Typography>
          <Typography variant="body1" paragraph>
            The console object provides specialized methods for different types of output:
          </Typography>
          
          <ConceptCard title="Different Console Methods">
            <Typography variant="body1" gutterBottom>
              Using various console methods to style your debug output:
            </Typography>
            <CodeBlock>
{`// Error logging for debugging issues
console.error("Task deletion failed!");

// Warning logging for potential issues
console.warn("Task is past due date!");

// Info logging for general information
console.info("Task status updated successfully");

// Debug logging (only shows with debug level enabled)
console.debug("Detailed task processing information");

// Grouping related log messages
console.group("Task Details");
console.log("Name: Fix navigation bug");
console.log("Priority: High");
console.log("Status: In Progress");
console.groupEnd();

// Timing operations
console.time("taskOperation");
// ... code that takes time to execute ...
console.timeEnd("taskOperation"); // Outputs: taskOperation: 1234ms`}
            </CodeBlock>
          </ConceptCard>
          
          <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Logging Objects and Data Structures
          </Typography>
          <Typography variant="body1" paragraph>
            When working with tasks, you'll often need to inspect complex data structures:
          </Typography>
          
          <ConceptCard title="Logging Complex Data">
            <Typography variant="body1" gutterBottom>
              How to examine complex objects and arrays in the console:
            </Typography>
            <CodeBlock>
{`// Create a task object
let task = {
  id: 42,
  title: "Complete project documentation",
  description: "Write user guide and API documentation",
  completed: false,
  priority: "high",
  dueDate: "2023-12-15",
  subtasks: [
    { id: 1, title: "Outline document structure", completed: true },
    { id: 2, title: "Write API endpoints section", completed: false },
    { id: 3, title: "Add code examples", completed: false }
  ]
};

// Logging the entire object
console.log(task);  // Shows expandable object in browser console

// Using console.table for tabular data (like arrays)
console.table(task.subtasks);  // Displays a nice table view

// Inspecting objects with console.dir
console.dir(task);  // Shows interactive object with expandable properties

// Using destructuring for targeted logging
const { title, priority, dueDate } = task;
console.log("Task overview:", { title, priority, dueDate });`}
            </CodeBlock>
          </ConceptCard>
          
          <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Formatting Console Output
          </Typography>
          <Typography variant="body1" paragraph>
            For better readability, you can format your console output:
          </Typography>
          
          <ConceptCard title="Console Output Formatting">
            <Typography variant="body1" gutterBottom>
              Adding style and structure to your console messages:
            </Typography>
            <CodeBlock>
{`// String formatting with %s, %d, %f, etc.
let taskCount = 5;
let completionRate = 0.8;
console.log("There are %d tasks with a %.1f%% completion rate", 
            taskCount, completionRate * 100);
// "There are 5 tasks with a 80.0% completion rate"

// CSS styling in browser consoles
console.log("%cTask Manager", "color: blue; font-size: 20px; font-weight: bold;");
console.log("%cHigh Priority Task!", "color: red; background: yellow; padding: 5px;");

// Conditional logging based on task status
function logTaskStatus(task) {
  if (task.completed) {
    console.log("%c✓ %s", "color: green; font-weight: bold", task.title);
  } else if (new Date(task.dueDate) < new Date()) {
    console.log("%c! %s", "color: red; font-weight: bold", task.title);
  } else {
    console.log("%c○ %s", "color: gray", task.title);
  }
}

// Example usage:
logTaskStatus({ title: "Completed task", completed: true });
logTaskStatus({ title: "Overdue task", completed: false, dueDate: "2023-01-01" });
logTaskStatus({ title: "Future task", completed: false, dueDate: "2023-12-31" });`}
            </CodeBlock>
          </ConceptCard>
          
          <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Best Practices for Console Logging in Task Management
          </Typography>
          <Typography variant="body1" paragraph>
            Here are some tips for effective logging in your task management application:
          </Typography>
          
          <ConceptCard title="Console Logging Best Practices">
            <Typography variant="body1" gutterBottom>
              Follow these guidelines for effective logging in your application:
            </Typography>
            <CodeBlock>
{`// Use descriptive labels for better readability
console.log("Task Created:", newTask);

// Log task state changes
function updateTaskStatus(taskId, newStatus) {
  console.log(\`Task \${taskId} status changed to \${newStatus}\`);
  // Implementation...
}

// Conditional logging based on environment
const DEBUG = true;
function debugLog(...messages) {
  if (DEBUG) {
    console.log("[DEBUG]", ...messages);
  }
}
debugLog("Processing task queue:", taskQueue);

// Remove or disable console logs in production
// In production build process:
// if (process.env.NODE_ENV === 'production') {
//   console.log = () => {};
// }`}
            </CodeBlock>
          </ConceptCard>
          
          <Typography variant="body1" paragraph>
            Try using these console methods in the code editor to understand how they work in practice!
          </Typography>
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
            <Typography variant="h5" gutterBottom>Variable Values</Typography>
            <div className="visualization-scroll-container">
              <div className="memory-containers">
                {Object.keys(runtimeValues).length === 0 ? (
                  <div className="empty-state">
                    <Typography variant="body1">No variables created yet.</Typography>
                  </div>
                ) : (
                  <Row xs={1} className="g-3 justify-content-center display-flow">
                    {Object.entries(runtimeValues).map(([name, value]) => {
                      const type = getValueType(value);
                      return (
                        <Col key={name} className="">
                          <Card className={`variable-card type-${type}`}>
                            <CardHeader className="variable-name d-flex justify-content-between align-items-center">
                              {name}
                              {value?.aiDescription && (
                                <Badge bg="info" pill title={value.aiDescription}>
                                  <i className="bi bi-magic"></i> AI
                                </Badge>
                              )}
                            </CardHeader>
                            <CardContent>
                              <Typography variant="h6">{getTypeExplanation(type)}</Typography>
                              <Typography variant="body1" className="variable-value">{formatValue(value)}</Typography>
                              
                              <div className="variable-type-container mt-2">
                                <span className={`variable-type-badge bg-${getTypeColor(type)}`}>
                                  {getTypeExplanation(type)}
                                </span>
                              </div>
                              
                              {value?.aiDescription && (
                                <div className="ai-explanation mt-2">
                                  <Typography variant="caption" color="text.secondary">
                                    {value.aiDescription}
                                  </Typography>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>
                )}
              </div>

              {consoleOutput.length > 0 && (
                <div className="console-output">
                  <Typography variant="h5" gutterBottom>Console Output</Typography>
                  {consoleOutput.map((output, index) => (
                    <div key={index} className="console-line">
                      <Typography variant="body2" fontFamily="monospace">
                        {formatValue(output)}
                      </Typography>
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