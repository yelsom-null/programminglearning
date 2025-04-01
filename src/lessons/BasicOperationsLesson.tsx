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
`// Try these arithmetic operations
let x = 5;
let y = 3;

// Addition
let sum = x + y;

// Subtraction
let difference = x - y;

// Multiplication
let product = x * y;

// Division
let quotient = x / y;

// Remainder (modulus)
let remainder = x % y;

// Try different operations and see how they work!
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
        <h1>Lesson 3: Basic Operations and Expressions</h1>
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
          <h2>Arithmetic Operations</h2>
          <p className="compact">
            Programming languages let you perform calculations using familiar 
            mathematical operations:
          </p>
          
          <div className="operations-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: '38.2% 61.8%',
            gap: '1rem',
            margin: '1rem 0'
          }}>
            <div>
              <ul>
                <li><strong>Addition (+)</strong>: Adds values together</li>
                <li><strong>Subtraction (-)</strong>: Finds the difference between values</li>
                <li><strong>Multiplication (*)</strong>: Multiplies values</li>
                <li><strong>Division (/)</strong>: Divides values</li>
                <li><strong>Remainder (%)</strong>: Returns what's left after division</li>
              </ul>
            </div>
            
            <div>
              <h3>Expressions</h3>
              <p className="compact">
                An expression is a combination of values, variables, and operators that 
                evaluates to a single value. For example:
              </p>
              <pre className="code-example">let result = 2 + 3 * 4;</pre>
            </div>
          </div>
          
          <h3>Operator Precedence</h3>
          <p className="compact">
            Like in mathematics, some operations happen before others:
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '38.2% 61.8%',
            gap: '1rem',
            margin: '1rem 0'
          }}>
            <div>
              <ol>
                <li>Operations in parentheses happen first: <code>(2 + 3) * 4</code></li>
                <li>Multiplication and division happen before addition and subtraction</li>
                <li>When operators have the same precedence, they evaluate from left to right</li>
              </ol>
            </div>
            
            <div className="operator-examples">
              <div className="example">
                <h4>Example 1:</h4>
                <pre className="code-example">let result = 2 + 3 * 4;</pre>
                <p>Evaluates to 14 (not 20) because multiplication happens first</p>
              </div>
              
              <div className="example">
                <h4>Example 2:</h4>
                <pre className="code-example">let result = (2 + 3) * 4;</pre>
                <p>Evaluates to 20 because parentheses group the addition</p>
              </div>
            </div>
          </div>
          
          <h3>Try It Yourself!</h3>
          <p className="compact">
            Edit the code on the right to experiment with different operations 
            and expressions. Watch how the values change!
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            margin: '1rem 0'
          }}>
            <div>
              <strong>Challenge 1:</strong> Calculate the area of a rectangle (length × width)
            </div>
            <div>
              <strong>Challenge 2:</strong> Convert temperature from Celsius to Fahrenheit (C × 9/5 + 32)
            </div>
            <div>
              <strong>Challenge 3:</strong> Create a complex expression using parentheses
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
                No variables created yet. Try running the code!
              </div>
            ) : (
              <div className="variables-list">
                <Row xs={1} md={2} lg={3} className="g-3">
                  {Object.entries(runtimeValues).map(([name, value]) => {
                    const type = getValueType(value);
                    const assignedValue = assignedValues[name] || 'unknown';
                    
                    return (
                      <Col key={name}>
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

      <div className="lesson-footer">
        <div className="exercise-section">
          <h3>Exercises</h3>
          <div className="exercise-list">
            <div className="exercise-item">
              <h4>Exercise 1: Rectangle Calculator</h4>
              <p>Calculate the area and perimeter of a rectangle.</p>
              <button className="load-exercise" onClick={() => setCode(
`// Exercise 1: Rectangle Calculator
let length = 5;
let width = 3;

// Calculate the area (length × width)
let area;

// Calculate the perimeter (2 × length + 2 × width)
let perimeter;

// Display the results
console.log("Rectangle dimensions: " + length + " × " + width);
console.log("Area: ");
console.log("Perimeter: ");`
              )}>Load Exercise</button>
            </div>
            
            <div className="exercise-item">
              <h4>Exercise 2: Temperature Converter</h4>
              <p>Convert temperature from Celsius to Fahrenheit.</p>
              <button className="load-exercise" onClick={() => setCode(
`// Exercise 2: Temperature Converter
let celsius = 25;

// Convert to Fahrenheit: (C × 9/5) + 32
let fahrenheit;

// Display the result
console.log(celsius + "°C is equal to " + fahrenheit + "°F");`
              )}>Load Exercise</button>
            </div>
            
            <div className="exercise-item">
              <h4>Exercise 3: Expression Evaluator</h4>
              <p>Practice with different expressions and operator precedence.</p>
              <button className="load-exercise" onClick={() => setCode(
`// Exercise 3: Expression Evaluator
// Evaluate each expression and store the result

// Expression 1: Simple arithmetic
let result1 = 10 + 5 * 2;

// Expression 2: With parentheses
let result2 = (10 + 5) * 2;

// Expression 3: Mixed operations
let result3 = 20 / 4 + 3 * 2;

// Expression 4: Create your own complex expression
let result4;

// Display all results
console.log("Result 1: " + result1);
console.log("Result 2: " + result2);
console.log("Result 3: " + result3);`
              )}>Load Exercise</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicOperationsLesson; 