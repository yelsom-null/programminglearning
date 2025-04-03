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
import VariablesCheckpointSystem from '../components/VariablesCheckpointSystem';
import VariablesModuleContent from '../components/VariablesModuleContent';
import { useParams, Link } from 'react-router-dom';
import curriculum from '../data/curriculum';

interface VariablesLessonProps {
  darkMode?: boolean;
  moduleId?: number;
  step?: number;
  topic?: string;
}

const VariablesLesson: React.FC<VariablesLessonProps> = ({ 
  darkMode = false, 
  moduleId: initialModuleId = 1,
  step: initialStep = 0,
  topic
}) => {
  // Define the initial code samples for each module
  const initialCodeByModule = {
    1: `// Task Management App - Variables Basics
// Variables are containers for storing data values

// Create your task variables below:




`,
    2: `// Task Management App - Variable Types
// In this module, you'll explore different types of variables for tasks.

// You'll build on what you learned in Module 1 by creating
// variables with different data types for your task.

// The code editor is empty - follow the module instructions to create:
// - String variables (for text)
// - Number variables (for quantities)
// - Boolean variables (for true/false states)

`,
    3: `// Task Management App - Variable Manipulation
// In this module, you'll learn how to update and modify variables.

// First, set up some initial task state:
let taskName = "Create project plan";
let progress = 40;
let estimatedHours = 6;
let isCompleted = false;

// Display initial state
console.log("Task: " + taskName);
console.log("Current progress: " + progress + "%");
console.log("Initial estimate: " + estimatedHours + " hours");

// Follow the module instructions to update these variables
// and create formulas to track task progress.

`,
    4: `// Task Management App - Multiple Tasks
// In this module, you'll manage variables for multiple tasks.

// Follow the module instructions to:
// 1. Create variables for multiple tasks
// 2. Compare tasks based on their properties
// 3. Calculate overall progress
// 4. Create a task summary report

`
  };
  
  // Add the ability to preserve variables between modules
  const [variablesByModule, setVariablesByModule] = useState<Record<number, Record<string, any>>>({
    1: {},
    2: {},
    3: {},
    4: {},
    5: {}
  });
  
  const [currentModule, setCurrentModule] = useState(initialModuleId);
  const [code, setCode] = useState('');
  const [runtimeValues, setRuntimeValues] = useState<Record<string, any>>({});
  const [consoleOutput, setConsoleOutput] = useState<any[]>([]);
  const [executionPath, setExecutionPath] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState<number>(initialStep);
  const [error, setError] = useState<string | null>(null);
  
  // Only set the initial code the first time component loads
  useEffect(() => {
    if (initialModuleId && initialModuleId in initialCodeByModule) {
      setCode(initialCodeByModule[initialModuleId as keyof typeof initialCodeByModule]);
    } else {
      setCode(initialCodeByModule[1]);
    }
    // We only want this to run once when the component mounts
  }, []);
  
  // Handle topic-specific content if specified
  useEffect(() => {
    if (topic) {
      // You could set specific code examples based on the topic
      if (topic === 'undefined-undeclared') {
        setCode(`// Understanding Undefined vs Undeclared Variables
let declaredVar;  // declared but not assigned a value (undefined)
console.log("declaredVar:", declaredVar);

// console.log("undeclaredVar:", undeclaredVar);  // Uncomment to see error

// Checking for undefined
if (declaredVar === undefined) {
  console.log("declaredVar is undefined");
}

// Safely checking for existence
if (typeof declaredVar !== "undefined") {
  console.log("declaredVar exists");
}

// Example with functions
function returnNothing() {
  // No return statement
}

let result = returnNothing();
console.log("Function result:", result);  // undefined
`);
      } else if (topic === 'null-undefined') {
        setCode(`// Understanding null vs undefined
// undefined: variable is declared but has no value assigned
let emptyVar;
console.log("emptyVar:", emptyVar);

// null: explicitly assigned "no value"
let nullVar = null;
console.log("nullVar:", nullVar);

// Comparing null and undefined
console.log("null == undefined:", null == undefined);    // true (loose equality)
console.log("null === undefined:", null === undefined);  // false (strict equality)

// Checking for null or undefined
function processValue(value) {
  // Check for both null and undefined
  if (value == null) {
    console.log("Value is either null or undefined");
    return;
  }
  console.log("Processing:", value);
}

processValue(emptyVar);
processValue(nullVar);
processValue("Hello");

// When to use null
let user = {
  name: "John",
  email: null  // Explicitly set to null (user has no email)
};

console.log("User has email?", user.email !== null);
`);
      }
    }
  }, [topic]);
  
  // Handle moduleId and step changes
  useEffect(() => {
    if (initialModuleId !== 1) {
      setCurrentModule(initialModuleId);
    }
    if (initialStep !== 0) {
      setActiveStep(initialStep);
    }
  }, [initialModuleId, initialStep]);
  
  // Store variables when module is completed
  useEffect(() => {
    if (Object.keys(runtimeValues).length > 0) {
      setVariablesByModule(prev => ({
        ...prev,
        [currentModule]: runtimeValues
      }));
    }
  }, [runtimeValues, currentModule]);
  
  // Handle code changes and track modifications
  const handleCodeChange = (value: string) => {
    setCode(value);
  };
  
  // Auto-execute code when it changes (for real-time feedback)
  React.useEffect(() => {
    executeCode();
  }, [code]);

  const executeCode = async () => {
    setError(null);
    
    try {
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
      
      // If AI enhanced, we can use execution path for visualization
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

  return (
    <div className="lesson-container">
      <div className="lesson-header">
        <h1>Lesson 1: Building with Variables</h1>
        <div className="lesson-meta">
          <div className="chapter-info">
            <span className="chapter-title">Chapter 1: Task Manager Fundamentals</span>
            <div className="lesson-navigation">
              {(() => {
                // Find current lesson in curriculum
                const currentLessonId = topic || 
                  (initialModuleId === 5 ? 'console' : 'variables-intro');
                
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
         
          
          {/* Module Content Component */}
          <VariablesModuleContent 
            moduleId={currentModule}
            darkMode={darkMode}
            code={code}
            onCodeChange={handleCodeChange}
            runtimeValues={runtimeValues}
            consoleOutput={consoleOutput}
          />
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

export default VariablesLesson; 