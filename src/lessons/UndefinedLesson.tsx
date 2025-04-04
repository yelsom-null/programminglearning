import React, { useState, useEffect } from 'react';
import CodeEditor from '../components/CodeEditor';
import { 
  evaluateCodeWithAI, 
  isStringifiedClassInstance} from '../utils/codeAnalysis';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardHeader, 
  Chip,
  Paper,
  useTheme,
  Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
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

interface UndefinedLessonProps {
  darkMode?: boolean;
}

const UndefinedLesson: React.FC<UndefinedLessonProps> = ({ 
  darkMode = false
}) => {
  const theme = useTheme();
  
  // Initial code sample
  const initialCode = `// Understanding Undefined vs Undeclared Variables for Task Management

// Undefined variables - declared but not assigned a value
let taskName;  
let dueDate;
let assignee;

console.log("Task name:", taskName);  // undefined
console.log("Due date:", dueDate);    // undefined
console.log("Assignee:", assignee);   // undefined

// Checking if variables are undefined
if (taskName === undefined) {
  console.log("Task name has not been set yet");
}

// Using typeof to check for undefined (safer method)
if (typeof dueDate === "undefined") {
  console.log("Due date has not been set yet");
}

// Function parameters that aren't provided become undefined
function createTask(title, priority, dueDate) {
  console.log("Creating task with:");
  console.log("- Title:", title);         // provided value
  console.log("- Priority:", priority);   // undefined if not provided
  console.log("- Due date:", dueDate);    // undefined if not provided
  
  // Create task object (with sensible defaults for undefined params)
  return {
    id: Date.now(),
    title: title || "Untitled Task",
    priority: priority || "Medium",
    dueDate: dueDate || null,
    completed: false
  };
}

// Creating a task with missing parameters
let newTask = createTask("Fix navigation bug");
console.log("New task:", newTask);

// Accessing object properties that don't exist
console.log("Task description:", newTask.description);  // undefined (property doesn't exist)

// Functions without a return statement give undefined
function processTask(task) {
  console.log("Processing task:", task.title);
  // No return statement
}
let result = processTask(newTask);
console.log("Process result:", result);  // undefined

// INCORRECT USAGE: Undeclared variables (causes errors)
try {
  // Uncomment the next line to see the error
  // console.log(undeclaredVar);  // ReferenceError: undeclaredVar is not defined
  console.log("This line won't run if undeclaredVar is used");
} catch (error) {
  console.log("Error caught:", error.name);
}

// Common mistake with undeclared variables in functions
function incorrectFunction() {
  taskStatus = "In Progress";  // Missing let/const/var - creates global variable 
}

// Using strict mode to catch these errors
function strictModeExample() {
  "use strict";
  try {
    // Uncomment the next line to see the error
    // taskPriority = "High";  // Error in strict mode
    console.log("This line won't run if taskPriority is assigned without declaration");
  } catch (error) {
    console.log("Strict mode error:", error.name);
  }
}
strictModeExample();

// Best practices for variables in task management
let taskList = [];          // Initialize arrays
let taskCount = 0;          // Initialize numbers
let isCompleted = false;    // Initialize booleans
let taskDescription = "";   // Initialize strings
let taskOwner = null;       // Use null for intentionally empty values

// Safe access pattern for undefined properties
function getTaskDuration(task) {
  // Check if property exists before using it
  if (task && typeof task.duration !== "undefined") {
    return task.duration;
  }
  return 0;  // Default value
}

console.log("Task duration:", getTaskDuration(newTask));
`;
  
  const [code, setCode] = useState(initialCode);
  const [runtimeValues, setRuntimeValues] = useState<Record<string, any>>({});
  const [consoleOutput, setConsoleOutput] = useState<any[]>([]);
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

  // Navigation handlers
  const handlePreviousLesson = () => {
    // Find current lesson in curriculum
    const currentLessonId = "undefined-undeclared";
    
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
    const currentLessonId = "undefined-undeclared";
    
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
  const currentLessonId = "undefined-undeclared";
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

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <LessonNav
        title="Undefined and Undeclared Variables"
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
        width: '100%'
      }}>
        <Box sx={{ 
          flex: { md: '0 0 50%' }, 
          width: { xs: '100%', md: '50%' }, 
          pr: { md: 2 },
          height: 'calc(100vh - 170px)',
          overflowY: 'auto',
          overflowX: 'hidden',
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}>
          <TeachingConcept
            title="Understanding undefined"
            subtitle="What undefined means in JavaScript"
            conceptNumber={1}
            lessonId="undefined-undeclared"
            blocks={[
              {
                type: 'text',
                content: 'In JavaScript, understanding the difference between undefined and undeclared variables is crucial for building robust task management applications.'
              },
              {
                type: 'text',
                content: 'A variable is undefined when it has been declared but not assigned a value. This is a legitimate state in JavaScript and is represented by the special value undefined.'
              },
              {
                type: 'code',
                caption: 'Variables that have been declared but not yet assigned a value:',
                content: `let taskName;                 This variable is undefined
let dueDate;                  This variable is undefined
let isCompleted;              This variable is undefined

console.log(taskName);        Outputs: undefined

if (taskName === undefined) {
  console.log("Task name has not been set yet");
}

if (typeof taskName === "undefined") {
  console.log("Task name has not been set yet");
}`
              }
            ]}
          />
          
          <TeachingConcept
            title="Undefined vs. Undeclared"
            subtitle="Two different concepts often confused"
            conceptNumber={2}
            lessonId="undefined-undeclared"
            blocks={[
              {
                type: 'text',
                content: 'An undeclared variable is completely different from an undefined one. Undeclared variables have never been created with let, const, or var and will cause ReferenceErrors when accessed.'
              },
              {
                type: 'code',
                caption: 'Undeclared variables cause runtime errors:',
                content: `let taskName;                    undefined but declared variable

try {
  console.log(undeclaredVar);     ReferenceError: not defined
} catch (error) {
  console.log("Error:", error.name);
}

function setupTask() {
  taskStatus = "In Progress";     Missing let/const/var - creates global
}

function strictModeExample() {
  "use strict";
  try {
    taskPriority = "High";        Causes error in strict mode
  } catch (error) {
    console.log("Strict mode prevents globals");
  }
}`
              },
              {
                type: 'tip',
                caption: 'Best Practice',
                content: 'Always use "use strict" in your JavaScript to catch undeclared variable assignments. Also use ESLint or similar tools to detect these issues during development.'
              }
            ]}
          />
          
          <TeachingConcept
            title="Checking for undefined"
            subtitle="Safely working with potentially undefined values"
            conceptNumber={3}
            lessonId="undefined-undeclared"
            blocks={[
              {
                type: 'text',
                content: 'There are several ways to safely work with potentially undefined values in task management applications:'
              },
              {
                type: 'code',
                caption: 'Safe handling of undefined values:',
                content: `function getTaskTitle(task) {
  return task.title || "Untitled Task";    Uses default for falsy values
}

function getTaskPriority(task) {
  return task.priority ?? "Medium";        Only for null/undefined
}

function getSubtaskCount(task) {
  return task.subtasks?.length ?? 0;       Safe property access chain
}

function updateTask(taskId, updates) {
  if (typeof taskId === "undefined") {
    throw new Error("Task ID is required");
  }
  
  // Process updates...
}

function createNewTask(title = "Untitled", priority = "Medium") {
  return { title, priority };              Default parameters in ES6
}`
              },
              {
                type: 'note',
                caption: 'Modern JavaScript',
                content: 'ES6+ provides elegant solutions for undefined values with optional chaining (?.), nullish coalescing (??), and default parameters that make your code more robust.'
              }
            ]}
          />
          
          <TeachingConcept
            title="Undefined in Functions"
            subtitle="Function return values and parameters"
            conceptNumber={4}
            lessonId="undefined-undeclared"
            blocks={[
              {
                type: 'text',
                content: 'There are several situations where you\'ll encounter undefined values in task management applications:'
              },
              {
                type: 'code',
                caption: 'Common scenarios that produce undefined values:',
                content: `function createTask(title, priority, dueDate) {
  console.log("Priority:", priority);   undefined if not provided
  console.log("Due date:", dueDate);    undefined if not provided
  
  return {
    title: title || "Untitled Task",    Using default for undefined parameters
    priority: priority || "Medium",
    dueDate: dueDate || null
  };
}

let task = createTask("Fix login bug");  Missing parameters become undefined

console.log(task.description);  undefined - property doesn't exist

function processTask(task) {
  console.log("Processing:", task.title);
  // No return statement
}
let result = processTask(task);  result will be undefined`
              },
              {
                type: 'warning',
                caption: 'Potential Bugs',
                content: 'Unchecked undefined values can lead to unexpected behavior. Always check that values exist before using them in critical operations.'
              }
            ]}
          />
        </Box>

        <Box sx={{ 
          flex: { md: '0 0 50%' }, 
          width: { xs: '100%', md: '50%' }, 
          pl: { md: 2 }
        }}>
          <Paper elevation={3} sx={{ 
            mb: 3, 
            overflow: 'hidden',
            position: 'relative',
            flexShrink: 0,
            height: '400px',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Box sx={{ 
              position: 'relative',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              flex: 1
            }}>
            <CodeEditor
              value={code}
              onChange={handleCodeChange}
              darkMode={darkMode}
              name="undefined_editor"
            />
            </Box>
            {error && (
              <Box sx={{ 
                p: 2, 
                color: 'error.main', 
                bgcolor: 'error.light', 
                borderTop: '1px solid',
                borderColor: 'error.main' 
              }}>
                {error}
              </Box>
            )}
          </Paper>

          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom color="primary">
              Variable Values
            </Typography>
            <Box>
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

export default UndefinedLesson; 