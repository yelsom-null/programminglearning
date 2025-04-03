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

interface NullUndefinedLessonProps {
  darkMode?: boolean;
}

const NullUndefinedLesson: React.FC<NullUndefinedLessonProps> = ({ 
  darkMode = false
}) => {
  // Initial code sample
  const initialCode = `// Null vs Undefined in Task Management

// PART 1: Understanding the Difference
// ====================================

// undefined: variable is declared but has no value assigned
let taskDueDate;
console.log("1. Undefined variable:", taskDueDate);  // undefined

// null: explicitly assigned "no value"
let taskAssignee = null;
console.log("2. Null variable:", taskAssignee);  // null

// Type checking
console.log("3. typeof undefined:", typeof undefined);  // "undefined"
console.log("4. typeof null:", typeof null);  // "object" (JS quirk)

// Equality comparisons
console.log("5. null == undefined:", null == undefined);    // true (loose equality)
console.log("6. null === undefined:", null === undefined);  // false (strict equality)

// PART 2: Task Management with null and undefined
// ==============================================

// Task object with intentional null values and missing properties
let task = {
  id: 123,
  title: "Setup project repository", 
  description: "Create initial folder structure and config files",
  dueDate: "2023-12-31",
  assignee: null,              // explicitly no assignee yet
  completedDate: null,         // explicitly not completed
  priority: "high",
  // tags property is missing (will be undefined when accessed)
};

// Accessing properties
console.log("7. Task assignee:", task.assignee);       // null (explicitly set)
console.log("8. Task tags:", task.tags);               // undefined (property doesn't exist)

// PART 3: Different Ways to Check for Empty Values
// ===============================================

// Checking for null
if (task.assignee === null) {
  console.log("9. Task needs to be assigned");
}

// Checking for undefined
if (task.tags === undefined) {
  console.log("10. No tags have been added to this task");
}

// Checking for either null or undefined (unsafe)
if (!task.assignee) {
  console.log("11. Task assignee is empty (null)");
}

if (!task.tags) {
  console.log("12. Task tags is empty (undefined)");
}

// Beware: This approach also catches other falsy values like 0 and ""
let urgentTask = {
  title: "Fix critical bug",
  priority: 0  // 0 = lowest priority in this system
};

if (!urgentTask.priority) {
  // This will incorrectly run even though priority exists but is 0
  console.log("13. WARNING: This runs even though priority exists!");
}

// PART 4: Best Practices for Checking Empty Values
// ==============================================

// 1. Checking for either null or undefined specifically
function isNullOrUndefined(value) {
  return value == null;  // Uses loose equality (==)
  // This works because null == undefined is true
}

console.log("14. isNullOrUndefined(null):", isNullOrUndefined(null));            // true
console.log("15. isNullOrUndefined(undefined):", isNullOrUndefined(undefined));  // true
console.log("16. isNullOrUndefined(0):", isNullOrUndefined(0));                  // false
console.log("17. isNullOrUndefined(''):", isNullOrUndefined(""));                // false

// 2. Using the nullish coalescing operator (??) for default values
function getTaskDuration(task) {
  // If duration is null or undefined, use default value
  return task.duration ?? 1;  // Default to 1 hour
}

let projectTask = { title: "Project planning", duration: 2 };
let meetingTask = { title: "Team meeting", duration: 0 };
let unknownTask = { title: "New task" };  // no duration property
let emptyTask = { title: "Empty task", duration: null };

console.log("18. Task durations:");
console.log("   - Project:", getTaskDuration(projectTask));  // 2 (uses actual value)
console.log("   - Meeting:", getTaskDuration(meetingTask));  // 0 (preserves zero)
console.log("   - Unknown:", getTaskDuration(unknownTask));  // 1 (uses default - undefined)
console.log("   - Empty:", getTaskDuration(emptyTask));      // 1 (uses default - null)

// 3. Using optional chaining (?.) for safe property access
let taskCollection = {
  categories: {
    development: [
      { title: "Fix login bug" },
      { title: "Update API endpoints" }
    ]
    // design category is missing
  }
};

// Safe access with optional chaining
let designTasks = taskCollection.categories?.design?.length ?? 0;
console.log("19. Design tasks:", designTasks);  // 0 (safe access to missing property)

// Without optional chaining this would cause an error:
// let designTasks = taskCollection.categories.design.length;  // Error!

// PART 5: When to Use Each in Task Management
// =========================================

// Use null when:
let userTask = {
  title: "Review documentation",
  assignee: null,      // Explicitly no assignee yet
  dueDate: null,       // Explicitly no due date
  parentTask: null     // Explicitly not a subtask
};

// Use undefined (implicitly) when something just doesn't exist:
let simpleTask = {
  title: "Quick fix"
  // All other properties are undefined because they don't exist
};

// PART 6: Creating a Function to Format Task Info
// ============================================

function formatTaskInfo(task) {
  // Default values using nullish coalescing operator
  const title = task.title ?? "Untitled Task";
  const assignee = task.assignee ?? "Unassigned";
  const dueDate = task.dueDate ?? "No due date";
  const description = task.description ?? "No description provided";
  
  return \`
  TASK: \${title}
  ASSIGNEE: \${assignee}
  DUE: \${dueDate}
  DESCRIPTION: \${description}
  \`;
}

// Test with different tasks
const tasks = [
  {
    id: 1,
    title: "Complete project",
    dueDate: "2023-12-31",
    assignee: null,  // explicitly not assigned
    description: undefined  // implicitly missing
  },
  {
    id: 2,
    title: "Review code"
    // dueDate is missing
    // assignee is missing
    // description is missing
  }
];

console.log("20. Formatted task info:");
console.log(formatTaskInfo(tasks[0]));
console.log(formatTaskInfo(tasks[1]));`;
  
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
        <h1>Lesson 7: Null and Undefined</h1>
        <div className="lesson-meta">
          <div className="chapter-info">
            <span className="chapter-title">Chapter 1: Task Manager Fundamentals</span>
            <div className="lesson-navigation">
              {(() => {
                // Find current lesson in curriculum
                const currentLessonId = "null-undefined";
                
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
          <h2>Null vs. Undefined</h2>
          <p>
            When working with task management systems, you'll often need to represent missing or empty values.
            JavaScript provides two ways to express "emptiness": <code>null</code> and <code>undefined</code>.
            Understanding the difference is crucial for effective data handling.
          </p>
          
          <h3>Understanding the Difference</h3>
          <p>
            While both represent "empty" values, they serve different purposes:
          </p>
          
          <div className="code-example">
{`// undefined: Variable declared but not assigned a value
let taskDueDate;
console.log(taskDueDate);  // undefined

// null: Explicitly assigned "no value"
let taskAssignee = null;
console.log(taskAssignee);  // null

// Technical differences
console.log(typeof undefined);  // "undefined"
console.log(typeof null);       // "object" (a quirk in JavaScript)

// Equality comparison
console.log(null == undefined);   // true (loose equality)
console.log(null === undefined);  // false (strict equality)`}
          </div>
          
          <h3>When to Use <code>null</code></h3>
          <p>
            Use <code>null</code> when you want to explicitly indicate "no value" as an intentional state:
          </p>
          
          <div className="code-example">
{`// Examples of when to use null in task management
let task = {
  title: "Complete project",
  assignee: null,         // Explicitly no one is assigned yet
  dueDate: "2023-12-31",
  completedDate: null,    // Explicitly not completed yet
  parentTask: null        // Explicitly not a subtask
};

// Checking for null
if (task.assignee === null) {
  console.log("This task needs to be assigned");
}

// Null represents an intentional absence
function unassignTask(task) {
  task.assignee = null;   // Deliberately removing the assignee
  return task;
}`}
          </div>
          
          <h3>When to Expect <code>undefined</code></h3>
          <p>
            <code>undefined</code> typically occurs in several situations:
          </p>
          
          <div className="code-example">
{`// 1. Uninitialized variables
let newTask;
console.log(newTask);  // undefined

// 2. Missing object properties
let task = { title: "Debug application" };
console.log(task.dueDate);  // undefined (property doesn't exist)

// 3. Function parameters not provided
function createTask(title, dueDate) {
  console.log("Due date:", dueDate);  // undefined if not provided
  // ...function body
}
createTask("New feature");  // Only providing the title parameter

// 4. Function without a return statement
function processTask(task) {
  // No return statement
}
let result = processTask({});
console.log(result);  // undefined`}
          </div>
          
          <h3>Safe Handling of Empty Values</h3>
          <p>
            There are several modern approaches to handle both <code>null</code> and <code>undefined</code>:
          </p>
          
          <div className="code-example">
{`// 1. Nullish coalescing operator (??) for default values
function getTaskDuration(task) {
  // If duration is null or undefined, use default value
  return task.duration ?? 1;  // Default to 1 hour
}

// The ?? operator only replaces null/undefined
// (unlike || which also replaces "", 0, false)
let tasks = [
  { title: "Task 1", priority: 0 },       // priority is 0 (valid value)
  { title: "Task 2", priority: null }     // priority is null (empty)
];

console.log(tasks[0].priority ?? "default");  // 0 (preserves 0)
console.log(tasks[0].priority || "default");  // "default" (replaces 0)

// 2. Optional chaining (?.) for safe property access
let taskCollection = {
  categories: {
    development: [
      { title: "Fix login bug" }
    ]
    // design category doesn't exist
  }
};

// Safe access with optional chaining
let designTasks = taskCollection.categories?.design?.length ?? 0;
console.log("Design tasks:", designTasks);  // 0 (safe access)`}
          </div>
          
          <h3>Best Practices for Task Management</h3>
          <p>
            Apply these patterns when building your task management system:
          </p>
          <ul>
            <li>Use <code>null</code> for intentional emptiness (e.g., no assignee)</li>
            <li>Initialize variables with appropriate default values</li>
            <li>Use the nullish coalescing operator (<code>??</code>) for default values</li>
            <li>Use optional chaining (<code>?.</code>) for safe property access</li>
            <li>Be consistent with how you represent missing data</li>
          </ul>
          
          <div className="code-example">
{`// Example of a robust task formatter
function formatTaskInfo(task) {
  return {
    title: task.title ?? "Untitled Task",
    assignee: task.assignee ?? "Unassigned",
    dueDate: task.dueDate ?? "No due date",
    priority: task.priority ?? "Medium",
    status: task.status ?? "Not started",
    description: task.description ?? "No description provided",
    tags: task.tags ?? [],
    subtasks: task.subtasks?.length ?? 0
  };
}

// This safely handles any missing properties with sensible defaults`}
          </div>
          
          <p>
            Try experimenting with the code editor to practice handling <code>null</code> and <code>undefined</code> values!
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

export default NullUndefinedLesson; 