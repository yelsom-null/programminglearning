import React, { useState, useEffect } from 'react';
import CodeEditor from './CodeEditor';
import '../styles/ModuleContent.css';
import { Card } from 'react-bootstrap';

interface VariablesModuleContentProps {
  moduleId: number;
  darkMode?: boolean;
  code?: string;
  onCodeChange?: (value: string) => void;
  runtimeValues?: Record<string, any>;
  consoleOutput?: any[];
}

const VariablesModuleContent: React.FC<VariablesModuleContentProps> = ({
  moduleId,
  darkMode = false,
  code = '',
  onCodeChange = () => {},
  runtimeValues = {},
  consoleOutput = []
}) => {
  const modules = {
    1: <Module1Content darkMode={darkMode} code={code} onCodeChange={onCodeChange} runtimeValues={runtimeValues} consoleOutput={consoleOutput} />,
    2: <Module2Content darkMode={darkMode} code={code} onCodeChange={onCodeChange} runtimeValues={runtimeValues} consoleOutput={consoleOutput} />,
    3: <Module3Content darkMode={darkMode} code={code} onCodeChange={onCodeChange} runtimeValues={runtimeValues} consoleOutput={consoleOutput} />,
    4: <Module4Content darkMode={darkMode} code={code} onCodeChange={onCodeChange} runtimeValues={runtimeValues} consoleOutput={consoleOutput} />,
    5: <Module5Content darkMode={darkMode} code={code} onCodeChange={onCodeChange} runtimeValues={runtimeValues} consoleOutput={consoleOutput} />
  };

  return (
    <div className="module-content" style={{ maxHeight: '700px', overflowY: 'auto' }}>
      {modules[moduleId as keyof typeof modules] || 
        <div className="module-not-found">Module content not found</div>}
    </div>
  );
};

// Add this new component at the top of the file after the imports
const HintButton: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [showHint, setShowHint] = useState(false);
  
  return (
    <div className="hint-container">
      <button 
        className="hint-button" 
        onClick={() => setShowHint(!showHint)}
      >
        {showHint ? 'Hide Hint' : 'Show Hint'}
      </button>
      {showHint && (
        <div className="hint-content">
          {children}
        </div>
      )}
    </div>
  );
};

