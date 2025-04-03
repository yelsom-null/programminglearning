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

interface IncrementDecrementLessonProps {
  darkMode?: boolean;
}

const IncrementDecrementLesson: React.FC<IncrementDecrementLessonProps> = ({ 
  darkMode = false
}) => {
  // Initial code sample
  const initialCode = `// Increment and Decrement Operators for Task Tracking
// Use ++ and -- to update task counters efficiently

// Task counters
let totalTasks = 8;
let completedTasks = 0;
let currentTaskIndex = 0;

// Array of tasks
let tasks = [
  "Wireframe UI", 
  "Create components", 
  "Add styles", 
  "Connect API", 
  "Implement auth", 
  "Add error handling", 
  "Write tests", 
  "Deploy"
];

// Function to complete the current task
function completeTask() {
  if (completedTasks < totalTasks) {
    // Increment completed tasks
    completedTasks++;
    
    // Move to next task
    let taskName = tasks[currentTaskIndex++];
    
    // Calculate remaining tasks
    let remainingTasks = totalTasks - completedTasks;
    
    return \`Completed task "\${taskName}". \${remainingTasks} tasks remaining.\`;
  } else {
    return "All tasks already completed!";
  }
}

// Function to skip to the next task without completing
function skipTask() {
  if (currentTaskIndex < totalTasks) {
    // Get current task before incrementing index
    let taskName = tasks[currentTaskIndex++];
    return \`Skipped task "\${taskName}". Moving to next task.\`;
  } else {
    return "No more tasks to skip!";
  }
}

// Function to go back to the previous task
function goToPreviousTask() {
  if (currentTaskIndex > 0) {
    // Pre-decrement to move back, then get the task
    let taskName = tasks[--currentTaskIndex];
    return \`Returned to task "\${taskName}".\`;
  } else {
    return "Already at the first task!";
  }
}

// Test the functions
console.log(completeTask());
console.log(completeTask());
console.log(skipTask());
console.log(goToPreviousTask());
console.log(completeTask());
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
        <h1>Lesson 5: Increment and Decrement Operators</h1>
        <div className="lesson-meta">
          <div className="chapter-info">
            <span className="chapter-title">Chapter 1: Task Manager Fundamentals</span>
            <div className="lesson-navigation">
              {(() => {
                // Find current lesson in curriculum
                const currentLessonId = "increment-decrement";
                
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
          <h2>Increment and Decrement Operators</h2>
          <p>
            In task management applications, we often need to increase or decrease values by exactly 1.
            JavaScript provides special operators for these common operations: <code>++</code> (increment)
            and <code>--</code> (decrement).
          </p>
          
          <h3>Basic Increment (++) and Decrement (--) Operators</h3>
          <p>
            These operators add 1 or subtract 1 from a variable:
          </p>
          
          <Card className="concept-card mb-4">
            <Card.Header as="h4">Increment and Decrement Basics</Card.Header>
            <Card.Body>
              <p>Using ++ and -- operators to change values by 1:</p>
              <div className="code-block">
{`// Increment: increase by 1
let completedTasks = 5;
completedTasks++;        // Add 1 (now equals 6)
console.log(completedTasks);  // 6

// Decrement: decrease by 1
let remainingTasks = 10;
remainingTasks--;        // Subtract 1 (now equals 9) 
console.log(remainingTasks);  // 9

// Common uses in task management
let taskCounter = 0;

// Completing tasks one by one
taskCounter++;  // Complete first task
console.log(\`Completed \${taskCounter} tasks\`);

taskCounter++;  // Complete second task
console.log(\`Completed \${taskCounter} tasks\`);`}
              </div>
            </Card.Body>
          </Card>
          
          <h3>Pre vs. Post Increment/Decrement</h3>
          <p>
            There are two ways to use these operators, with an important difference:
          </p>
          <ul>
            <li><strong>Post-increment (x++)</strong>: Returns the current value, then increments</li>
            <li><strong>Pre-increment (++x)</strong>: Increments first, then returns the new value</li>
          </ul>
          
          <Card className="concept-card mb-4">
            <Card.Header as="h4">Prefix vs. Postfix Operators</Card.Header>
            <Card.Body>
              <p>Understanding the difference between x++ and ++x:</p>
              <div className="code-block">
{`// Post-increment (x++)
let a = 5;
let b = a++;    // Assign a to b (5), then increment a
console.log("a:", a);    // 6 (was incremented after assignment)
console.log("b:", b);    // 5 (got the original value)

// Pre-increment (++x)
let c = 5;
let d = ++c;    // Increment c first, then assign to d
console.log("c:", c);    // 6 (was incremented before assignment)
console.log("d:", d);    // 6 (got the incremented value)

// The same applies to decrement (x-- vs --x)
let taskCount = 10;
console.log(taskCount--);    // Displays 10, then decrements to 9
console.log(--taskCount);    // Decrements to 8, then displays 8`}
              </div>
            </Card.Body>
          </Card>
          
          <h3>Real-World Task Management Applications</h3>
          <p>
            These operators are particularly useful in task management:
          </p>
          
          <Card className="concept-card mb-4">
            <Card.Header as="h4">Practical Applications</Card.Header>
            <Card.Body>
              <p>Using increment and decrement operators in task management:</p>
              <div className="code-block">
{`// Task list navigation
let tasks = ["Design layout", "Write code", "Test features", "Deploy"];
let currentTaskIndex = 0;

// Get current task and move to next
function getNextTask() {
  let task = tasks[currentTaskIndex++];  // Post-increment
  return task;
}

// Move to previous task with validation
function getPreviousTask() {
  if (currentTaskIndex > 0) {
    return tasks[--currentTaskIndex];  // Pre-decrement
  }
  return "No previous tasks";
}

// Tracking task completion
let totalTasks = tasks.length;
let completedTasks = 0;

function completeCurrentTask() {
  if (completedTasks < totalTasks) {
    completedTasks++;
    return \`Completed \${completedTasks} of \${totalTasks} tasks\`;
  }
  return "All tasks completed!";
}`}
              </div>
            </Card.Body>
          </Card>
          
          <h3>Increment/Decrement vs. Compound Assignment</h3>
          <p>
            For larger increments or decrements, use compound assignment operators:
          </p>
          
          <Card className="concept-card mb-4">
            <Card.Header as="h4">Compound Assignment Operators</Card.Header>
            <Card.Body>
              <p>Alternatives for adding or subtracting values other than 1:</p>
              <div className="code-block">
{`// Increment/decrement (for adding/subtracting 1)
let count = 10;
count++;         // 11
count--;         // 10

// Compound assignment (for adding/subtracting other amounts)
let progress = 0;
progress += 25;   // Same as: progress = progress + 25 (now 25)
progress += 25;   // (now 50)
progress -= 10;   // Same as: progress = progress - 10 (now 40)

// Other compound operators
let timeEstimate = 8;
timeEstimate *= 1.5;   // Increase estimate by 50% (now 12)
timeEstimate /= 2;     // Cut estimate in half (now 6)`}
              </div>
            </Card.Body>
          </Card>
          
          <p>
            Try experimenting with the code editor to create a task tracking system
            using increment and decrement operators!
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

export default IncrementDecrementLesson; 