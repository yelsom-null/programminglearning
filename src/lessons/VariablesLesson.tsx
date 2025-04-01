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

interface VariablesLessonProps {
  darkMode?: boolean;
}

const VariablesLesson: React.FC<VariablesLessonProps> = ({ darkMode = false }) => {
  const [code, setCode] = useState<string>(
`// Try changing these variables and see what happens!
let name = "Alex";
let age = 25;
let isStudent = true;

// You can also change the values after declaring them
age = age + 1;
name = name + " Smith";

// Try adding your own variables below
`
  );
  
  const [runtimeValues, setRuntimeValues] = useState<Record<string, any>>({});
  const [consoleOutput, setConsoleOutput] = useState<any[]>([]);
  const [executionPath, setExecutionPath] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isAutoExecute, setIsAutoExecute] = useState<boolean>(true);
  
  // Handle code changes for CodeMirror
  const handleCodeChange = (value: string) => {
    setCode(value);
  };
  
  // Auto-execute code when it changes (for real-time feedback)
  React.useEffect(() => {
    if (isAutoExecute) {
      executeCode();
    }
  }, [code, isAutoExecute]);

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
        <h1>Lesson 2: Variables and Data Types</h1>
        <div className="lesson-controls">
          <label className="auto-execute-toggle">
            <input 
              type="checkbox" 
              checked={isAutoExecute} 
              onChange={() => setIsAutoExecute(!isAutoExecute)} 
            />
            Auto-Execute Code
          </label>
          {!isAutoExecute && (
            <button 
              className="execute-button" 
              onClick={executeCode}
            >
              Run Code
            </button>
          )}
        </div>
      </div>

      <div className="lesson-content">
        <div className="explanation-panel">
          <h2>What are Variables?</h2>
          <p>
            Variables are like labeled containers that store data in your program. 
            They let you save information to use later.
          </p>
          
          <h3>Creating Variables</h3>
          <p>
            In JavaScript, we create variables using <code>let</code>, <code>const</code>, or <code>var</code>.
            Here's how to create a variable:
          </p>
          <pre className="code-example">let name = "Alex";</pre>
          
          <h3>Data Types</h3>
          <p>Variables can store different types of data:</p>
          <ul>
            <li><strong>Strings</strong>: Text values in quotes - <code>"Hello"</code></li>
            <li><strong>Numbers</strong>: Numeric values - <code>42</code>, <code>3.14</code></li>
            <li><strong>Booleans</strong>: True/false values - <code>true</code>, <code>false</code></li>
            <li><strong>Objects</strong>: Collections of related values</li>
            <li><strong>Arrays</strong>: Lists of values</li>
            <li><strong>Undefined</strong>: When a variable has no value assigned</li>
          </ul>
          
          <h3>Changing Variable Values</h3>
          <p>
            After creating a variable, you can change its value:
          </p>
          <pre className="code-example">
            let score = 0;
            score = 10; // Now score is 10
          </pre>
          
          <h3>Try It Yourself!</h3>
          <p>
            Edit the code on the right. Watch how the variables change in real-time!
          </p>
          <ul>
            <li>Try changing the values of the existing variables</li>
            <li>Add your own new variables</li>
            <li>Try different data types</li>
          </ul>
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
                    No variables created yet. Try running the code!
                  </div>
                ) : (
                  <Row xs={1} md={2} lg={3} className="g-3">
                    {Object.entries(runtimeValues).map(([name, value]) => {
                      const type = getValueType(value);
                      return (
                        <Col key={name}>
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

      <div className="lesson-footer">
        <div className="exercise-section">
          <h3>Exercises</h3>
          <div className="exercise-list">
            <div className="exercise-item">
              <h4>Exercise 1: Personal Profile</h4>
              <p>Create variables for a person's profile including name, age, and occupation.</p>
              <button className="load-exercise" onClick={() => setCode(
`// Exercise 1: Create variables for a person's profile
let name = "";
let age = 0;
let occupation = "";

// Now assign values to each variable


// Try changing their values


// Print a greeting using these variables
console.log("Hello!");
`
              )}>Load Exercise</button>
            </div>
            
            <div className="exercise-item">
              <h4>Exercise 2: Game Stats</h4>
              <p>Create variables to track a player's score, lives, and level in a game.</p>
              <button className="load-exercise" onClick={() => setCode(
`// Exercise 2: Game Stats
// Create and set variables for a player's:
// - score
// - lives
// - level


// Increase the score by 100


// Remove one life


// Level up the player


// Display the current stats
console.log("Game stats:");
`
              )}>Load Exercise</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariablesLesson; 