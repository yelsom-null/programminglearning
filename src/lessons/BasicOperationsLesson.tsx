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

interface BasicOperationsLessonProps {
  darkMode?: boolean;
}

const BasicOperationsLesson: React.FC<BasicOperationsLessonProps> = ({ darkMode = false }) => {
  const [code, setCode] = useState<string>(
`// Task Management App - Part 2: Task Operations
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
`
  );
  
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
              <a 
                href="/lesson/variables-intro" 
                className="chapter-nav-button" 
                title="Previous: Variables"
              >
                ← Previous Lesson
              </a>
              <span className="lesson-indicator">Lesson 2 of 4</span>
              <a 
                href="/lesson/functions" 
                className="chapter-nav-button" 
                title="Next: Functions"
              >
                Next Lesson →
              </a>
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