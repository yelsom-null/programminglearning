import React, { useState, useEffect } from 'react';
import CodeEditor from '../components/CodeEditor';
import { 
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

interface ConsoleLessonProps {
  darkMode?: boolean;
}

const ConsoleLesson: React.FC<ConsoleLessonProps> = ({ 
  darkMode = false
}) => {
  
  // Initial code sample
  const initialCode = `// Console Logging for Task Management
// Use console methods to output task information

// Task data
let task = {
  id: 123,
  title: "Implement user authentication",
  assignee: "John Doe",
  dueDate: "2023-12-15",
  priority: "High",
  status: "In Progress",
  progress: 60,
  tags: ["frontend", "security"]
};

// Basic console.log
console.log("Task information:");
console.log(task);

// Logging with string formatting
console.log("Task #%d: %s (Priority: %s)", task.id, task.title, task.priority);

// Using console.log with multiple arguments
console.log("Assigned to:", task.assignee, "Due date:", task.dueDate);

// Using template literals (modern approach)
console.log(\`Progress: \${task.progress}% complete\`);

// Different console methods for different types of messages
console.info("Task tags:", task.tags);
console.warn("Task is due in 5 days!");
console.error("Deadline missed for task: " + task.title);

// Grouping related log messages
console.group("Task Details");
console.log("Title:", task.title);
console.log("Status:", task.status);
console.log("Assignee:", task.assignee);
console.groupEnd();

// Console table for structured data
let tasks = [
  { id: 1, title: "Setup project", status: "Completed", progress: 100 },
  { id: 2, title: "Create UI components", status: "In Progress", progress: 70 },
  { id: 3, title: "Connect API", status: "Not Started", progress: 0 }
];
console.table(tasks);

// Tracking time for task performance
console.time("Task Processing Time");
// Simulate some processing
for (let i = 0; i < 1000000; i++) {
  // Processing task...
}
console.timeEnd("Task Processing Time");
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
    const currentLessonId = "console";
    
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
    const currentLessonId = "console";
    
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
  const currentLessonId = "console";
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
        title="Console Logging Task Variables"
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
            title="Introduction to Console Logging"
            subtitle="Using the console for task management debugging"
            conceptNumber={1}
            lessonId="console"
            blocks={[
              {
                type: 'text',
                content: 'The console is a powerful debugging tool that allows you to output information about your tasks and track the execution of your code. It\'s essential for developing and maintaining a task management system.',
                keyTerms: [
                  {
                    term: 'console',
                    definition: 'A debugging interface built into web browsers that allows developers to view outputs and errors from their JavaScript code.'
                  },
                  {
                    term: 'debugging',
                    definition: 'The process of finding and resolving errors or unexpected behavior in code.'
                  }
                ]
              },
              {
                type: 'visualization',
                content: 'Browser console visualization',
                visualization: {
                  type: 'flow',
                  title: 'The Console in Action',
                  description: 'The console displays messages from your code, helping you understand what\'s happening at each step of execution.'
                }
              },
              {
                type: 'code',
                caption: 'Basic console logging:',
                content: `// Basic logging
console.log("Hello, Task Manager!");

// Logging variables with values
let taskName = "Complete project plan";
let isCompleted = false;
let dueDate = "2023-12-31";

console.log(taskName);            Outputs: "Complete project plan"
console.log(isCompleted);         Outputs: false
console.log(dueDate);             Outputs: "2023-12-31"

// Multiple values in one log statement
console.log(taskName, isCompleted, dueDate);
                                  Outputs all three values together

// Descriptive labels make logs easier to understand
console.log("Task:", taskName);   Outputs: "Task: Complete project plan"
console.log("Completed:", isCompleted);
console.log("Due Date:", dueDate);`,
                highlights: [
                  {
                    lineNumbers: [2],
                    explanation: "This is the simplest form of console logging - just a string message."
                  },
                  {
                    lineNumbers: [8, 9, 10],
                    explanation: "Console.log shows the exact value of each variable, including its type."
                  },
                  {
                    lineNumbers: [13, 14],
                    explanation: "You can log multiple values at once by separating them with commas."
                  },
                  {
                    lineNumbers: [17, 18, 19],
                    explanation: "Adding labels before values makes console output much easier to understand."
                  }
                ]
              },
              {
                type: 'quiz',
                caption: 'Check Your Understanding',
                content: 'Test your knowledge of console.log formatting.',
                quiz: {
                  question: 'What will the following code output to the console?  console.log("Status:", true, 42);',
                  options: [
                    'Status: true 42',
                    '"Status:" true 42',
                    'Status: "true" "42"',
                    'Status: true, 42'
                  ],
                  correctAnswer: 0,
                  explanation: 'console.log() prints all arguments with spaces between them. The first argument "Status:" is printed as a string, followed by the boolean true and the number 42.'
                }
              },
              {
                type: 'advanced',
                advancedTitle: 'Advanced Console Techniques',
                content: 'The console object provides many advanced features beyond basic logging. You can use console.assert() to only log when a condition is false, console.count() to count how many times a piece of code is executed, and console.trace() to show the call stack. These are helpful for more complex debugging scenarios in larger task management applications.'
              },
              {
                type: 'alternative-explanation',
                alternativeTitle: 'If you\'re struggling with console.log...',
                content: 'Think of console.log as leaving notes for yourself while your program runs. Just like you might leave sticky notes to remind yourself of things, console.log lets you see what\'s happening in your code at specific moments. It\'s like having a window into your program\'s mind!'
              }
            ]}
          />
          
          <TeachingConcept
            title="Enhanced Console Methods"
            subtitle="Specialized console tools for different output types"
            conceptNumber={2}
            lessonId="console"
            blocks={[
              {
                type: 'text',
                content: 'The console object provides specialized methods for different types of output:',
                keyTerms: [
                  {
                    term: 'console.error',
                    definition: 'A method that outputs an error message to the console, typically displayed in red.'
                  },
                  {
                    term: 'console.warn',
                    definition: 'A method that outputs a warning message to the console, typically displayed in yellow.'
                  }
                ]
              },
              {
                type: 'code',
                caption: 'Different console methods for various purposes:',
                content: `// Error logging - red text for critical issues
console.error("Task deletion failed!");

// Warning logging - yellow text for potential problems 
console.warn("Task is past due date!");

// Info logging - blue text for important information
console.info("Task status updated successfully");

// Debug logging - only shown when debug level is enabled
console.debug("Detailed task processing information");

// Grouping related logs for better organization
console.group("Task Details");
console.log("Name: Fix navigation bug");
console.log("Priority: High");
console.log("Status: In Progress");
console.groupEnd();               Outputs: Closes the group

// Measuring performance
console.time("taskOperation");    Outputs: Starts a timer
// Code that takes time to execute would go here
console.timeEnd("taskOperation"); Outputs: Shows elapsed time`
              },
              {
                type: 'visualization',
                content: 'Console methods visualization',
                visualization: {
                  type: 'comparison',
                  title: 'Different Console Methods',
                  description: 'Each console method serves a specific purpose, with distinct visual styling to help you quickly identify message types.'
                }
              }
            ]}
          />
          
          <TeachingConcept
            title="Logging Complex Data Structures"
            subtitle="Working with objects and arrays in the console"
            conceptNumber={3}
            lessonId="console"
            blocks={[
              {
                type: 'text',
                content: 'When working with tasks, you\'ll often need to inspect complex data structures:',
                keyTerms: [
                  {
                    term: 'console.table',
                    definition: 'A method that displays tabular data as a table in the console, making it easier to read complex objects and arrays.'
                  },
                  {
                    term: 'JSON.stringify',
                    definition: 'A method that converts a JavaScript object to a JSON string, often used for formatting objects in console output.'
                  }
                ]
              },
              {
                type: 'code',
                caption: 'Console methods for handling objects and arrays:',
                content: `// Object with task information
let task = {
  id: 42,
  name: "Implement login",
  assignee: "Sarah",
  dueDate: "2023-09-15",
  subtasks: [
    { id: 1, name: "Design UI", completed: true },
    { id: 2, name: "Write API integration", completed: false }
  ]
};

// Logging the entire object - expandable in browser console
console.log(task);

// Tabular display - great for objects and arrays
console.table(task);              Outputs: Shows properties in table format

// Tabular display for arrays - even better for arrays of objects
console.table(task.subtasks);     Outputs: Clean table of all subtasks

// Inspecting specific properties
console.log("Subtasks:", task.subtasks);
console.log("First subtask:", task.subtasks[0]);

// Destructuring for cleaner logging
const { id, name, assignee } = task;
console.log("Task basics:", id, name, assignee);

// Formatted JSON for better readability
console.log(JSON.stringify(task, null, 2));  Outputs: Pretty-printed JSON`
              },
              {
                type: 'advanced',
                advancedTitle: 'Browser Developer Tools',
                content: 'Modern browser developer tools let you interact with objects in the console. When you log an object, you can click to expand it, search within it, and even modify its properties in real-time. This interactive exploration is incredibly valuable when debugging complex task management applications.'
              }
            ]}
          />
          
          <TeachingConcept
            title="Console for Task Management"
            subtitle="Practical applications in task tracking applications"
            conceptNumber={4}
            lessonId="console"
            blocks={[
              {
                type: 'text',
                content: 'The console is especially useful for task management applications:'
              },
              {
                type: 'text',
                content: `
• Debugging task creation, updates and status changes
• Tracking application performance with console.time()
• Organizing related logs with console.group()
• Displaying task data in tabular format using console.table()
• Using different console methods to distinguish between normal operations, warnings, and errors`
              },
              {
                type: 'tip',
                caption: 'Try it yourself',
                content: 'Try out the console methods in the code editor to see how you can use them for your task management app!'
              },
              {
                type: 'related-concepts',
                content: 'Related topics',
                relatedConcepts: [
                  {
                    title: 'JavaScript Data Types',
                    lessonId: 'javascript-data-types',
                    description: 'Understanding the types of data you can log to the console.',
                    isPrerequisite: true
                  },
                  {
                    title: 'String Concatenation',
                    lessonId: 'string-concatenation',
                    description: 'Learn to combine strings for more effective console messages.',
                    isPrerequisite: false
                  },
                  {
                    title: 'Variables',
                    lessonId: 'variables-intro',
                    description: 'Creating and using variables that can be logged to the console.',
                    isPrerequisite: true
                  }
                ]
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
            height: '400px',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid',
            borderColor: 'divider',
            flexShrink: 0,
            flex: '0 0 400px'
          }}>
            <CodeEditor
              value={code}
              onChange={handleCodeChange}
              darkMode={darkMode}
              name="console_editor"
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

export default ConsoleLesson; 