// Module 1: Basic Variables for a Task
const Module1Content: React.FC<Omit<VariablesModuleContentProps, 'moduleId'>> = ({
  darkMode,
  code = '',
  onCodeChange,
  runtimeValues = {}
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 5;
  const [stepCompleted, setStepCompleted] = useState<Record<number, boolean>>({
    0: true, // Welcome step is always completed
    1: false,
    2: false,
    3: false,
    4: false
  });
  const [feedback, setFeedback] = useState("");
  
  // When the module receives new code, check if it satisfies the current step
  useEffect(() => {
    if (code) {
      // Auto-verify if they completed the current step
      if (verifyStep(currentStep, code, runtimeValues) && !stepCompleted[currentStep]) {
        setStepCompleted(prev => ({...prev, [currentStep]: true}));
        setFeedback("Great job! You've completed this step. You can now proceed to the next step.");
      }
    }
  }, [code, currentStep, runtimeValues, stepCompleted]);

  // Define the steps for Module 1
  const steps = {
    0: {
      title: "Introduction to Variables in JavaScript",
      content: (
        <>
          <p>
            <strong>Variables</strong> are containers for storing data values. In JavaScript, we use variables to store task information in our task manager app.
          </p>
          
          <Card className="concept-card mb-4">
            <Card.Header as="h4">JavaScript Data Types</Card.Header>
            <Card.Body>
              <p>JavaScript variables can hold numbers like 100 and text values like "John Doe".</p>
              <p>In programming, text values are called text strings.</p>
              <p>JavaScript can handle many types of data, but for now, just think of numbers and strings.</p>
              <ul>
                <li><strong>Strings</strong> are written inside double or single quotes: <code>"Task name"</code> or <code>'Task name'</code></li>
                <li><strong>Numbers</strong> are written without quotes: <code>42</code>, <code>3.14</code></li>
              </ul>
              <p>If you put a number in quotes, it will be treated as a text string.</p>
              
              <HintButton>
                <div className="code-example">
                  <pre>
{`// String examples
let taskName = "Complete JavaScript tutorial"; // Double quotes
let assignee = 'John Doe';                    // Single quotes

// Number examples
let progress = 0;                 // No quotes for numbers
let priority = 1;                 // Priority level as a number
let estimatedHours = 2.5;         // Decimal numbers`}
                  </pre>
                </div>
              </HintButton>
            </Card.Body>
          </Card>

          <Card className="concept-card mb-4">
            <Card.Header as="h4">Declaring a JavaScript Variable</Card.Header>
            <Card.Body>
              <p>Creating a variable in JavaScript is called "declaring" a variable.</p>
              <p>You declare a JavaScript variable with the <code>var</code>, <code>let</code>, or <code>const</code> keyword:</p>
              <ul>
                <li><strong>let</strong> - used when the value can change</li>
                <li><strong>const</strong> - used when the value should NOT change</li>
                <li><strong>var</strong> - older way (less used in modern code)</li>
              </ul>
              <p>After the declaration, the variable has no value (technically it is undefined).</p>
              <p>To assign a value to the variable, use the equal sign:</p>
              
              <HintButton>
                <div className="code-example">
                  <pre>
{`// Declaring a variable first, then assigning value
let taskName;
taskName = "Complete JavaScript tutorial";

// You can also assign a value when you declare it
let progress = 0;
const taskId = "TASK-123";`}
                  </pre>
                </div>
              </HintButton>
            </Card.Body>
          </Card>

          <Card className="concept-card mb-4">
            <Card.Header as="h4">Rules for JavaScript Variable Names</Card.Header>
            <Card.Body>
              <ul>
                <li>Names must begin with a letter, $ or _</li>
                <li>Names can contain letters, digits, underscores, and dollar signs</li>
                <li>Names are case sensitive (y and Y are different)</li>
                <li>Reserved words (like JavaScript keywords) cannot be used as names</li>
              </ul>
              
              <HintButton>
                <div className="code-example">
                  <pre>
{`// Good variable names for our task manager
let taskName = "Learn JavaScript";     // Starts with letter, clear meaning
let isComplete = false;                // Camel case for multiple words
let task_priority = "high";            // Underscores are allowed
let $specialTask = true;               // $ is allowed (but less common)`}
                  </pre>
                </div>
              </HintButton>
            </Card.Body>
          </Card>

          <Card className="concept-card mb-4">
            <Card.Header as="h4">Example: Task Manager Variables</Card.Header>
            <Card.Body>
              <p>Here's how you might store a task with multiple properties.</p>
              
              <HintButton>
                <div className="code-example">
                  <pre>
{`// Task information stored in variables
let taskName = "Complete JavaScript course";
let isCompleted = false;
let priority = "high";
let dueDate = "2023-07-01";
let progressPercent = 25;

// Calculating remaining progress
let remainingPercent = 100 - progressPercent;

// Display task information
console.log("Task: " + taskName);
console.log("Completed: " + isCompleted);
console.log("Priority: " + priority);
console.log("Progress: " + progressPercent + "%");
console.log("Remaining: " + remainingPercent + "%");`}
                  </pre>
                </div>
              </HintButton>
            </Card.Body>
          </Card>

          <div className="step-instruction">
            <h4>👉 Your First Task</h4>
            <p>Let's create variables for a simple task tracker. In the code editor, create the following:</p>
            <ol>
              <li>A variable called <code>taskName</code> with a string value for a task of your choice</li>
              <li>A variable called <code>isCompleted</code> set to either true or false</li>
              <li>A variable called <code>dueDate</code> with a string value for when the task is due</li>
            </ol>
            <p>This task demonstrates how variables store different types of values for your task manager.</p>
          </div>
        </>
      )
    },
    1: {
      title: "Understanding Variables",
      content: (
        <>
          <p>
            Variables are containers that store values in your code. In our task manager 
            application, we'll use variables to store information about tasks, like their 
            names, status, and priorities.
          </p>
          
          <Card className="concept-card mb-4">
            <Card.Header as="h4">Key Concepts</Card.Header>
            <Card.Body>
              <ul>
                <li><strong>Declaration:</strong> Creating a new variable</li>
                <li><strong>Assignment:</strong> Giving a variable a value</li>
                <li><strong>Naming:</strong> Using descriptive names for clarity</li>
              </ul>
            </Card.Body>
          </Card>
          
          <div className="step-instruction">
            <h4>👉 Look at the code editor</h4>
            <p>You'll see the variables you created in the previous step: <code>taskName</code>, <code>isCompleted</code>, and <code>dueDate</code>.</p>
            <p>Run the code to see what happens in the console output and variable values panels.</p>
          </div>
        </>
      )
    },
    2: {
      title: "Creating Variables",
      content: (
        <>
          <p>
            JavaScript offers three ways to declare variables:
          </p>
          
          <div className="code-comparison">
            <div className="code-example">
              <h4>let</h4>
              <p>Use when the value will change</p>
              <HintButton>
                <pre>
{`// let - can be reassigned
let taskName = "Complete project";
taskName = "Review code"; // OK`}
                </pre>
              </HintButton>
            </div>
            
            <div className="code-example">
              <h4>const</h4>
              <p>Use for values that won't change</p>
              <HintButton>
                <pre>
{`// const - cannot be reassigned
const projectId = "TASK-123";
// projectId = "TASK-456"; // Error!`}
                </pre>
              </HintButton>
            </div>
            
            <div className="code-example">
              <h4>var (older style)</h4>
              <p>Prefer let and const in modern code</p>
              <HintButton>
                <pre>
{`// var - older syntax, less used now
var status = "In Progress";`}
                </pre>
              </HintButton>
            </div>
          </div>
          
          <div className="step-instruction">
            <h4>👉 Now add a new variable</h4>
            <p>Create a variable named <code>priority</code> that stores the task's priority level. Set it to "high", "medium", or "low".</p>
            <p>Then display this information in the console using <code>console.log()</code>.</p>
          </div>
        </>
      )
    },
    3: {
      title: "Modifying Variables",
      content: (
        <>
          <p>
            After creating variables, you can change their values:
          </p>
          
          <HintButton>
            <div className="code-example">
              <pre>
{`// Changing variable values
let score = 0;
score = 10;  // Value is now 10

let name = "Task";
name = name + " Manager";  // Value is now "Task Manager"`}
              </pre>
            </div>
          </HintButton>
          
          <div className="step-instruction">
            <h4>👉 Let's modify our variables</h4>
            <p>Now update the variables we've created:</p>
            <ol>
              <li>Change <code>isCompleted</code> to <code>true</code></li>
              <li>Modify <code>taskName</code> to include "(Urgent)" at the end</li>
              <li>Use <code>console.log()</code> to display the updated task name and completion status</li>
            </ol>
          </div>
        </>
      )
    },
    4: {
      title: "Variables for Task Properties",
      content: (
        <>
          <p>
            For our task manager, we need variables to track various properties of each task:
          </p>
          
          <ul>
            <li><strong>Task Information:</strong> name, description, category</li>
            <li><strong>Task Status:</strong> completed, in progress, blocked</li>
            <li><strong>Task Metrics:</strong> priority, time estimates, deadlines</li>
          </ul>
          
          <HintButton>
            <div className="code-example">
              <pre>
{`// Task properties example
let taskName = "Build website layout";
let description = "Create responsive design for homepage";
let category = "Design";
let estimatedHours = 4.5;
let dueDate = "2023-08-15";
let assignedTo = "Sarah";
let isCompleted = false;

// Calculate days until due
let today = new Date();
let dueDateTime = new Date(dueDate);
let daysUntilDue = Math.ceil((dueDateTime - today) / (1000 * 60 * 60 * 24));`}
              </pre>
            </div>
          </HintButton>
          
          <div className="step-instruction">
            <h4>👉 Add more task properties</h4>
            <p>Add these additional variables to your task:</p>
            <ol>
              <li>Create <code>estimatedHours</code> as a number (use a decimal like 3.5)</li>
              <li>Create <code>dueDate</code> as a string in YYYY-MM-DD format</li>
              <li>Create <code>category</code> to categorize your task (e.g., "Development")</li>
              <li>Create <code>assignedTo</code> to track who's responsible for the task</li>
              <li>Display all these properties using <code>console.log()</code></li>
            </ol>
          </div>
        </>
      )
    },
    5: {
      title: "Naming Variables",
      content: (
        <>
          <p>
            Good variable names are crucial for readable code. For our task manager:
          </p>
          <ul>
            <li>Use descriptive names: <code>taskName</code> instead of <code>t</code> or <code>name</code></li>
            <li>Use camelCase (start lowercase, capitalize subsequent words): <code>estimatedHours</code></li>
            <li>Use meaningful names that explain what the variable contains</li>
            <li>For booleans, use is/has prefixes: <code>isCompleted</code>, <code>hasAttachments</code></li>
          </ul>
          
          <Card className="module-summary mb-4">
            <Card.Header as="h3">Module Summary</Card.Header>
            <Card.Body>
              <p>
                In this module, you learned:
              </p>
              <ul>
                <li>What variables are and why they're important</li>
                <li>How to declare variables using let, const, and var</li>
                <li>How to assign values to variables</li>
                <li>How to modify variable values</li>
                <li>Best practices for naming variables in a task management context</li>
              </ul>
              <p>
                Next, we'll explore the different types of variables and how to use them 
                effectively in our task manager.
              </p>
            </Card.Body>
          </Card>
          
          <div className="step-instruction">
            <h4>👉 Final challenge</h4>
            <p>Create at least two more variables with good descriptive names for tracking information about a task.</p>
            <p>Make sure to use proper naming conventions!</p>
          </div>
        </>
      )
    }
  };
  
  const verifyStep = (step: number, codeValue: string, values: Record<string, any>) => {
    switch(step) {
      case 0:
        // Check if they've created the basic variables
        return values.taskName !== undefined && 
               values.isCompleted !== undefined && 
               values.dueDate !== undefined;
      case 1:
        // Check if they've observed the initial variables
        return values.taskName !== undefined && values.isCompleted !== undefined;
      case 2:
        // Check if they've added a priority variable
        return values.priority !== undefined && 
               typeof values.priority === 'string' &&
               (values.priority.includes('high') || values.priority.includes('medium') || 
                values.priority.includes('low'));
      case 3:
        // Check if they modified variables as instructed
        return values.isCompleted === true && 
               values.taskName && values.taskName.includes('Urgent');
      case 4:
        // Check if they added task properties
        return values.estimatedHours !== undefined && 
               values.dueDate !== undefined && 
               values.category !== undefined && 
               values.assignedTo !== undefined;
      default:
        return false;
    }
  };
  
  const handleNextStep = () => {
    // Verify current step is complete before allowing to move to next step
    if (stepCompleted[currentStep]) {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
        setFeedback("");
      }
    } else {
      setFeedback("Complete the current task before moving to the next step.");
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setFeedback("");
    }
  };
  
  // Define step instructions to display prominently
  const stepInstructions = {
    0: "Create variables for taskName, isCompleted, and dueDate with your own values.",
    1: "Observe the taskName and isCompleted variables in the code editor.",
    2: "Create a variable named 'priority' with a value of 'high', 'medium', or 'low' and log it.",
    3: "Change isCompleted to true and add '(Urgent)' to the task name, then log both values.",
    4: "Add variables for estimatedHours, dueDate, category, and assignedTo, then log them.",
    5: "Create at least two more descriptive task variables using proper naming conventions."
  };

  return (
    <div className="module-container">
      
      {feedback && (
        <div className={`feedback-message ${feedback.includes("Great") ? "success" : "error"}`}>
          {feedback}
        </div>
      )}
      
      <div className="step-content">
        <h3>{steps[currentStep as keyof typeof steps]?.title || "Step"}</h3>
        {steps[currentStep as keyof typeof steps]?.content}
      </div>
    </div>
  );
};

