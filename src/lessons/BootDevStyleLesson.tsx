import React, { useState, useEffect } from 'react';
import CodeEditor from '../components/CodeEditor';
import { evaluateCodeSafely } from '../utils/codeAnalysis';
import '../styles/LessonStyles.css';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

interface BootDevStyleLessonProps {
  darkMode?: boolean;
}

const BootDevStyleLesson: React.FC<BootDevStyleLessonProps> = ({ darkMode = false }) => {
  const [code, setCode] = useState<string>(
`// Let's learn about JavaScript functions!
function greet(name) {
  return "Hello, " + name + "!";
}

// Call the function with your name
const message = greet("world");

// Let's create another function
function addNumbers(a, b) {
  return a + b;
}

// Try calling this function
const sum = addNumbers(5, 3);

// You can see the results in the output panel
console.log(message);
console.log("Sum:", sum);
`
  );
  
  const [runtimeValues, setRuntimeValues] = useState<Record<string, any>>({});
  const [consoleOutput, setConsoleOutput] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAutoExecute, setIsAutoExecute] = useState<boolean>(true);
  const [activeExercise, setActiveExercise] = useState<number>(0);
  
  useEffect(() => {
    if (isAutoExecute) {
      executeCode();
    }
  }, [code, isAutoExecute]);

  const executeCode = () => {
    setError(null);
    
    try {
      const result = evaluateCodeSafely(code);
      
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const getValueType = (value: any): string => {
    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
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
      case 'function': return 'secondary';
      default: return 'light';
    }
  };

  const formatValue = (value: any): string => {
    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    if (typeof value === 'string') return `"${value}"`;
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch (e) {
        return `${value}`;
      }
    }
    return `${value}`;
  };

  const exercises = [
    {
      title: "Creating a Function",
      description: "Create a function that takes a person's name and returns a greeting.",
      codeTemplate: 
`// Create a function called 'sayHello' that takes a name parameter
// and returns "Hello, [name]!"

// Your code here


// Test your function
console.log(sayHello("JavaScript"));`,
      hint: "Remember to use the 'function' keyword, include parameters, and use the return keyword."
    },
    {
      title: "Function with Multiple Parameters",
      description: "Create a function that calculates the area of a rectangle.",
      codeTemplate:
`// Create a function called 'calculateArea' that takes width and height parameters
// and returns the area (width * height)

// Your code here


// Test your function with different values
console.log(calculateArea(5, 3));
console.log(calculateArea(7, 2));`,
      hint: "Multiply the width and height parameters and return the result."
    },
    {
      title: "Function with Conditional Logic",
      description: "Create a function that determines if a number is even or odd.",
      codeTemplate:
`// Create a function called 'isEven' that takes a number parameter
// and returns true if the number is even, false if it's odd

// Your code here


// Test your function with different values
console.log(isEven(4));
console.log(isEven(7));`,
      hint: "Use the modulo operator (%) to check if a number is divisible by 2."
    }
  ];

  const loadExercise = (index: number) => {
    setActiveExercise(index);
    setCode(exercises[index].codeTemplate);
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  return (
    <div className="bootdev-lesson-container">
      <div className="bootdev-lesson-header">
        <h1>JavaScript Functions</h1>
        <div className="bootdev-lesson-controls">
          <label className="auto-execute-toggle">
            <input 
              type="checkbox" 
              checked={isAutoExecute} 
              onChange={() => setIsAutoExecute(!isAutoExecute)} 
            />
            Auto-Run Code
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

      <div className="bootdev-lesson-content">
        <div className="bootdev-theory-panel">
          <div className="bootdev-lesson-section">
            <h2>Functions in JavaScript</h2>
            <p>
              Functions are reusable blocks of code that perform a specific task. They help make 
              your code more organized and maintainable.
            </p>
            
            <div className="bootdev-code-example">
              <pre>
{`function functionName(parameter1, parameter2) {
  // Code to be executed
  return result;
}`}
              </pre>
            </div>
            
            <h3>Key Concepts</h3>
            <ul>
              <li><strong>Function Declaration:</strong> Uses the <code>function</code> keyword</li>
              <li><strong>Parameters:</strong> Values the function accepts</li>
              <li><strong>Return Statement:</strong> What the function gives back</li>
              <li><strong>Function Call:</strong> How you use the function</li>
            </ul>
            
            <div className="bootdev-info-box">
              <h4>Why Use Functions?</h4>
              <ul>
                <li>Reuse code without repeating it</li>
                <li>Break down complex problems into smaller parts</li>
                <li>Make your code easier to test and debug</li>
              </ul>
            </div>
            
            <h3>Examples</h3>
            <div className="bootdev-code-example">
              <h4>Simple Function</h4>
              <pre>
{`function greet(name) {
  return "Hello, " + name + "!";
}

// Calling the function
const greeting = greet("World");
console.log(greeting); // Outputs: "Hello, World!"`}
              </pre>
            </div>
            
            <div className="bootdev-code-example">
              <h4>Function with Multiple Parameters</h4>
              <pre>
{`function add(a, b) {
  return a + b;
}

const sum = add(5, 3);
console.log(sum); // Outputs: 8`}
              </pre>
            </div>
          </div>
        </div>

        <div className="bootdev-practice-panel">
          <div className="bootdev-editor-section">
            <div className="bootdev-tabs">
              {exercises.map((exercise, index) => (
                <button
                  key={index}
                  className={`bootdev-tab ${activeExercise === index ? 'active' : ''}`}
                  onClick={() => loadExercise(index)}
                >
                  Exercise {index + 1}
                </button>
              ))}
            </div>
            
            <div className="bootdev-exercise-instructions">
              <h3>{exercises[activeExercise].title}</h3>
              <p>{exercises[activeExercise].description}</p>
              <div className="bootdev-hint">
                <details>
                  <summary>Hint</summary>
                  <p>{exercises[activeExercise].hint}</p>
                </details>
              </div>
            </div>
            
            <div className="bootdev-code-editor">
              <CodeEditor
                value={code}
                onChange={handleCodeChange}
                darkMode={darkMode}
              />
            </div>
            
            {error && (
              <div className="bootdev-error-message">
                {error}
              </div>
            )}
          </div>
          
          <div className="bootdev-output-section" style={{ gridTemplateColumns: "1fr", maxHeight: "none" }}>
            <div className="bootdev-output-panel" style={{ width: "100%" }}>
              <h3>Output</h3>
              <div className="bootdev-console-output" style={{ maxHeight: "none" }}>
                {consoleOutput.length > 0 ? (
                  consoleOutput.map((output, index) => (
                    <div key={index} className="bootdev-console-line">
                      {formatValue(output)}
                    </div>
                  ))
                ) : (
                  <div className="bootdev-empty-state">
                    <p>Your code output will appear here.</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bootdev-variables-panel" style={{ width: "100%" }}>
              <h3>Variables</h3>
              {Object.entries(runtimeValues).length > 0 ? (
                <Row xs={1} className="g-3 justify-content-center">
                  {Object.entries(runtimeValues).map(([name, value]) => {
                    const type = getValueType(value);
                    return (
                      <Col key={name} className="col-md-6">
                        <Card className={`variable-card type-${type}`}>
                          <Card.Header className="variable-name d-flex justify-content-between align-items-center">
                            {name}
                          </Card.Header>
                          <Card.Body>
                            <Card.Title>Value</Card.Title>
                            <Card.Text className="variable-value">{formatValue(value)}</Card.Text>
                            
                            <div className="variable-type-container mt-2">
                              <span className={`variable-type-badge bg-${getTypeColor(type)}`}>
                                {type}
                              </span>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              ) : (
                <div className="bootdev-empty-state">
                  <p>No variables created yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BootDevStyleLesson; 