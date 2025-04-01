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

interface BootDevVariablesLessonProps {
  darkMode?: boolean;
}

const BootDevVariablesLesson: React.FC<BootDevVariablesLessonProps> = ({ darkMode = false }) => {
  const [code, setCode] = useState<string>(
`// Try declaring and using variables
let name = "JavaScript";
let year = 1995;
let isAwesome = true;

// You can print values using console.log
console.log("Language: " + name);
console.log("Created in: " + year);
console.log("Is it awesome? " + isAwesome);

// Try changing these values or creating your own variables!
`
  );
  
  const [runtimeValues, setRuntimeValues] = useState<Record<string, any>>({});
  const [consoleOutput, setConsoleOutput] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAutoExecute, setIsAutoExecute] = useState<boolean>(true);
  const [activeExercise, setActiveExercise] = useState<number>(0);
  const [currentTheorySection, setCurrentTheorySection] = useState<number>(0);
  
  useEffect(() => {
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

  const exercises = [
    {
      title: "Declaring Variables",
      description: "Practice declaring variables with let, const, and var.",
      codeTemplate: 
`// Create three variables using different declaration keywords
// 1. Use 'let' to declare a variable called 'score' with a value of 42

// 2. Use 'const' to declare a variable called 'playerName' with your name

// 3. Use 'var' (older style) to declare a variable called 'gameTitle'

// Print all three variables
console.log("Score: ");
console.log("Player: ");
console.log("Game: ");`,
      hint: "Remember that 'const' variables cannot be reassigned later, while 'let' and 'var' can be changed."
    },
    {
      title: "Working with Data Types",
      description: "Experiment with different JavaScript data types.",
      codeTemplate:
`// Create variables with different data types
// 1. A number
let count = 10;

// 2. A string
let message = "Hello";

// 3. A boolean
let isActive = true;

// 4. An array (list of values)
let colors = ["red", "green", "blue"];

// 5. An object (collection of related data)
let person = {
  name: "Alex",
  age: 25
};

// Try accessing and modifying these variables
// For example, change the count or add to the colors array

// Print results to see what happened
console.log(count);
console.log(message);
console.log(isActive);
console.log(colors);
console.log(person);`,
      hint: "To access object properties, use dot notation like 'person.name' or bracket notation like 'person['name']'."
    },
    {
      title: "Working with Classes",
      description: "Create and use JavaScript classes to understand objects better.",
      codeTemplate:
`// Define a class for a Game Character
class Character {
  constructor(name, health, power) {
    this.name = name;
    this.health = health;
    this.power = power;
    this.level = 1;
  }
  
  levelUp() {
    this.level += 1;
    this.health += 10;
    this.power += 5;
  }
  
  describe() {
    return \`\${this.name} (Level \${this.level}): \${this.health} HP, \${this.power} power\`;
  }
}

// Create a character
const hero = new Character("Hero", 100, 15);

// Try using the character methods
hero.levelUp();
console.log(hero.describe());

// Create your own character
const villain = new Character("Dragon", 200, 25);
console.log(villain.describe());

// Define a different class (e.g., for a vehicle, pet, etc.)
class Vehicle {
  constructor(make, model, year) {
    this.make = make;
    this.model = model;
    this.year = year;
    this.speed = 0;
  }
  
  accelerate(amount) {
    this.speed += amount;
    return this.speed;
  }
}

// Create an instance of your class
const car = new Vehicle("Toyota", "Corolla", 2023);

// Try using its methods
car.accelerate(20);
console.log(\`The \${car.make} \${car.model} is going \${car.speed} mph\`);`,
      hint: "Classes in JavaScript use the 'constructor' method to initialize new instances. Methods defined in the class are available on all instances."
    },
    {
      title: "Variable Operations",
      description: "Perform operations with variables of different types.",
      codeTemplate:
`// 1. Create two number variables
let x = 5;
let y = 3;

// 2. Perform basic math operations
let sum = x + y;
// TODO: Create variables for subtraction, multiplication, and division

// 3. Working with strings
let firstName = "JavaScript";
let lastName = "Developer";
// TODO: Combine these strings with a space in between

// 4. Mixing types (string + number)
let age = 7;
// TODO: Create a message: "I am [age] years old"

// Print results
console.log("Sum: " + sum);
// Print your other results here`,
      hint: "When you add a string and a number in JavaScript, the number is converted to a string automatically. For example: 'Hello ' + 42 becomes 'Hello 42'."
    },
    {
      title: "Class Detection Test",
      description: "Special exercise to test class detection",
      codeTemplate:
`// Define a Person class
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  greet() {
    return \`Hello, my name is \${this.name}\`;
  }
}

// Create a Person instance
const p = new Person("Brent", 32);

// Print the person object directly (should be detected as a class)
console.log(p);

// Create a stringified version - also should be detected as a class
const personString = "Person { name: 'Alice', age: 28 }";
console.log(personString);

// Even when stored in a variable, should be detected
const anotherPerson = personString;
console.log(anotherPerson);`,
      hint: "The system should automatically detect both the class instance and strings that look like class instances."
    }
  ];

  const loadExercise = (index: number) => {
    setActiveExercise(index);
    setCode(exercises[index].codeTemplate);
  };
  
  const theoryContent = [
    // Section 0: Introduction
    {
      title: "Understanding Variables",
      content: (
        <>
          <p className="compact">
            Variables are containers for storing data values. In JavaScript, you declare 
            variables using <code>let</code>, <code>const</code>, or <code>var</code>.
          </p>
          
          <div className="variable-declarations">
            <div className="bootdev-code-example compact">
              <h4>let</h4>
              <pre>
{`// Can be reassigned
let message = "Hello";
message = "Hello World";`}
              </pre>
            </div>

            <div className="bootdev-code-example compact">
              <h4>const</h4>
              <pre>
{`// Cannot be reassigned
const PI = 3.14159;
// PI = 3.14; // Error!`}
              </pre>
            </div>

            <div className="bootdev-code-example compact">
              <h4>var (older style)</h4>
              <pre>
{`// Function-scoped
var oldStyle = "I'm old";`}
              </pre>
            </div>
          </div>
        </>
      )
    },
    // Section 1: Declaration Keywords
    {
      title: "Variable Declaration Keywords",
      content: (
        <>
          <ul>
            <li>
              <strong><code>let</code>:</strong> Modern way to declare variables that can be reassigned.
              Has block scope.
            </li>
            <li>
              <strong><code>const</code>:</strong> For variables that should not be reassigned.
              Also has block scope.
            </li>
            <li>
              <strong><code>var</code>:</strong> Older way to declare variables.
              Has function scope (not block scope).
            </li>
          </ul>
          
          <div className="bootdev-info-box">
            <h4>Best Practice</h4>
            <p>
              Modern JavaScript encourages using <code>const</code> by default, and <code>let</code> when 
              you need to reassign values. Avoid <code>var</code> in new code.
            </p>
          </div>
        </>
      )
    },
    // Section 2: Primitive Types
    {
      title: "Data Types: Primitives",
      content: (
        <>
          <p className="compact">
            JavaScript variables can hold different types of data:
          </p>
          
          <div className="theory-grid-layout">
            <div className="bootdev-code-example compact">
              <h4>String & Number</h4>
              <pre>
{`// String - text
let name = "JavaScript";

// Number - integers & decimals
let age = 26;
let price = 19.99;`}
              </pre>
            </div>

            <div className="bootdev-code-example compact">
              <h4>Boolean, Undefined & Null</h4>
              <pre>
{`// Boolean - true or false
let isActive = true;

// Undefined - no value yet
let nextStep;

// Null - intentionally empty
let selection = null;`}
              </pre>
            </div>
          </div>
        </>
      )
    },
    // Section 3: Complex Types
    {
      title: "Data Types: Complex",
      content: (
        <>
          <div className="theory-grid-layout">
            <div className="bootdev-code-example compact">
              <h4>Arrays</h4>
              <pre>
{`// Ordered collection of values
let colors = ["red", "green", "blue"];

// Access by index (0-based)
let firstColor = colors[0]; // "red"`}
              </pre>
            </div>

            <div className="bootdev-code-example compact">
              <h4>Objects</h4>
              <pre>
{`// Collection of key-value pairs
let person = {
  name: "Alex",
  age: 25,
  isStudent: true
};

// Access properties with dot notation
console.log(person.name); // "Alex"`}
              </pre>
            </div>
          </div>
        </>
      )
    },
    // Section 4: Using Variables
    {
      title: "Using Variables",
      content: (
        <>
          <p className="compact">
            After declaring variables, you can use them in your code:
          </p>
          
          <div className="theory-grid-layout">
            <div className="bootdev-code-example compact">
              <h4>Performing Operations</h4>
              <pre>
{`// Math operations
let x = 5;
let y = 3;
let sum = x + y;  // sum is 8

// Increment values
let count = 10;
count = count + 1;  // count is 11
// Or using shorthand: count++;`}
              </pre>
            </div>

            <div className="bootdev-code-example compact">
              <h4>String Operations</h4>
              <pre>
{`// Combining strings (concatenation)
let name = "JavaScript";
let greeting = "Hello, " + name + "!";

// String with variables
let age = 27;
let bio = \`\${name} is \${age} years old.\`;
console.log(bio); // "JavaScript is 27..."`}
              </pre>
            </div>
          </div>
        </>
      )
    },
    // Section 5: Variable Scope
    {
      title: "Variable Scope",
      content: (
        <>
          <p className="compact">
            The scope of a variable determines where it can be accessed in your code.
          </p>
          
          <div className="theory-grid-layout">
            <div className="bootdev-code-example compact">
              <h4>Global vs Function Scope</h4>
              <pre>
{`// Global scope - available everywhere
let globalVar = "I'm available everywhere";

function example() {
  // Function scope - only inside function
  let funcVar = "I'm only in this function";
  
  console.log(globalVar); // Works!
  console.log(funcVar);   // Works!
}

console.log(globalVar);    // Works!
// console.log(funcVar);   // Error!`}
              </pre>
            </div>

            <div className="bootdev-code-example compact">
              <h4>Block Scope (let/const vs var)</h4>
              <pre>
{`function blockScopeExample() {
  // var is function-scoped
  if (true) {
    var varVariable = "I'm function scoped";
    let letVariable = "I'm block scoped";
    const constVariable = "Me too!";
  }
  
  console.log(varVariable);     // Works!
  // console.log(letVariable);  // Error!
  // console.log(constVariable); // Error!
}`}
              </pre>
            </div>
          </div>
        </>
      )
    }
  ];
  
  const goToNextTheorySection = () => {
    if (currentTheorySection < theoryContent.length - 1) {
      setCurrentTheorySection(currentTheorySection + 1);
    }
  };
  
  const goToPrevTheorySection = () => {
    if (currentTheorySection > 0) {
      setCurrentTheorySection(currentTheorySection - 1);
    }
  };

  return (
    <div className="bootdev-lesson-container">
      <div className="bootdev-lesson-header">
        <h1>JavaScript Variables</h1>
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
            <h2>{theoryContent[currentTheorySection].title}</h2>
            
            <div className="theory-content">
              {theoryContent[currentTheorySection].content}
            </div>
            
            <div className="theory-navigation">
              <button 
                className="nav-button prev-button" 
                onClick={goToPrevTheorySection}
                disabled={currentTheorySection === 0}
              >
                ← Previous
              </button>
              <span className="theory-pagination">
                {currentTheorySection + 1} / {theoryContent.length}
              </span>
              <button 
                className="nav-button next-button" 
                onClick={goToNextTheorySection}
                disabled={currentTheorySection === theoryContent.length - 1}
              >
                Next →
              </button>
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
                onChange={setCode}
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

export default BootDevVariablesLesson; 