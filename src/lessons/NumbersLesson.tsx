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
        <h1>Lesson 4: Numbers in JavaScript</h1>
        <div className="lesson-meta">
          <div className="chapter-info">
            <span className="chapter-title">Chapter 1: Task Manager Fundamentals</span>
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
          <h2>Numbers in JavaScript for Task Tracking</h2>
          <p>
            In task management applications, we use numbers for many important aspects:
            priorities, progress tracking, time estimates, and calculations for reports.
          </p>
          
          <h3>Basic Number Types</h3>
          <p>
            JavaScript has a single number type that represents both integers and floating-point values:
          </p>
          
          <div className="code-example">
{`// Integer numbers
let taskId = 1234;
let priority = 3;        // 1=low, 2=medium, 3=high

// Floating-point numbers (decimals)
let progress = 75.5;     // Percentage complete
let timeEstimate = 3.5;  // Hours
let cost = 149.99;       // Currency value

// Scientific notation (for very large or small numbers)
let microTask = 1.5e-6;  // 0.0000015
let bigProject = 3.2e6;  // 3,200,000`}
          </div>
          
          <h3>Mathematical Operations</h3>
          <p>
            JavaScript supports all standard mathematical operations, which are essential
            for task metrics and calculations:
          </p>
          
          <div className="code-example">
{`// Basic operations
let task1Hours = 2.5;
let task2Hours = 1.5;
let totalHours = task1Hours + task2Hours;  // Addition: 4
let averageHours = totalHours / 2;         // Division: 2

// Task progress calculation
let totalTasks = 10;
let completedTasks = 4;
let progressPercent = (completedTasks / totalTasks) * 100;  // 40%

// Remaining work calculation
let estimate = 8;
let progress = 25;
let remainingHours = estimate * (100 - progress) / 100;  // 6 hours`}
          </div>
          
          <h3>Formatting Numbers for Display</h3>
          <p>
            When displaying numbers in a task management UI, we often need to format them:
          </p>
          
          <div className="code-example">
{`// Rounding to nearest integer
let roundedProgress = Math.round(75.5);  // 76

// Fixed decimal places (for consistent display)
let hours = 3.5;
let formattedHours = hours.toFixed(1) + " hrs";  // "3.5 hrs"

// Percentage formatting
let progress = 33.333333;
let formattedProgress = progress.toFixed(1) + "%";  // "33.3%"

// Currency formatting using Intl.NumberFormat
let cost = 149.99;
let formattedCost = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
}).format(cost);  // "$149.99"`}
          </div>
          
          <h3>Handling Invalid Number Inputs</h3>
          <p>
            When working with user input for task data, you need to handle potential non-numeric values:
          </p>
          
          <div className="code-example">
{`// Converting string input to numbers
let progressInput = "75%";
let numericProgress = parseFloat(progressInput);  // 75
console.log(numericProgress);

// Check for invalid numbers (NaN - Not a Number)
let invalidInput = "not a number";
let invalidNumber = parseFloat(invalidInput);  // NaN
console.log(invalidNumber);
console.log(isNaN(invalidNumber));  // true

// Providing fallbacks for calculations
function calculateRemainingHours(progress, estimate) {
  // Ensure inputs are valid numbers
  if (isNaN(progress) || isNaN(estimate)) {
    return 0;  // Default fallback value
  }
  return estimate * (100 - progress) / 100;
}`}
          </div>
          
          <h3>Math Object for Task Calculations</h3>
          <p>
            JavaScript's built-in Math object provides useful methods for task calculations:
          </p>
          <ul>
            <li><code>Math.round(x)</code> - Rounds to the nearest integer</li>
            <li><code>Math.floor(x)</code> - Rounds down (useful for full task counts)</li>
            <li><code>Math.ceil(x)</code> - Rounds up (useful for estimates)</li>
            <li><code>Math.min(x, y, ...)</code> - Returns the lowest value</li>
            <li><code>Math.max(x, y, ...)</code> - Returns the highest value</li>
          </ul>
          
          <p>
            Try experimenting with the code editor to perform task-related calculations!
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