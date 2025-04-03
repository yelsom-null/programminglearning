import React, { useState, useEffect } from 'react';
import CodeEditor from '../components/CodeEditor';
import { 
  evaluateCodeSafely, 
  evaluateCodeWithAI, 
  isStringifiedClassInstance, 
  parseStringifiedClass 
} from '../utils/codeAnalysis';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardHeader, 
  Chip,
  Paper,
  useTheme,
  Divider,
  Container,
  Button,
  IconButton
} from '@mui/material';
import CodeBlock from '../components/CodeBlock';
import ConceptCard from '../components/ConceptCard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VariablesCheckpointSystem from '../components/VariablesCheckpointSystem';
import VariablesModuleContent from '../components/VariablesModuleContent';
import { useParams, Link } from 'react-router-dom';
import curriculum from '../data/curriculum';
import TeachingConcept from '../components/TeachingConcept';

// LessonNav component to reuse across all lessons
interface LessonNavProps {
  title: string;
  lessonNumber: number;
  totalLessons: number;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

const LessonNav: React.FC<LessonNavProps> = ({
  title,
  lessonNumber,
  totalLessons,
  onPrevious,
  onNext,
  hasPrevious = true,
  hasNext = true
}) => {
  const theme = useTheme();

  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        mb: 4,
        pb: 2,
        borderBottom: `1px solid ${theme.palette.divider}`
      }}
    >
      <Box>
        <Typography variant="caption" color="text.secondary" gutterBottom display="block">
          Lesson {lessonNumber} of {totalLessons}
        </Typography>
        <Typography variant="h4" component="h1" fontWeight="bold">
          {title}
        </Typography>
      </Box>

      <Box 
        sx={{ 
          display: 'flex', 
          gap: 1, 
          mt: { xs: 2, sm: 0 }
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={onPrevious}
          disabled={!hasPrevious}
          size="small"
          sx={{ minWidth: '100px' }}
        >
          Previous
        </Button>
        <Button
          endIcon={<ArrowForwardIcon />}
          variant="contained"
          onClick={onNext}
          disabled={!hasNext}
          size="small"
          sx={{ minWidth: '100px' }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

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
  const theme = useTheme();
  
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
      case 'array': return 'error';
      case 'object': return 'info';
      case 'class': return 'secondary';
      case 'function': return 'secondary';
      default: return 'default';
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

  // Navigation handlers
  const handlePreviousLesson = () => {
    // Find current lesson in curriculum
    const currentLessonId = topic || (initialModuleId === 5 ? 'console' : 'variables-intro');
    
    let prevLesson = null;
    let currentChapter = null;
    
    // Find current chapter and lesson
    for (const chapter of curriculum) {
      const lessonIndex = chapter.lessons.findIndex(l => l.id === currentLessonId);
      if (lessonIndex !== -1) {
        currentChapter = chapter;
        
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
        
        break;
      }
    }
    
    if (prevLesson && prevLesson.route) {
      window.location.href = prevLesson.route;
    }
  };

  const handleNextLesson = () => {
    // Find current lesson in curriculum
    const currentLessonId = topic || (initialModuleId === 5 ? 'console' : 'variables-intro');
    
    let nextLesson = null;
    let currentChapter = null;
    
    // Find current chapter and lesson
    for (const chapter of curriculum) {
      const lessonIndex = chapter.lessons.findIndex(l => l.id === currentLessonId);
      if (lessonIndex !== -1) {
        currentChapter = chapter;
        
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
    
    if (nextLesson && nextLesson.route) {
      window.location.href = nextLesson.route;
    }
  };

  // Find current lesson information for navigation
  const currentLessonId = topic || (initialModuleId === 5 ? 'console' : 'variables-intro');
  let currentLessonIndex = -1;
  let totalLessons = 0;
  let hasPrevious = false;
  let hasNext = false;
  
  // Find current chapter and lesson
  for (const chapter of curriculum) {
    const lessonIndex = chapter.lessons.findIndex(l => l.id === currentLessonId);
    if (lessonIndex !== -1) {
      currentLessonIndex = lessonIndex;
      totalLessons = chapter.lessons.length;
      hasPrevious = lessonIndex > 0 || curriculum.findIndex(c => c.id === chapter.id) > 0;
      hasNext = lessonIndex < chapter.lessons.length - 1 || 
                curriculum.findIndex(c => c.id === chapter.id) < curriculum.length - 1;
      break;
    }
  }

  // Teaching content for Module 1
  const renderModule1Content = () => {
    return (
      <>
        <TeachingConcept
          title="Introduction to Variables"
          subtitle="The foundation of storing and managing data"
          conceptNumber={1}
          blocks={[
            {
              type: 'text',
              content: 'In JavaScript, variables are containers for storing data values. They are the fundamental building blocks for any task management application.'
            },
            {
              type: 'text',
              content: 'Variables allow us to store, track, and manipulate different types of information such as task names, completion status, due dates, and more.'
            },
            {
              type: 'code',
              caption: 'Declaring a variable with let:',
              content: `// Creating a task-related variable
let taskName = "Complete project proposal";
let isCompleted = false;
let dueDate = "2023-12-31";`
            },
            {
              type: 'tip',
              caption: 'Best Practice',
              content: 'Use descriptive variable names that clearly indicate what information they store. For example, use taskName instead of just name.'
            }
          ]}
        />

        <TeachingConcept
          title="Variable Declaration"
          subtitle="Different ways to create variables"
          conceptNumber={2}
          blocks={[
            {
              type: 'text',
              content: 'JavaScript provides three ways to declare variables: var, let, and const. Each has different scoping rules and behaviors.'
            },
            {
              type: 'code',
              caption: 'Modern JavaScript variable declarations:',
              content: `// var - older way, function scoped (avoid using in modern code)
var oldTask = "Legacy task"; 

// let - block scoped, value can be changed (preferred)
let currentTask = "In-progress task";
currentTask = "Updated task"; // Can be reassigned

// const - block scoped, value cannot be changed
const PRIORITY_HIGH = 1;
const PRIORITY_MEDIUM = 2;
const PRIORITY_LOW = 3;
// PRIORITY_HIGH = 0; // Error! Cannot reassign a constant`
            },
            {
              type: 'note',
              caption: 'Variable Scope',
              content: 'Block scope means the variable is only accessible within the curly braces {} where it was defined. Function scope means the variable is accessible throughout the entire function regardless of block boundaries.'
            },
            {
              type: 'warning',
              caption: 'Important',
              content: 'Modern JavaScript best practice is to avoid using var. Instead, use let for variables that will change and const for variables that should remain constant.'
            }
          ]}
        />

        <TeachingConcept
          title="Task Management Variables"
          subtitle="Applying variables to task tracking"
          conceptNumber={3}
          blocks={[
            {
              type: 'text',
              content: 'In a task management system, variables help us track various properties of tasks and projects.'
            },
            {
              type: 'code',
              caption: 'Task management example:',
              content: `// Task properties
let taskTitle = "Implement login feature";
let assignedTo = "Sarah";
let taskPriority = "High";
let isCompleted = false;
let dueDate = "2023-09-30";
let progressPercentage = 75;

// Display task information
console.log("Task: " + taskTitle);
console.log("Assigned to: " + assignedTo);
console.log("Priority: " + taskPriority);
console.log("Completed: " + isCompleted);
console.log("Due date: " + dueDate);
console.log("Progress: " + progressPercentage + "%");`
            },
            {
              type: 'exercise',
              caption: 'Try it yourself',
              content: 'Create variables for a new task in the code editor. Include at least the task name, status, and priority.'
            }
          ]}
        />
      </>
    );
  };

  // Teaching content for Module 2
  const renderModule2Content = () => {
    return (
      <>
        <TeachingConcept
          title="JavaScript Data Types"
          subtitle="Understanding different types of values"
          conceptNumber={1}
          blocks={[
            {
              type: 'text',
              content: 'JavaScript variables can hold different types of data. Understanding these types is crucial for task management applications.'
            },
            {
              type: 'code',
              caption: 'Common data types:',
              content: `// String - for text (task names, descriptions, assignees)
let taskName = "Build user registration form";
let description = "Create a form with email and password fields";

// Number - for quantities (priorities, IDs, durations)
let taskId = 42;
let priority = 1;  // 1=high, 2=medium, 3=low
let estimatedHours = 3.5;

// Boolean - for true/false values (completion status, active status)
let isCompleted = false;
let isActive = true;

// Undefined - variable declared but not assigned a value
let dueDate;  // undefined value

// Null - intentional absence of any value
let assignee = null;  // No one assigned yet

// Check the type of a variable using typeof
console.log(typeof taskName);  // "string"
console.log(typeof priority);  // "number"
console.log(typeof isCompleted);  // "boolean"
console.log(typeof dueDate);  // "undefined"
console.log(typeof assignee);  // "object" (a quirk in JavaScript)`
            }
          ]}
        />

        <TeachingConcept
          title="Complex Data Types"
          subtitle="Working with objects and arrays"
          conceptNumber={2}
          blocks={[
            {
              type: 'text',
              content: 'For more complex task data, we use objects to group related information and arrays to store collections of items.'
            },
            {
              type: 'code',
              caption: 'Objects - for grouping related values:',
              content: `// Create a task object
let task = {
  id: 123,
  title: "Complete project proposal",
  assignedTo: "John Doe",
  dueDate: "2023-11-15",
  priority: "High",
  isCompleted: false,
  progress: 25
};

// Access object properties
console.log(task.title);  // "Complete project proposal"
console.log(task.assignedTo);  // "John Doe"
console.log(task.progress + "%");  // "25%"`
            },
            {
              type: 'code',
              caption: 'Arrays - for storing lists of items:',
              content: `// List of tasks
let tasks = [
  "Complete project proposal",
  "Schedule team meeting",
  "Research new technologies",
  "Update documentation"
];

// Access array elements (zero-based indexing)
console.log(tasks[0]);  // "Complete project proposal"
console.log(tasks[2]);  // "Research new technologies"

// Array of task objects
let taskList = [
  { id: 1, title: "Task 1", isCompleted: true },
  { id: 2, title: "Task 2", isCompleted: false },
  { id: 3, title: "Task 3", isCompleted: false }
];

// Access properties from array of objects
console.log(taskList[0].title);  // "Task 1"
console.log(taskList[1].isCompleted);  // false`
            },
            {
              type: 'exercise',
              caption: 'Try it yourself',
              content: 'Create a task object with at least 5 properties, and create an array with at least 3 tasks. Try accessing various properties and array elements.'
            }
          ]}
        />
      </>
    );
  };

  // Teaching content for Module 3
  const renderModule3Content = () => {
    return (
      <>
        <TeachingConcept
          title="Updating Variables"
          subtitle="Modifying stored values"
          conceptNumber={1}
          blocks={[
            {
              type: 'text',
              content: 'In task management, you frequently need to update variables as task status, progress, or details change.'
            },
            {
              type: 'code',
              caption: 'Basic variable updates:',
              content: `// Initial task state
let taskName = "Implement login form";
let progress = 25;
let isCompleted = false;

console.log("Initial progress:", progress + "%");

// Updating variables
progress = 50;  // Update progress to 50%
console.log("Updated progress:", progress + "%");

// Updating based on current value
progress = progress + 25;  // Add 25% more progress
// OR use the shorthand operator
progress += 25;  // Same as: progress = progress + 25

console.log("Final progress:", progress + "%");

// Update completion status
isCompleted = true;
console.log("Task completed:", isCompleted);`
            }
          ]}
        />

        <TeachingConcept
          title="Working with Task Statuses"
          subtitle="Tracking task progression"
          conceptNumber={2}
          blocks={[
            {
              type: 'code',
              caption: 'Tracking task status changes:',
              content: `// Define possible statuses
const STATUS_NOT_STARTED = "Not Started";
const STATUS_IN_PROGRESS = "In Progress";
const STATUS_REVIEW = "Under Review";
const STATUS_COMPLETED = "Completed";

// Initial task state
let taskStatus = STATUS_NOT_STARTED;
console.log("Initial status:", taskStatus);

// Update as work progresses
taskStatus = STATUS_IN_PROGRESS;
console.log("Work started:", taskStatus);

// Later in the development cycle
taskStatus = STATUS_REVIEW;
console.log("Ready for review:", taskStatus);

// Finally mark as complete
taskStatus = STATUS_COMPLETED;
console.log("Task finished:", taskStatus);`
            },
            {
              type: 'tip',
              caption: 'Using Constants',
              content: 'Using constants (const) for status values ensures consistency and prevents typos when updating statuses.'
            }
          ]}
        />

        <TeachingConcept
          title="Calculating Task Metrics"
          subtitle="Using variables in formulas"
          conceptNumber={3}
          blocks={[
            {
              type: 'code',
              caption: 'Time and progress calculations:',
              content: `// Task time tracking
let estimatedHours = 10;
let hoursWorked = 6;
let hoursRemaining = estimatedHours - hoursWorked;

// Calculate percentage completion
let progressPercentage = (hoursWorked / estimatedHours) * 100;

// Round to whole number
progressPercentage = Math.round(progressPercentage);

console.log("Hours worked:", hoursWorked);
console.log("Hours remaining:", hoursRemaining);
console.log("Progress:", progressPercentage + "%");

// Checking if task is on schedule
let daysAllocated = 5;
let daysSpent = 2;
let progressExpected = (daysSpent / daysAllocated) * 100;

let isOnSchedule = progressPercentage >= progressExpected;
console.log("On schedule?", isOnSchedule);`
            },
            {
              type: 'exercise',
              caption: 'Try it yourself',
              content: 'Update the hours worked and calculate the new progress percentage. Then check if the task is still on schedule.'
            }
          ]}
        />
      </>
    );
  };

  // Teaching content for Module 4
  const renderModule4Content = () => {
    return (
      <>
        <TeachingConcept
          title="Managing Multiple Tasks"
          subtitle="Organizing task data"
          conceptNumber={1}
          blocks={[
            {
              type: 'text',
              content: 'As your task management system grows, you\'ll need to manage multiple tasks effectively.'
            },
            {
              type: 'code',
              caption: 'Creating an array of task objects:',
              content: `// Create a list of task objects
let tasks = [
  {
    id: 1,
    title: "Research competitors",
    assignee: "Alex",
    priority: "Medium",
    completed: true,
    hoursSpent: 4
  },
  {
    id: 2,
    title: "Create wireframes",
    assignee: "Maria",
    priority: "High",
    completed: false,
    hoursSpent: 3
  },
  {
    id: 3,
    title: "Set up development environment",
    assignee: "John",
    priority: "Low",
    completed: true,
    hoursSpent: 2
  }
];

// Accessing specific tasks
console.log("Second task:", tasks[1].title);  // "Create wireframes"`
            }
          ]}
        />

        <TeachingConcept
          title="Comparing and Filtering Tasks"
          subtitle="Finding specific tasks in collections"
          conceptNumber={2}
          blocks={[
            {
              type: 'code',
              caption: 'Identifying high-priority tasks:',
              content: `// Identify high priority tasks
let highPriorityTasks = [];

for (let i = 0; i < tasks.length; i++) {
  if (tasks[i].priority === "High") {
    highPriorityTasks.push(tasks[i]);
  }
}

console.log("High priority tasks:", highPriorityTasks.length);

// Find overdue tasks (using a more modern approach)
let today = new Date();
let overdueTasks = tasks.filter(task => {
  // Assuming each task has a dueDate property
  if (!task.dueDate) return false;
  let dueDate = new Date(task.dueDate);
  return !task.completed && dueDate < today;
});

console.log("Overdue tasks:", overdueTasks.length);`
            }
          ]}
        />

        <TeachingConcept
          title="Task Summary Statistics"
          subtitle="Calculating project metrics"
          conceptNumber={3}
          blocks={[
            {
              type: 'code',
              caption: 'Calculating project statistics:',
              content: `// Calculate task statistics
let totalTasks = tasks.length;
let completedTasks = 0;
let totalHoursSpent = 0;

for (let i = 0; i < tasks.length; i++) {
  if (tasks[i].completed) {
    completedTasks++;
  }
  totalHoursSpent += tasks[i].hoursSpent;
}

// Calculate completion percentage
let projectProgress = (completedTasks / totalTasks) * 100;

// Create a project summary
let projectSummary = {
  totalTasks: totalTasks,
  completedTasks: completedTasks,
  progressPercentage: projectProgress,
  totalHoursSpent: totalHoursSpent
};

console.log("Project Summary:", projectSummary);`
            },
            {
              type: 'exercise',
              caption: 'Try it yourself',
              content: 'Create your own array of tasks and calculate how many tasks are assigned to each team member.'
            },
            {
              type: 'tip',
              caption: 'Real-world Application',
              content: 'These techniques form the foundation of any task management application, allowing you to track, filter, and report on project status.'
            }
          ]}
        />
      </>
    );
  };

  // Render appropriate module content based on current module
  const renderModuleContent = () => {
    switch (currentModule) {
      case 1:
        return renderModule1Content();
      case 2:
        return renderModule2Content();
      case 3:
        return renderModule3Content();
      case 4:
        return renderModule4Content();
      default:
        return renderModule1Content();
    }
  };

  return (
    <Box sx={{ 
      p: 3, 
      width: '100%', 
      position: 'relative', 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <LessonNav
        title="Building with Variables"
        lessonNumber={currentLessonIndex + 1}
        totalLessons={totalLessons || 12}
        onPrevious={handlePreviousLesson}
        onNext={handleNextLesson}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
      />

      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        gap: 2,
        width: '100%',
        position: 'relative',
        height: 'calc(100vh - 130px)',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          flex: { md: '0 0 50%' }, 
          width: { xs: '100%', md: '50%' }, 
          pr: { md: 2 },
          pt: 0,
          position: 'relative',
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}>
          <Typography variant="h4" gutterBottom sx={{ mt: 0, mb: 3 }}>
            {currentModule === 1 ? '' : 
             `Module ${currentModule}: ${currentModule === 2 ? 'Variable Types' :
                                  currentModule === 3 ? 'Variable Manipulation' :
                                  'Multiple Tasks'}`}
          </Typography>
          
          {renderModuleContent()}
        </Box>

        <Box sx={{ 
          flex: { md: '0 0 50%' }, 
          width: { xs: '100%', md: '50%' }, 
          pl: { md: 2 },
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Paper 
            elevation={3} 
            sx={{ 
              mb: 3, 
              overflow: 'hidden',
              position: 'relative',
              height: '400px',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid',
              borderColor: 'divider'
            }}>
            <CodeEditor
              value={code}
              onChange={handleCodeChange}
              darkMode={darkMode}
              name="variables_editor"
            />
            {error && (
              <Box sx={{ 
                p: 2, 
                color: 'error.main', 
                bgcolor: 'error.light', 
                borderTop: '1px solid',
                borderColor: 'error.main',
                width: '100%',
                flexShrink: 0 
              }}>
                {error}
              </Box>
            )}
          </Paper>

          <Paper elevation={3} sx={{ 
            position: 'relative', 
            zIndex: 1,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(60% - 24px)',
            overflow: 'hidden'
          }}>
            <Typography variant="h5" gutterBottom color="primary" sx={{ p: 2, pb: 0 }}>
              Variable Values
            </Typography>
            <Box sx={{ 
              p: 2, 
              pt: 0,
              overflowY: 'auto',
              flexGrow: 1
            }}>
                {Object.keys(runtimeValues).length === 0 ? (
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 4, 
                  bgcolor: 'background.paper', 
                  borderRadius: 1,
                  border: '1px dashed',
                  borderColor: 'divider'
                }}>
                  <Typography variant="body1" color="text.secondary">
                    No variables created yet.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {Object.entries(runtimeValues).map(([name, value]) => {
                      const type = getValueType(value);
                    const typeColor = getTypeColor(type);
                    
                      return (
                      <Box 
                        key={name} 
                        sx={{ 
                          flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' }, 
                          maxWidth: { xs: '100%', sm: 'calc(50% - 8px)' }
                        }}
                      >
                        <Card 
                          variant="outlined" 
                          sx={{ 
                            borderTop: 3, 
                            borderColor: `${typeColor}.main`,
                            height: '100%'
                          }}
                        >
                          <CardHeader
                            title={
                              <Typography variant="h6">
                              {name}
                              </Typography>
                            }
                            subheader={
                              <Typography variant="caption" color="text.secondary">
                                  {getTypeExplanation(type)}
                              </Typography>
                            }
                            action={
                              value?.aiDescription ? (
                                <Chip
                                  label="AI"
                                  size="small"
                                  color="info"
                                  icon={<span>✨</span>}
                                  title={value.aiDescription}
                                />
                              ) : null
                            }
                            sx={{ pb: 0 }}
                          />
                          <CardContent>
                            <Box 
                              sx={{ 
                                p: 1, 
                                mb: 1,
                                bgcolor: 'action.hover', 
                                borderRadius: 1, 
                                fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                                fontSize: '0.9rem',
                                overflowX: 'auto'
                              }}
                            >
                              {formatValue(value)}
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Chip
                                label={getTypeExplanation(type)}
                                size="small"
                                color={typeColor as any}
                                variant="outlined"
                              />
                            </Box>
                              {value?.aiDescription && (
                              <Box sx={{ 
                                mt: 2, 
                                p: 1, 
                                bgcolor: 'info.lighter', 
                                borderRadius: 1,
                                borderLeft: '4px solid',
                                borderColor: 'info.main'
                              }}>
                                <Typography variant="caption" color="text.secondary">
                                  {value.aiDescription}
                                </Typography>
                              </Box>
                            )}
                          </CardContent>
                          </Card>
                      </Box>
                      );
                    })}
                </Box>
                )}

              {consoleOutput.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: darkMode ? 'grey.900' : 'grey.100' }}>
                    <Typography variant="h6" gutterBottom color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>⌨️</span> Console Output
                    </Typography>
                  {consoleOutput.map((output, index) => (
                      <Box 
                        key={index} 
                        sx={{ 
                          mb: 1, 
                          pb: 1, 
                          borderBottom: index < consoleOutput.length - 1 ? '1px dashed' : 'none',
                          borderColor: 'divider'
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word'
                          }} 
                          color="text.primary"
                        >
                      {formatValue(output)}
                        </Typography>
                      </Box>
                    ))}
                  </Paper>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default VariablesLesson; 