// Module 2: Variable Types for Tasks
const Module2Content: React.FC<Omit<VariablesModuleContentProps, 'moduleId'>> = ({
  darkMode,
  code = '',
  onCodeChange,
  runtimeValues = {}
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;
  const [stepCompleted, setStepCompleted] = useState<Record<number, boolean>>({
    0: true, // First section is introduction
    1: false,
    2: false,
    3: false
  });
  const [feedback, setFeedback] = useState("");
  
  // When the module receives new code, check if it satisfies the current step
  useEffect(() => {
    if (code) {
      // Auto-verify if they completed the current step
      if (verifyStep(currentStep, runtimeValues) && !stepCompleted[currentStep]) {
        setStepCompleted(prev => ({...prev, [currentStep]: true}));
        setFeedback("Great job! You've completed this step. You can now proceed to the next step.");
      }
    }
  }, [code, currentStep, runtimeValues, stepCompleted]);
  
  const verifyStep = (step: number, values: Record<string, any>) => {
    switch(step) {
      case 1: // Using String Variables
        return values.taskName !== undefined && 
               values.description !== undefined && 
               values.category !== undefined;
      case 2: // Using Number Variables
        return values.progressPercent !== undefined && 
               values.estimatedHours !== undefined;
      case 3: // Using Boolean Variables
        return values.isCompleted !== undefined && 
               values.isUrgent !== undefined;
      default:
        return false;
    }
  };
  
  const handleNextStep = () => {
    if (stepCompleted[currentStep]) {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
        setFeedback("");
      }
    } else {
      setFeedback("Complete the current task before moving to the next step.");
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setFeedback("");
    }
  };
  
  // Define step instructions to display prominently
  const stepInstructions = {
    0: "Read about different data types in JavaScript for task management.",
    1: "Create taskName, description, and category string variables and log them.",
    2: "Create progressPercent and estimatedHours number variables, calculate remainingHours, and log all three.",
    3: "Create isCompleted and isUrgent boolean variables, add a conditional check, and log both values."
  };
  
  return (
    <div className="module-container">
      <h2>Module 2: Variable Types for Tasks</h2>
      
      {/* Current Task Display */}
      <div className="current-task">
        <h3>Your Task:</h3>
        <p className="task-instruction">{stepInstructions[currentStep as keyof typeof stepInstructions]}</p>
      </div>
      
      <div className="module-navigation">
        {/* Step Navigation */}
        <div className="step-navigation">
          <button 
            onClick={handlePrevStep} 
            disabled={currentStep === 0}
          >
            Previous
          </button>
          <span className="step-indicator">Step {currentStep + 1} of {totalSteps}</span>
          <button 
            onClick={handleNextStep}
            disabled={currentStep === totalSteps - 1 || !stepCompleted[currentStep]}
          >
            Next
          </button>
        </div>
      </div>
      
      {feedback && (
        <div className={`feedback-message ${feedback.includes("Great") ? "success" : "error"}`}>
          {feedback}
        </div>
      )}
      
      {currentStep === 0 && (
        <div className="module-section">
          <h3>Data Types in JavaScript</h3>
          <p>
            JavaScript variables can hold different types of data. Understanding these types 
            is essential for working with task information effectively.
          </p>
          
          <Card className="concept-card mb-4">
            <Card.Header as="h4">Key Types for Task Management</Card.Header>
            <Card.Body>
              <ul>
                <li><strong>Strings:</strong> For text (task names, descriptions, categories)</li>
                <li><strong>Numbers:</strong> For quantities (progress percentage, estimated hours)</li>
                <li><strong>Booleans:</strong> For true/false states (completed, urgent)</li>
                <li><strong>Dates:</strong> For deadlines and creation times</li>
              </ul>
            </Card.Body>
          </Card>
        </div>
      )}
      
      {currentStep === 1 && (
        <div className="module-section">
          <h3>Using String Variables</h3>
          <p>
            Strings store text values and are perfect for task names, descriptions, and categories.
          </p>
          
          <HintButton>
            <div className="code-example">
              <pre>
{`// String variables for tasks
let taskName = "Complete project proposal";
let description = "Create a detailed project plan with timelines";
let category = "Work";

// Strings can use single or double quotes
let assignee = 'Alex';`}
              </pre>
            </div>
          </HintButton>
          
          <div className="concept-note">
            <p>
              <strong>Note:</strong> Strings must be wrapped in quotes (either single or double).
              Use consistent quote style throughout your code.
            </p>
          </div>
          
          <div className="step-instruction">
            <h4>👉 Create string variables</h4>
            <p>Create the following string variables for your task:</p>
            <ol>
              <li>A <code>taskName</code> variable with a descriptive task name</li>
              <li>A <code>description</code> variable with details about the task</li>
              <li>A <code>category</code> variable to categorize the task</li>
              <li>Display all three using <code>console.log()</code></li>
            </ol>
            <p>Remember to use quotes (single or double) around your text values!</p>
          </div>
        </div>
      )}
      
      {currentStep === 2 && (
        <div className="module-section">
          <h3>Using Number Variables</h3>
          <p>
            Numbers are used for task metrics like progress, priority levels, and time estimates.
          </p>
          
          <HintButton>
            <div className="code-example">
              <pre>
{`// Number variables for tasks
let progressPercent = 25;         // No quotes for numbers
let estimatedHours = 3.5;         // Decimals are fine
let priorityLevel = 2;            // 1=low, 2=medium, 3=high

// Calculations with numbers
let remainingHours = estimatedHours * (100 - progressPercent) / 100;`}
              </pre>
            </div>
          </HintButton>
          
          <div className="step-instruction">
            <h4>👉 Create number variables</h4>
            <p>Add numeric properties to your task:</p>
            <ol>
              <li>Create <code>progressPercent</code> to track completion (0-100)</li>
              <li>Create <code>estimatedHours</code> for time estimation (use a decimal)</li>
              <li>Calculate <code>remainingHours</code> by multiplying <code>estimatedHours</code> by the percentage of work remaining</li>
              <li>Display all three values using <code>console.log()</code></li>
            </ol>
            <p>Remember that numbers don't use quotes!</p>
          </div>
        </div>
      )}
      
      {currentStep === 3 && (
        <div className="module-section">
          <h3>Using Boolean Variables</h3>
          <p>
            Booleans represent true/false values, perfect for task status flags.
          </p>
          
          <HintButton>
            <div className="code-example">
              <pre>
{`// Boolean variables for tasks
let isCompleted = false;
let isUrgent = true;
let needsReview = false;

// Booleans are useful for checking conditions
if (isUrgent && !isCompleted) {
  console.log("This task needs immediate attention!");
}`}
              </pre>
            </div>
          </HintButton>
          
          <div className="step-instruction">
            <h4>👉 Create boolean variables</h4>
            <p>Add status flags to your task:</p>
            <ol>
              <li>Create <code>isCompleted</code> and set it to either true or false</li>
              <li>Create <code>isUrgent</code> and set it appropriately</li>
              <li>Add an if statement that checks: if the task is urgent AND not completed, log a warning message</li>
              <li>Display both status flags using <code>console.log()</code></li>
            </ol>
            <p>Remember that booleans are simply <code>true</code> or <code>false</code> without quotes!</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Module 3: Variable Manipulation
const Module3Content: React.FC<Omit<VariablesModuleContentProps, 'moduleId'>> = ({
  darkMode,
  code = '',
  onCodeChange,
  runtimeValues = {}
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;
  const [stepCompleted, setStepCompleted] = useState<Record<number, boolean>>({
    0: true, // Introduction step is always completed
    1: false,
    2: false,
    3: false
  });
  const [feedback, setFeedback] = useState("");
  
  // Define step instructions to display prominently
  const stepInstructions = {
    0: "Learn how to modify and update variables to track task changes.",
    1: "Update task progress and recalculate remaining work hours.",
    2: "Create a status summary that reflects the task's current state.",
    3: "Implement automatic task completion when progress reaches 100%."
  };
  
  // When the module receives new code, check if it satisfies the current step
  useEffect(() => {
    if (code) {
      // Auto-verify if they completed the current step
      if (verifyStep(currentStep, runtimeValues) && !stepCompleted[currentStep]) {
        setStepCompleted(prev => ({...prev, [currentStep]: true}));
        setFeedback("Great job! You've completed this step. You can now proceed to the next step.");
      }
    }
  }, [code, currentStep, runtimeValues, stepCompleted]);
  
  const verifyStep = (step: number, values: Record<string, any>) => {
    switch(step) {
      case 1: // Updating progress and recalculating
        return values.progress !== undefined && 
               values.progress !== 40 && // Must have changed from initial value
               values.remainingWork !== undefined &&
               // Check if they properly calculated remaining work
               Math.abs(values.remainingWork - (values.estimatedHours * (100 - values.progress) / 100)) < 0.01;
      case 2: // Status summary creation
        return values.statusText !== undefined && 
               typeof values.statusText === 'string' && 
               values.statusText.includes(values.taskName) && 
               values.statusText.includes(String(values.progress));
      case 3: // Automatic completion
        // They should have written code to check progress and set isCompleted to true
        return values.isCompleted !== undefined &&
               (values.progress < 100 || values.isCompleted === true);
      default:
        return false;
    }
  };
  
  const handleNextStep = () => {
    if (stepCompleted[currentStep]) {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
        setFeedback("");
      }
    } else {
      setFeedback("Complete the current task before moving to the next step.");
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setFeedback("");
    }
  };
  
  // Define content for each step
  const steps = {
    0: {
      title: "Introduction to Variable Manipulation",
      content: (
        <>
          <p>
            In a task management application, task information changes frequently. 
            Let's learn how to update our task variables as work progresses.
          </p>
          
          <Card className="concept-card mb-4">
            <Card.Header as="h4">Key Operations</Card.Header>
            <Card.Body>
              <ul>
                <li><strong>Assignment:</strong> Changing a variable's value completely</li>
                <li><strong>Modification:</strong> Changing a value based on its current value</li>
                <li><strong>String Concatenation:</strong> Combining strings for status reports</li>
                <li><strong>Compound Assignment:</strong> Shorthand for updating variables</li>
              </ul>
            </Card.Body>
          </Card>
          
          <p>
            The code editor already contains initial task variables. We'll modify these
            to reflect changes in the task's status as work progresses.
          </p>
        </>
      )
    },
    1: {
      title: "Updating Task Progress",
      content: (
        <>
          <p>
            As work is completed on a task, we need to update its progress and recalculate 
            how much work remains.
          </p>
          
          <HintButton>
            <div className="code-example">
              <pre>
{`// Initial values
let progress = 40;
let estimatedHours = 6;

// Update progress (task is further along now)
progress = 60;  // Increase progress by 20%

// Recalculate remaining work hours based on new progress
let remainingWork = estimatedHours * (100 - progress) / 100;`}
              </pre>
            </div>
          </HintButton>
          
          <div className="step-instruction">
            <h4>👉 Update task progress</h4>
            <ol>
              <li>Find the <code>progress</code> variable in your code and update its value to represent new progress (choose a different value than 40)</li>
              <li>Create a new variable called <code>remainingWork</code> that calculates the remaining hours based on the formula: <code>estimatedHours * (100 - progress) / 100</code></li>
              <li>Display the new progress and remaining work using <code>console.log()</code></li>
            </ol>
          </div>
        </>
      )
    },
    2: {
      title: "Creating Status Summaries",
      content: (
        <>
          <p>
            Status reports are essential in task management. Let's create a status summary 
            that combines multiple variables into a readable string.
          </p>
          
          <HintButton>
            <div className="code-example">
              <pre>
{`// Creating a status summary string
let taskName = "Create project plan";
let progress = 60;

// Combine variables into a meaningful status text
let statusText = "The task '" + taskName + "' is " + progress + "% complete";
console.log(statusText);

// Modern approach using template literals
let modernText = \`Task: \${taskName} | Progress: \${progress}%\`;
console.log(modernText);`}
              </pre>
            </div>
          </HintButton>
          
          <div className="step-instruction">
            <h4>👉 Create a status summary</h4>
            <ol>
              <li>Create a variable called <code>statusText</code> that combines the task name and progress into a readable sentence</li>
              <li>Include at least the task name and progress percentage in your summary</li>
              <li>Display this summary using <code>console.log()</code></li>
              <li>Optional: Try using template literals with backticks (`) for a cleaner syntax</li>
            </ol>
          </div>
        </>
      )
    },
    3: {
      title: "Automatic Task Completion",
      content: (
        <>
          <p>
            We can use conditional logic to automatically update a task's completion status 
            based on its progress.
          </p>
          
          <HintButton>
            <div className="code-example">
              <pre>
{`// Automatic status updates
let progress = 60;
let isCompleted = false;

// Automatically mark as complete if progress reaches 100%
if (progress >= 100) {
  isCompleted = true;
  console.log("Task automatically marked as complete!");
}

console.log("Task completed: " + isCompleted);`}
              </pre>
            </div>
          </HintButton>
          
          <div className="step-instruction">
            <h4>👉 Implement automatic completion</h4>
            <ol>
              <li>Add code that checks if <code>progress</code> is greater than or equal to 100%</li>
              <li>If it is, update <code>isCompleted</code> to <code>true</code></li>
              <li>Add a <code>console.log()</code> statement that shows the completion status</li>
              <li>Test it by setting progress to 100 and then to a lower value to see the difference</li>
            </ol>
          </div>
        </>
      )
    }
  };
  
  return (
    <div className="module-container">
      <h2>Module 3: Variable Manipulation</h2>
      
      {/* Current Task Display */}
      <div className="current-task">
        <h3>Your Task:</h3>
        <p className="task-instruction">{stepInstructions[currentStep as keyof typeof stepInstructions]}</p>
      </div>
      
      <div className="module-navigation">
        {/* Step Navigation */}
        <div className="step-navigation">
          <button 
            onClick={handlePrevStep} 
            disabled={currentStep === 0}
          >
            Previous
          </button>
          <span className="step-indicator">Step {currentStep + 1} of {totalSteps}</span>
          <button 
            onClick={handleNextStep}
            disabled={currentStep === totalSteps - 1 || !stepCompleted[currentStep]}
          >
            Next
          </button>
        </div>
      </div>
      
      {feedback && (
        <div className={`feedback-message ${feedback.includes("Great") ? "success" : "error"}`}>
          {feedback}
        </div>
      )}
      
      <div className="step-content">
        <h3>{steps[currentStep as keyof typeof steps]?.title || "Step"}</h3>
        {steps[currentStep as keyof typeof steps]?.content}
      </div>
    </div>
  );
};

// Module 4: Working with Multiple Tasks
const Module4Content: React.FC<Omit<VariablesModuleContentProps, 'moduleId'>> = ({
  darkMode,
  code = '',
  onCodeChange,
  runtimeValues = {}
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;
  const [stepCompleted, setStepCompleted] = useState<Record<number, boolean>>({
    0: true, // Introduction step is always completed
    1: false,
    2: false,
    3: false
  });
  const [feedback, setFeedback] = useState("");
  
  // Define step instructions to display prominently
  const stepInstructions = {
    0: "Learn how to organize and manage variables for multiple tasks.",
    1: "Create variables for three different tasks with consistent naming.",
    2: "Compare task priorities to identify the highest priority task.",
    3: "Calculate overall completion rate across all tasks."
  };
  
  // When the module receives new code, check if it satisfies the current step
  useEffect(() => {
    if (code) {
      // Auto-verify if they completed the current step
      if (verifyStep(currentStep, runtimeValues) && !stepCompleted[currentStep]) {
        setStepCompleted(prev => ({...prev, [currentStep]: true}));
        setFeedback("Great job! You've completed this step. You can now proceed to the next step.");
      }
    }
  }, [code, currentStep, runtimeValues, stepCompleted]);
  
  const verifyStep = (step: number, values: Record<string, any>) => {
    switch(step) {
      case 1: // Creating task variables
        // Check if they've created variables for at least 3 tasks
        const task1NameExists = values.task1Name !== undefined;
        const task2NameExists = values.task2Name !== undefined;
        const task3NameExists = values.task3Name !== undefined;
        
        const hasCompletionStatus = 
          values.task1Completed !== undefined && 
          values.task2Completed !== undefined && 
          values.task3Completed !== undefined;
        
        return task1NameExists && task2NameExists && task3NameExists && hasCompletionStatus;
      
      case 2: // Comparing task priorities
        // Check if they've compared tasks and identified the highest priority
        return values.task1Priority !== undefined && 
               values.task2Priority !== undefined && 
               values.task3Priority !== undefined &&
               values.highestPriorityTask !== undefined &&
               typeof values.highestPriorityTask === 'string' &&
               values.highestPriorityTask.length > 0;
      
      case 3: // Calculating completion rate
        // Check if they've calculated the completion percentage
        return values.completedTasks !== undefined &&
               values.totalTasks !== undefined &&
               values.completionRate !== undefined &&
               typeof values.completionRate === 'number';
      
      default:
        return false;
    }
  };
  
  const handleNextStep = () => {
    if (stepCompleted[currentStep]) {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
        setFeedback("");
      }
    } else {
      setFeedback("Complete the current task before moving to the next step.");
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setFeedback("");
    }
  };
  
  // Define content for each step
  const steps = {
    0: {
      title: "Introduction to Managing Multiple Tasks",
      content: (
        <>
          <p>
            A real task management application needs to handle multiple tasks. This module teaches you
            how to organize variables for multiple tasks and perform operations across them.
          </p>
          
          <Card className="concept-card mb-4">
            <Card.Header as="h4">Key Concepts</Card.Header>
            <Card.Body>
              <ul>
                <li><strong>Consistent Naming:</strong> Using patterns like task1Name, task2Name</li>
                <li><strong>Task Comparison:</strong> Comparing priorities and deadlines</li>
                <li><strong>Task Statistics:</strong> Calculating completion rates and averages</li>
                <li><strong>Task Filtering:</strong> Identifying tasks with specific properties</li>
              </ul>
            </Card.Body>
          </Card>
          
          <p>
            Follow the steps in this module to create a system that can manage multiple tasks
            and provide useful insights across them.
          </p>
        </>
      )
    },
    1: {
      title: "Creating Multiple Task Variables",
      content: (
        <>
          <p>
            When managing multiple tasks, it's essential to use consistent naming conventions
            to keep your code organized and readable.
          </p>
          
          <HintButton>
            <div className="code-example">
              <pre>
{`// Variables for multiple tasks
// Task 1
let task1Name = "Complete project proposal";
let task1Priority = 3;  // 1=low, 2=medium, 3=high
let task1Progress = 75;
let task1Completed = false;

// Task 2
let task2Name = "Schedule team meeting";
let task2Priority = 2;
let task2Progress = 100;
let task2Completed = true;

// Display information about both tasks
console.log("Task 1: " + task1Name + " - " + task1Progress + "% complete");
console.log("Task 2: " + task2Name + " - " + task2Progress + "% complete");`}
              </pre>
            </div>
          </HintButton>
          
          <div className="step-instruction">
            <h4>👉 Create multiple task variables</h4>
            <ol>
              <li>Create variables for at least 3 different tasks</li>
              <li>For each task, include: name, priority (1-3), progress percentage, and completion status</li>
              <li>Use a consistent naming pattern (such as task1Name, task2Name, etc.)</li>
              <li>Display information about all tasks using console.log()</li>
            </ol>
          </div>
        </>
      )
    },
    2: {
      title: "Comparing Task Priorities",
      content: (
        <>
          <p>
            One of the most common operations in task management is comparing tasks to determine
            which ones need attention first.
          </p>
          
          <HintButton>
            <div className="code-example">
              <pre>
{`// Compare task priorities
let highestPriorityTask = "";
let highestPriority = 0;

// Check task 1
if (!task1Completed && task1Priority > highestPriority) {
  highestPriorityTask = task1Name;
  highestPriority = task1Priority;
}

// Check task 2
if (!task2Completed && task2Priority > highestPriority) {
  highestPriorityTask = task2Name;
  highestPriority = task2Priority;
}

console.log("Highest priority task: " + highestPriorityTask);`}
              </pre>
            </div>
          </HintButton>
          
          <div className="step-instruction">
            <h4>👉 Compare task priorities</h4>
            <ol>
              <li>Create variables <code>highestPriorityTask</code> and <code>highestPriority</code></li>
              <li>Write logic to find the incomplete task with the highest priority</li>
              <li>Only consider tasks that are not completed (taskXCompleted === false)</li>
              <li>Store the name of the highest priority task in <code>highestPriorityTask</code></li>
              <li>Display the result using console.log()</li>
            </ol>
          </div>
        </>
      )
    },
    3: {
      title: "Calculating Overall Completion",
      content: (
        <>
          <p>
            To track project progress, we need to calculate statistics across all tasks,
            such as the overall completion rate.
          </p>
          
          <HintButton>
            <div className="code-example">
              <pre>
{`// Calculate completion rate
let totalTasks = 3;
let completedTasks = 0;

// Count completed tasks
if (task1Completed) completedTasks++;
if (task2Completed) completedTasks++;
if (task3Completed) completedTasks++;

// Calculate completion percentage
let completionRate = (completedTasks / totalTasks) * 100;

console.log("Tasks completed: " + completedTasks + " out of " + totalTasks);
console.log("Completion rate: " + completionRate + "%");`}
              </pre>
            </div>
          </HintButton>
          
          <div className="step-instruction">
            <h4>👉 Calculate completion statistics</h4>
            <ol>
              <li>Create a variable <code>totalTasks</code> with the total number of tasks</li>
              <li>Create a variable <code>completedTasks</code> and initialize it to 0</li>
              <li>Count how many tasks are completed (where taskXCompleted is true)</li>
              <li>Calculate the <code>completionRate</code> as a percentage</li>
              <li>Display both the number of completed tasks and the completion rate</li>
            </ol>
          </div>
        </>
      )
    }
  };
  
  return (
    <div className="module-container">
      <h2>Module 4: Managing Multiple Tasks</h2>
      
      {/* Current Task Display */}
      <div className="current-task">
        <h3>Your Task:</h3>
        <p className="task-instruction">{stepInstructions[currentStep as keyof typeof stepInstructions]}</p>
      </div>
      
      <div className="module-navigation">
        {/* Step Navigation */}
        <div className="step-navigation">
          <button 
            onClick={handlePrevStep} 
            disabled={currentStep === 0}
          >
            Previous
          </button>
          <span className="step-indicator">Step {currentStep + 1} of {totalSteps}</span>
          <button 
            onClick={handleNextStep}
            disabled={currentStep === totalSteps - 1 || !stepCompleted[currentStep]}
          >
            Next
          </button>
        </div>
      </div>
      
      {feedback && (
        <div className={`feedback-message ${feedback.includes("Great") ? "success" : "error"}`}>
          {feedback}
        </div>
      )}
      
      <div className="step-content">
        <h3>{steps[currentStep as keyof typeof steps]?.title || "Step"}</h3>
        {steps[currentStep as keyof typeof steps]?.content}
      </div>
    </div>
  );
};

// Module 5: Working with Task Variables
const Module5Content: React.FC<Omit<VariablesModuleContentProps, 'moduleId'>> = ({
  darkMode,
  code = '',
  onCodeChange,
  runtimeValues = {},
  consoleOutput = []
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;
  const [stepCompleted, setStepCompleted] = useState<Record<number, boolean>>({
    0: true, // First lesson is an introduction
    1: false,
    2: false,
    3: false
  });
  const [feedback, setFeedback] = useState("");
  
  // When the module receives new code, check if it satisfies the current step
  useEffect(() => {
    if (code) {
      // Auto-verify if they completed the current step
      if (verifyStep(currentStep, code, runtimeValues, consoleOutput) && !stepCompleted[currentStep]) {
        setStepCompleted(prev => ({...prev, [currentStep]: true}));
        setFeedback("Great job! You've completed this step. You can now proceed to the next step.");
      }
    }
  }, [code, currentStep, runtimeValues, consoleOutput, stepCompleted]);
  
  const verifyStep = (step: number, codeValue: string, values: Record<string, any>, output: any[]) => {
    switch(step) {
      case 1: // Console Logging Variables
        // Check if they've logged taskName, isCompleted, and dueDate
        return output.some(entry => 
            typeof entry === 'string' && entry.includes(values.taskName || '')) &&
          output.some(entry => 
            entry === values.isCompleted || 
            (typeof entry === 'string' && entry.includes(String(values.isCompleted)))) &&
          output.some(entry => 
            typeof entry === 'string' && entry.includes(values.dueDate || ''));
            
      case 2: // String Concatenation
        // Check if they've created a taskSummary variable with concatenated values
        return values.taskSummary !== undefined && 
               typeof values.taskSummary === 'string' &&
               values.taskSummary.includes(values.taskName || '') &&
               values.taskSummary.includes(values.dueDate || '');
               
      case 3: // Conditional Logic
        // Check if they've written an if/else statement based on isCompleted
        const hasIfCondition = codeValue.includes('if') && 
                              (codeValue.includes('isCompleted') || 
                               codeValue.includes('isComplete'));
        const hasElseStatement = codeValue.includes('else');
        return hasIfCondition && hasElseStatement && 
               values.status !== undefined &&
               typeof values.status === 'string';
               
      default:
        return false;
    }
  };
  
  const handleNextStep = () => {
    if (stepCompleted[currentStep]) {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
        setFeedback("");
      }
    } else {
      setFeedback("Complete the current task before moving to the next step.");
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setFeedback("");
    }
  };
  
  // Define step instructions to display prominently
  const stepInstructions = {
    0: "Learn about ways to output and manipulate task information in JavaScript.",
    1: "Use console.log() to display your variables and see task information in the console.",
    2: "Create a task summary using string concatenation to combine task name and due date.",
    3: "Use if/else statements to display different messages based on task completion status."
  };
  
  return (
    <div className="module-container">
      
      {feedback && (
        <div className={`feedback-message ${feedback.includes("Great") ? "success" : "error"}`}>
          {feedback}
        </div>
      )}
      
      {currentStep === 0 && (
        <div className="module-section">
          <h3>Working with Task Variables</h3>
          <p>
            Now that you've created variables for your task, let's learn how to work with them.
            In this module, we'll cover basic operations you'll need for your task manager.
          </p>
          
          <Card className="concept-card mb-4">
            <Card.Header as="h4">Key Skills You'll Learn</Card.Header>
            <Card.Body>
              <ul>
                <li><strong>Outputting Variables:</strong> Seeing task information in the console</li>
                <li><strong>String Concatenation:</strong> Combining text to create task summaries</li>
                <li><strong>Conditional Logic:</strong> Making decisions based on task status</li>
                <li><strong>Date Calculations:</strong> Working with deadlines and time estimates</li>
              </ul>
            </Card.Body>
          </Card>
          
          <p>
            These skills form the foundation for more advanced task management features
            like task filtering, sorting, and status tracking.
          </p>
        </div>
      )}
      
      {currentStep === 1 && (
        <div className="module-section">
          <h3>Console Logging Task Variables</h3>
          <p>
            <code>console.log()</code> is a powerful tool for debugging and seeing your task information.
            It's like having a direct window into your program's current state.
          </p>
          
          <Card className="concept-card mb-4">
            <Card.Header as="h4">Using console.log()</Card.Header>
            <Card.Body>
              <p>You can log single variables, messages, or combinations:</p>
              
              <HintButton>
                <div className="code-example">
                  <pre>
{`// Basic console logging
console.log(taskName);                       // Just the variable

// Adding context with labels
console.log("Task Name:", taskName);         // Label and variable

// Logging multiple values at once
console.log("Task:", taskName, "Due:", dueDate);

// Checking boolean values
console.log("Is Completed:", isCompleted);   // Shows true or false`}
                  </pre>
                </div>
              </HintButton>
              
              <p>The console output appears in the Console panel below your code editor.</p>
            </Card.Body>
          </Card>
          
          <div className="step-instruction">
            <h4>👉 Log Your Task Variables</h4>
            <ol>
              <li>If you don't already have them, create these basic variables:
                <ul>
                  <li><code>let taskName = "Your task name here";</code></li>
                  <li><code>let isCompleted = false;</code> (or true)</li>
                  <li><code>let dueDate = "2023-12-31";</code> (or any date)</li>
                </ul>
              </li>
              <li>Add console.log statements to display all three variables</li>
              <li>Make your log statements informative by adding descriptive labels</li>
              <li>Run your code and check the Console panel to see the output</li>
            </ol>
          </div>
        </div>
      )}
      
      {currentStep === 2 && (
        <div className="module-section">
          <h3>String Concatenation for Task Summaries</h3>
          <p>
            String concatenation means combining strings together. This is perfect for 
            creating readable task summaries that combine multiple pieces of information.
          </p>
          
          <Card className="concept-card mb-4">
            <Card.Header as="h4">Combining Strings</Card.Header>
            <Card.Body>
              <p>You can use the <code>+</code> operator to join strings:</p>
              
              <HintButton>
                <div className="code-example">
                  <pre>
{`// Basic concatenation
let firstName = "John";
let lastName = "Doe";
let fullName = firstName + " " + lastName;    // "John Doe"

// Creating a task summary
let taskName = "Project Proposal";
let dueDate = "2023-12-31";
let taskSummary = "Task: " + taskName + " (Due: " + dueDate + ")";

// Result: "Task: Project Proposal (Due: 2023-12-31)"
console.log(taskSummary);

// Template literals (modern approach with backticks)
let summary = \`Task: \${taskName} (Due: \${dueDate})\`;
console.log(summary);`}
                  </pre>
                </div>
              </HintButton>
            </Card.Body>
          </Card>
          
          <div className="step-instruction">
            <h4>👉 Create a Task Summary</h4>
            <ol>
              <li>Create a new variable called <code>taskSummary</code></li>
              <li>Use string concatenation to combine:
                <ul>
                  <li>The task name</li>
                  <li>The due date</li>
                  <li>Any additional information you want to include</li>
                </ul>
              </li>
              <li>Make the summary readable with appropriate spacing and punctuation</li>
              <li>Log the summary to the console</li>
              <li>Bonus: Try using template literals (with backticks) for a cleaner approach</li>
            </ol>
          </div>
        </div>
      )}
      
      {currentStep === 3 && (
        <div className="module-section">
          <h3>Conditional Logic for Task Status</h3>
          <p>
            Conditional logic lets you display different messages or take different actions
            based on a task's status.
          </p>
          
          <Card className="concept-card mb-4">
            <Card.Header as="h4">If/Else Statements</Card.Header>
            <Card.Body>
              <p>Use if/else to create branching logic based on conditions:</p>
              
              <HintButton>
                <div className="code-example">
                  <pre>
{`// Basic if/else for task status
let isCompleted = false;
let status;

if (isCompleted) {
  status = "Task is complete!";
} else {
  status = "Task is still in progress.";
}

console.log(status);

// More complex conditions
let priority = "high";
let daysLeft = 3;

if (isCompleted) {
  console.log("No action needed - task is complete.");
} else if (priority === "high" && daysLeft < 5) {
  console.log("URGENT: High priority task due soon!");
} else if (priority === "high") {
  console.log("Important: High priority task.");
} else {
  console.log("Task needs to be completed.");
}`}
                  </pre>
                </div>
              </HintButton>
            </Card.Body>
          </Card>
          
          <div className="step-instruction">
            <h4>👉 Add Conditional Logic</h4>
            <ol>
              <li>Create a new variable called <code>status</code> (don't assign a value yet)</li>
              <li>Write an if/else statement that:
                <ul>
                  <li>Checks if <code>isCompleted</code> is true</li>
                  <li>If true, sets <code>status</code> to a completion message</li>
                  <li>If false, sets <code>status</code> to a "still in progress" message</li>
                </ul>
              </li>
              <li>Log the <code>status</code> variable to the console</li>
              <li>Bonus: Add more conditions for <code>priority</code> or <code>dueDate</code></li>
            </ol>
          </div>
        </div>
      )}
      
      {currentStep === 4 && (
        <div className="module-section">
          <h3>Working with Dates</h3>
          <p>
            Tasks often have deadlines, so understanding how to work with dates is essential
            for your task manager.
          </p>
          
          <Card className="concept-card mb-4">
            <Card.Header as="h4">Date Calculations</Card.Header>
            <Card.Body>
              <p>JavaScript has a Date object for working with dates:</p>
              
              <HintButton>
                <div className="code-example">
                  <pre>
{`// Get today's date
let today = new Date();
console.log("Today:", today);

// Parse a date string
let dueDate = "2023-12-31";  
let dueDateObj = new Date(dueDate);
console.log("Due date:", dueDateObj);

// Calculate days remaining
let timeDiff = dueDateObj.getTime() - today.getTime();
let daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
console.log("Days remaining:", daysRemaining);

// Check if task is overdue
let isOverdue = today > dueDateObj;
console.log("Is task overdue?", isOverdue);

// Format a date (simple approach)
let formattedDate = dueDateObj.toLocaleDateString();
console.log("Formatted date:", formattedDate);`}
                  </pre>
                </div>
              </HintButton>
            </Card.Body>
          </Card>
          
          <div className="step-instruction">
            <h4>👉 Calculate Days Until Due</h4>
            <ol>
              <li>Your task already has a <code>dueDate</code> string (in format YYYY-MM-DD)</li>
              <li>Create a new Date object for today: <code>let today = new Date();</code></li>
              <li>Create a Date object from your due date: <code>let dueDateObj = new Date(dueDate);</code></li>
              <li>Calculate the time difference and convert to days</li>
              <li>Store the result in a variable called <code>daysRemaining</code></li>
              <li>Add conditional logic to display a message based on the days remaining</li>
              <li>Log everything to the console</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default VariablesModuleContent; 