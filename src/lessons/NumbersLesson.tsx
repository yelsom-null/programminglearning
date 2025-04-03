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
import Button from 'react-bootstrap/Button';
import { useParams, Link } from 'react-router-dom';
import curriculum from '../data/curriculum';
import { CardHeader, CardContent, Typography, Box } from '@mui/material';

interface NumbersLessonProps {
  darkMode?: boolean;
}

const NumbersLesson: React.FC<NumbersLessonProps> = ({ 
  darkMode = false
}) => {
  // Initial code sample
  const initialCode = `// Numbers in JavaScript for Task Management
// Explore different number operations for task tracking

// Basic task metrics
let taskId = 1234;
let priority = 3;        // 1=low, 2=medium, 3=high
let progress = 75.5;     // Percentage complete
let timeEstimate = 3.5;  // Hours

// Task calculations
let tasks = [
  { name: "Task 1", hours: 2.5, progress: 100 },
  { name: "Task 2", hours: 4.0, progress: 50 },
  { name: "Task 3", hours: 1.5, progress: 25 },
  { name: "Task 4", hours: 3.0, progress: 0 }
];

// Calculate total estimated hours
let totalHours = 0;
for (let task of tasks) {
  totalHours += task.hours;
}

// Calculate overall progress percentage
let totalProgress = 0;
for (let task of tasks) {
  totalProgress += task.progress * task.hours / totalHours;
}

// Calculate remaining work hours
let remainingHours = 0;
for (let task of tasks) {
  remainingHours += task.hours * (100 - task.progress) / 100;
}

// Display the results with formatting
console.log(\`Project metrics:
- Total estimated hours: \${totalHours}
- Overall progress: \${totalProgress.toFixed(1)}%
- Remaining work: \${remainingHours.toFixed(1)} hours\`);

// Try adding your own calculations!
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
        <Typography variant="h3" component="h1" gutterBottom>Lesson 4: Numbers in JavaScript</Typography>
        <div className="lesson-meta">
          <div className="chapter-info">
            <Typography variant="subtitle1" gutterBottom>Chapter 1: Task Manager Fundamentals</Typography>
            <div className="lesson-navigation">
              {(() => {
                // Find current lesson in curriculum
                const currentLessonId = "numbers-in-js";
                
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
          <Typography variant="h4" gutterBottom>Working with Numbers in Task Management</Typography>
          
          <Typography variant="body1" paragraph>
            Numbers are essential in task management applications for tracking time estimates,
            progress percentages, priorities, and other metrics. JavaScript uses a single 
            number type for all numeric values.
          </Typography>
          
          <h3>Numbers in JavaScript</h3>
          <p>
            In JavaScript, all numbers are stored as 64-bit floating point values (doubles). 
            This means there's just one number type for integers and decimals:
          </p>
          
          <Card className="concept-card mb-4">
            <Card.Header as="h4">Number Basics</Card.Header>
            <Card.Body>
              <p>All numbers in JavaScript are 64-bit floating point values:</p>
              <div className="code-block">
{`// Integers for counting tasks
let taskCount = 5;          // Simple integer
let completedTasks = 3;     // Another integer
let pendingTasks = taskCount - completedTasks;  // 2

// Decimal numbers for task estimates
let estimatedHours = 3.5;   // Hours to complete a task
let hoursWorked = 2.25;     // Time already spent
let remainingHours = estimatedHours - hoursWorked;  // 1.25

// Large numbers for timestamp IDs
let taskId = 1679493732251;  // Task ID based on timestamp`}
              </div>
            </Card.Body>
          </Card>
          
          <h3>Number Operations for Task Management</h3>
          <p>
            JavaScript provides many operations to work with numeric values:
          </p>
          
          <Card className="concept-card mb-4">
            <Card.Header as="h4">Math Operations</Card.Header>
            <Card.Body>
              <p>Basic mathematical operations for task calculations:</p>
              <div className="code-block">
{`// Addition: Combining estimates
let taskAHours = 2.5;
let taskBHours = 1.75;
let totalEstimate = taskAHours + taskBHours;  // 4.25 hours

// Subtraction: Time tracking
let allocatedHours = 8;
let usedHours = 5.5;
let remainingHours = allocatedHours - usedHours;  // 2.5 hours

// Multiplication: Scaling estimates
let baseTime = 3;
let complexityFactor = 1.5;  // Task is 50% more complex than base
let adjustedEstimate = baseTime * complexityFactor;  // 4.5 hours

// Division: Calculating completion percentage
let completedTasks = 7;
let totalTasks = 10;
let completionRate = completedTasks / totalTasks;  // 0.7 or 70%

// Remainder (modulo): Cycling through team members
let teamSize = 4;
let taskNumber = 17;
let assignedTeamMember = taskNumber % teamSize;  // Task 17 goes to team member 1`}
              </div>
            </Card.Body>
          </Card>
          
          <h3>Special Number Values</h3>
          <p>
            JavaScript has some special number values that you may encounter:
          </p>
          
          <Card className="concept-card mb-4">
            <Card.Header as="h4">Special Number Values</Card.Header>
            <Card.Body>
              <p>Important special numeric values in JavaScript:</p>
              <div className="code-block">
{`// Infinity: when a number is too large or we divide by zero
let result = 1 / 0;  
console.log(result);  // Infinity

// Negative Infinity
console.log(-Infinity);  // -Infinity

// NaN: "Not a Number" - result of invalid math operations
let invalidResult = 0 / 0;
console.log(invalidResult);  // NaN

// Parsing errors also give NaN
let taskNumber = parseInt("Task 3");  // Tries to convert "Task 3" to a number
console.log(taskNumber);  // NaN - cannot convert

// Checking for NaN (be careful: NaN is not equal to anything, even itself)
console.log(isNaN(taskNumber));  // true - it is NaN

// Checking for Infinity
let bigNumber = 1e308 * 2;  // Too big for JavaScript to represent
console.log(bigNumber);  // Infinity
console.log(isFinite(bigNumber));  // false - it's not a finite number`}
              </div>
            </Card.Body>
          </Card>
          
          <h3>Number Methods and Formatting</h3>
          <p>
            JavaScript provides several methods to work with numbers in your task management app:
          </p>
          
          <Card className="concept-card mb-4">
            <Card.Header as="h4">Working with Numbers</Card.Header>
            <Card.Body>
              <p>Common methods for working with numbers in a task management context:</p>
              <div className="code-block">
{`// Formatting decimals (for time tracking)
let timeSpent = 3.14159;
console.log(timeSpent.toFixed(1));  // "3.1" (hours)
console.log(timeSpent.toFixed(2));  // "3.14" (hours)

// Converting strings to numbers (from user input)
let userInput = "42";
let taskId = Number(userInput);  // 42 as a number, not string
console.log(taskId);  // 42

// Alternative conversion methods
let priorityInput = "3";
let priorityLevel = parseInt(priorityInput);  // For integers
console.log(priorityLevel);  // 3

let hourInput = "2.5";
let hours = parseFloat(hourInput);  // For floating point (decimal) numbers
console.log(hours);  // 2.5

// Math object for more complex operations
console.log(Math.round(2.7));  // 3 - rounds to nearest integer
console.log(Math.floor(2.7));  // 2 - rounds down 
console.log(Math.ceil(2.2));   // 3 - rounds up

// For estimates, you might want to round up
let estimatedDays = 4.2;
let scheduledDays = Math.ceil(estimatedDays);  // Always round up for scheduling
console.log(scheduledDays);  // 5

// Finding min/max for task prioritization
let taskPriorities = [3, 1, 5, 2];
let highestPriority = Math.max(...taskPriorities);  // 5
let lowestPriority = Math.min(...taskPriorities);   // 1`}
              </div>
            </Card.Body>
          </Card>
          
          <p>
            Try working with these numeric operations in the code editor to build your task tracking capabilities!
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

export default NumbersLesson; 