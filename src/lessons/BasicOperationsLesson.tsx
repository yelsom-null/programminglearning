import React, { useState, useEffect } from 'react';
import CodeEditor from '../components/CodeEditor';
import { 
  evaluateCodeSafely, 
  extractVariableDeclarations, 
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

interface BasicOperationsLessonProps {
  darkMode?: boolean;
  topic?: string;
}

const BasicOperationsLesson: React.FC<BasicOperationsLessonProps> = ({ 
  darkMode = false,
  topic
}) => {
  const [code, setCode] = useState<string>(
    // Default code will be set after checking topic
    ''
  );
  
  // Set initial code based on topic
  useEffect(() => {
    if (topic === 'comparison') {
      setCode(`// Task Management App - Comparing Tasks
// Let's learn about comparison operators for tasks

// Define some tasks
let task1Priority = 3; // High priority
let task2Priority = 1; // Low priority

let task1Deadline = 2; // 2 days from now
let task2Deadline = 10; // 10 days from now

// Compare priorities (higher is more important)
console.log("Task 1 priority > Task 2 priority:", task1Priority > task2Priority);
console.log("Task 1 priority < Task 2 priority:", task1Priority < task2Priority);
console.log("Task 1 priority === Task 2 priority:", task1Priority === task2Priority);

// Compare deadlines (lower means more urgent)
console.log("Task 1 deadline < Task 2 deadline:", task1Deadline < task2Deadline);

// Combined comparisons
let task1Urgent = task1Priority >= 3 && task1Deadline <= 3;
let task2Urgent = task2Priority >= 3 && task2Deadline <= 3;

console.log("Is Task 1 urgent?", task1Urgent);
console.log("Is Task 2 urgent?", task2Urgent);

// Sorting tasks by priority
let highestPriorityTask = task1Priority > task2Priority ? "Task 1" : "Task 2";
console.log("Highest priority task:", highestPriorityTask);

// Sorting tasks by deadline
let mostUrgentTask = task1Deadline < task2Deadline ? "Task 1" : "Task 2";
console.log("Most urgent task:", mostUrgentTask);

// Try creating your own comparisons to prioritize tasks!
`);
    } else if (topic === 'logical') {
      setCode(`// Task Management App - Logical Operators for Task Filtering
// Using AND, OR, and NOT to filter tasks

// Task properties
let task1 = {
  name: "Complete project proposal",
  priority: "high",
  deadline: 2, // days
  isCompleted: false,
  category: "work"
};

let task2 = {
  name: "Schedule team meeting",
  priority: "medium",
  deadline: 5, // days
  isCompleted: false,
  category: "work"
};

let task3 = {
  name: "Buy groceries",
  priority: "medium",
  deadline: 1, // days
  isCompleted: false,
  category: "personal"
};

// AND (&&) - both conditions must be true
let highPriorityWorkTasks = 
  task1.priority === "high" && task1.category === "work";
console.log("Task 1 is high priority work task:", highPriorityWorkTasks);

// OR (||) - at least one condition must be true
let needsAttention = 
  task1.priority === "high" || task1.deadline <= 2;
console.log("Task 1 needs immediate attention:", needsAttention);

// NOT (!) - inverts a boolean
let canBeDeferred = !(task1.priority === "high" || task1.deadline <= 2);
console.log("Task 1 can be deferred:", canBeDeferred);

// Complex filtering for task lists
function shouldShowInDashboard(task) {
  return !task.isCompleted && 
         (task.priority === "high" || task.deadline <= 2);
}

console.log("Task 1 on dashboard:", shouldShowInDashboard(task1));
console.log("Task 2 on dashboard:", shouldShowInDashboard(task2));
console.log("Task 3 on dashboard:", shouldShowInDashboard(task3));

// Try creating your own task filters using logical operators!
`);
    } else if (topic === 'increment-decrement') {
      setCode(`// Task Management App - Increment and Decrement Operations
// Learn to use ++ and -- operators for task counts and progress

// Basic counters
let totalTasks = 5;
let completedTasks = 0;

// Increment: increase by 1
completedTasks++;
console.log("Completed one task:", completedTasks);

// Increment again
completedTasks++;
console.log("Completed another task:", completedTasks);

// Decrement: decrease by 1
totalTasks--;
console.log("Removed a task, new total:", totalTasks);

// The difference between pre and post increment
let a = 5;
let b = a++; // Post-increment: assign first, then increment
console.log("a:", a, "b:", b); // a: 6, b: 5

let c = 5;
let d = ++c; // Pre-increment: increment first, then assign
console.log("c:", c, "d:", d); // c: 6, d: 6

// Task progress tracking
let taskProgress = 0;

// Increment by larger steps
taskProgress += 25; // Same as: taskProgress = taskProgress + 25
console.log("Progress after first step:", taskProgress + "%");

taskProgress += 25;
console.log("Progress after second step:", taskProgress + "%");

// Decrement
let daysRemaining = 7;
daysRemaining--; // One day passed
console.log("Days remaining:", daysRemaining);

// Compound assignment with other operators
let estimatedMinutes = 120;
estimatedMinutes /= 2; // Cut the time in half
console.log("New estimate:", estimatedMinutes, "minutes");

// Try writing your own increment/decrement operations for task management!
`);
    } else {
      // Default code example
      setCode(`// Task Management App - Part 2: Task Operations
// Let's perform calculations on our task data

// Task 1
let task1Name = "Complete JavaScript tutorial";
let task1Hours = 3.5;
let task1Progress = 25; // percentage
let task1Priority = 2; // 1=low, 2=medium, 3=high

// Task 2
let task2Name = "Build task manager app";
let task2Hours = 5;
let task2Progress = 10; // percentage
let task2Priority = 3; // 1=low, 2=medium, 3=high

// Calculate total time required
let totalHours = task1Hours + task2Hours;

// Calculate average progress
let averageProgress = (task1Progress + task2Progress) / 2;

// Calculate remaining hours for task 1
let task1RemainingHours = task1Hours * (100 - task1Progress) / 100;

// Calculate priority score (higher means do it first)
let task1Score = task1Priority * (100 - task1Progress) / 100;
let task2Score = task2Priority * (100 - task2Progress) / 100;

// Which task has higher priority score?
let highPriorityTask = task1Score > task2Score ? task1Name : task2Name;

// Display task information
console.log("Total project time: " + totalHours + " hours");
console.log("Average progress: " + averageProgress + "%");
console.log("Task 1 remaining time: " + task1RemainingHours.toFixed(1) + " hours");
console.log("High priority task: " + highPriorityTask);

// Try modifying these calculations or creating your own!
`);
    }
  }, [topic]);
  
  const [runtimeValues, setRuntimeValues] = useState<Record<string, any>>({});
  const [assignedValues, setAssignedValues] = useState<Record<string, string>>({});
  const [consoleOutput, setConsoleOutput] = useState<any[]>([]);
  const [executionPath, setExecutionPath] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isAutoExecute, setIsAutoExecute] = useState<boolean>(true);
  const [expressionResult, setExpressionResult] = useState<string | null>(null);
  const [isAIEnhanced, setIsAIEnhanced] = useState<boolean>(false);
  
  // Handle code changes (note: CodeMirror always returns string, never undefined)
  const handleCodeChange = (value: string) => {
    setCode(value);
  };
  
  // Auto-execute code when it changes (for real-time feedback)
  useEffect(() => {
    if (isAutoExecute) {
      executeCode();
    }
  }, [code, isAutoExecute]);

  const executeCode = async () => {
    setError(null);
    
    try {
      // Extract static variable declarations for comparing assigned vs runtime values
      const staticVars = extractVariableDeclarations(code);
      setAssignedValues(staticVars);
      
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
      
      // Set AI enhanced flag
      setIsAIEnhanced(!!result.aiEnhanced);
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

  const getTypeExplanation = (type: string): string => {
    switch(type) {
      case 'string': return 'string';
      case 'number': return 'number';
      case 'boolean': return 'true/boolean';
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

  return (
    <div className="lesson-container">
      <div className="lesson-header">
        <h1>Lesson 2: Basic Operations for Tasks</h1>
        <div className="lesson-meta">
          <div className="chapter-info">
            <span className="chapter-title">Chapter 1: Task Manager Fundamentals</span>
            <div className="lesson-navigation">
              {(() => {
                // Find current lesson in curriculum
                const currentLessonId = topic || 'basic-operations';
                
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
          <h2>Building a Task Manager: Operations</h2>
          <p className="compact">
            Building on the first lesson, we're now going to perform calculations on our 
            task data. In the demo app, you saw how tasks had progress percentages, priority 
            levels, and time estimates. Let's learn how to calculate these values.
          </p>
          
          <div className="bootdev-info-box compact">
            <h4>Project Progress</h4>
            <p>In Lesson 1, we created variables for our tasks. Now we're adding operations to:</p>
            <ul className="compact">
              <li>Calculate time remaining for tasks</li>
              <li>Determine priority scores to decide what to work on next</li>
              <li>Find average progress across multiple tasks</li>
              <li>Make decisions based on these calculations</li>
            </ul>
          </div>
          
          <div className="operations-grid" style={{ 
           
            gap: '1rem',
            margin: '1rem 0'
          }}>
            <div>
              <h3>Task Calculations</h3>
              <ul>
                <li><strong>Time estimates</strong>: Calculate total and remaining time</li>
                <li><strong>Progress tracking</strong>: Calculate completion percentages</li>
                <li><strong>Priority management</strong>: Determine which tasks to focus on</li>
                <li><strong>Deadline handling</strong>: Calculate days remaining</li>
              </ul>
            </div>
            
            <div>
              <h3>Task Operations Example</h3>
              <p className="compact">
                For our task manager, we'll use operations to calculate helpful metrics:
              </p>
              <pre className="code-example">
// Calculate remaining hours
let remainingHours = totalHours * (100 - progressPercent) / 100;</pre>
            </div>
          </div>
          
          <h3>Project Context</h3>
          <p className="compact">
            In our task manager, operations help us:
          </p>
          
          <div style={{ 
            
            gap: '1rem',
            margin: '1rem 0'
          }}>
            <div>
              <ol>
                <li>Prioritize which tasks to work on first</li>
                <li>Track progress toward project completion</li>
                <li>Estimate remaining time requirements</li>
                <li>Group and filter tasks based on properties</li>
              </ol>
            </div>
            
            <div className="operator-examples">
              <div className="example">
                <h4>Project Progress:</h4>
                <pre className="code-example">// Calculate overall project progress
let projectProgress = (task1Progress + task2Progress) / 2;</pre>
              </div>
              
              <div className="example">
                <h4>Priority Scoring:</h4>
                <pre className="code-example">// Higher score = higher priority
let priorityScore = priority * (daysLeft / totalDays);</pre>
              </div>
            </div>
          </div>
          
          <h3>Try It Yourself!</h3>
          <p className="compact">
            Edit the code on the right to create more useful task calculations. 
            Consider what metrics would be helpful in managing tasks.
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            margin: '1rem 0'
          }}>
            <div>
              <strong>Challenge 1:</strong> Calculate a deadline score based on due dates
            </div>
            <div>
              <strong>Challenge 2:</strong> Create a formula to balance priority and effort required
            </div>
            <div>
              <strong>Challenge 3:</strong> Calculate how many tasks can be completed in a given time period
            </div>
          </div>
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

          <div className="variables-panel">
            <h3>Variable Values</h3>
            {Object.keys(runtimeValues).length === 0 ? (
              <div className="empty-state">
                No variables created yet.
              </div>
            ) : (
              <div className="variables-list">
                <Row xs={1} className="g-3 justify-content-center">
                  {Object.entries(runtimeValues).map(([name, value]) => {
                    const type = getValueType(value);
                    const assignedValue = assignedValues[name] || 'unknown';
                    
                    return (
                      <Col key={name} className="">
                        <Card className={`variable-card type-${type}`}>
                          <Card.Header className="variable-name d-flex justify-content-between align-items-center">
                            {name}
                            {isAIEnhanced && value?.aiDescription && (
                              <Badge bg="info" pill title={value.aiDescription}>
                                <i className="bi bi-magic"></i> AI
                              </Badge>
                            )}
                          </Card.Header>
                          <Card.Body>
                            <Card.Title>Assigned Expression</Card.Title>
                            <Card.Text className="variable-assigned">{assignedValue}</Card.Text>
                            
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
                            
                            {isAIEnhanced && value?.aiDescription && (
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
              </div>
            )}
          </div>

          <div className="output-panel">
            {expressionResult && (
              <div className="expression-evaluation">
                <h3>Expression Evaluation</h3>
                <div className="expression-result">
                  {expressionResult}
                </div>
              </div>
            )}

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
  );
};

export default BasicOperationsLesson; 