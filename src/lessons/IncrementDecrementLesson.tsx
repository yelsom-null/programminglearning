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
  Button} from '@mui/material';
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

interface IncrementDecrementLessonProps {
  darkMode?: boolean;
}

const IncrementDecrementLesson: React.FC<IncrementDecrementLessonProps> = ({ 
  darkMode = false
}) => {
  const theme = useTheme();
  
  // Initial code sample
  const initialCode = `// Increment and Decrement Operators for Task Tracking
// Use ++ and -- to update task counters efficiently

// Task counters
let totalTasks = 8;
let completedTasks = 0;
let currentTaskIndex = 0;

// Array of tasks
let tasks = [
  "Wireframe UI", 
  "Create components", 
  "Add styles", 
  "Connect API", 
  "Implement auth", 
  "Add error handling", 
  "Write tests", 
  "Deploy"
];

// Function to complete the current task
function completeTask() {
  if (completedTasks < totalTasks) {
    // Increment completed tasks
    completedTasks++;
    
    // Move to next task
    let taskName = tasks[currentTaskIndex++];
    
    // Calculate remaining tasks
    let remainingTasks = totalTasks - completedTasks;
    
    return \`Completed task "\${taskName}". \${remainingTasks} tasks remaining.\`;
  } else {
    return "All tasks already completed!";
  }
}

// Function to skip to the next task without completing
function skipTask() {
  if (currentTaskIndex < totalTasks) {
    // Get current task before incrementing index
    let taskName = tasks[currentTaskIndex++];
    return \`Skipped task "\${taskName}". Moving to next task.\`;
  } else {
    return "No more tasks to skip!";
  }
}

// Function to go back to the previous task
function goToPreviousTask() {
  if (currentTaskIndex > 0) {
    // Pre-decrement to move back, then get the task
    let taskName = tasks[--currentTaskIndex];
    return \`Returned to task "\${taskName}".\`;
  } else {
    return "Already at the first task!";
  }
}

// Test the functions
console.log(completeTask());
console.log(completeTask());
console.log(skipTask());
console.log(goToPreviousTask());
console.log(completeTask());
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
    const currentLessonId = "increment-decrement";
    
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
    const currentLessonId = "increment-decrement";
    
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
  const currentLessonId = "increment-decrement";
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
        title="Increment and Decrement Operators"
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
            title="Introduction to Increment and Decrement"
            subtitle="Efficient operators for updating task counters"
            conceptNumber={1}
            blocks={[
              {
                type: 'text',
                content: 'In task management applications, we often need to increase or decrease values by exactly 1. JavaScript provides special operators for these common operations: ++ (increment) and -- (decrement).'
              },
              {
                type: 'code',
                caption: 'Basic increment and decrement operations:',
                content: `// Increment: increase by 1
let completedTasks = 5;
completedTasks++;        // Add 1 (now equals 6)
console.log(completedTasks);  // 6

// Decrement: decrease by 1
let remainingTasks = 10;
remainingTasks--;        // Subtract 1 (now equals 9) 
console.log(remainingTasks);  // 9

// Common uses in task management
let taskCounter = 0;

// Completing tasks one by one
taskCounter++;  // Complete first task
console.log(\`Completed \${taskCounter} tasks\`);

taskCounter++;  // Complete second task
console.log(\`Completed \${taskCounter} tasks\`);`
              }
            ]}
          />
          
          <TeachingConcept
            title="Prefix vs. Postfix Operators"
            subtitle="Understanding the difference between ++x and x++"
            conceptNumber={2}
            blocks={[
              {
                type: 'text',
                content: 'There are two ways to use these operators, with an important difference:'
              },
              {
                type: 'text',
                content: '• Post-increment (x++): Returns the current value, then increments\n• Pre-increment (++x): Increments first, then returns the new value'
              },
              {
                type: 'code',
                caption: 'Understanding the difference between x++ and ++x:',
                content: `// Post-increment (x++)
let a = 5;
let b = a++;    // Assign a to b (5), then increment a
console.log("a:", a);    // 6 (was incremented after assignment)
console.log("b:", b);    // 5 (got the original value)

// Pre-increment (++x)
let c = 5;
let d = ++c;    // Increment c first, then assign to d
console.log("c:", c);    // 6 (was incremented before assignment)
console.log("d:", d);    // 6 (got the incremented value)

// The same applies to decrement (x-- vs --x)
let taskCount = 10;
console.log(taskCount--);    // Displays 10, then decrements to 9
console.log(--taskCount);    // Decrements to 8, then displays 8`
              },
              {
                type: 'warning',
                caption: 'Be Careful with Order',
                content: 'The difference between prefix and postfix notation is crucial when you use the value in the same expression where you perform the increment/decrement.'
              }
            ]}
          />
          
          <TeachingConcept
            title="Task Management Applications"
            subtitle="Practical examples for project tracking"
            conceptNumber={3}
            blocks={[
              {
                type: 'text',
                content: 'Increment/decrement operators are particularly useful in task management:'
              },
              {
                type: 'code',
                caption: 'Using operators in task tracking functions:',
                content: `// Tracking completed tasks
function markTaskComplete(taskList, taskIndex) {
  if (taskIndex < taskList.length) {
    // Pre-increment completed count, return new value
    return ++taskList.completed;
  }
  return taskList.completed;
}

// Tracking task progress
function moveToNextTask(currentIndex, tasksArray) {
  // Post-increment: use current index, then increment for next time
  const task = tasksArray[currentIndex++];
  console.log(\`Current task: \${task}\`);
  return currentIndex; // Returns incremented value
}

// Handling navigation
function goToPreviousTask(currentIndex, tasksArray) {
  // Pre-decrement: decrease index first, then access the array
  if (currentIndex > 0) {
    const task = tasksArray[--currentIndex];
    console.log(\`Previous task: \${task}\`);
  }
  return currentIndex;
}`
              }
            ]}
          />
          
          <TeachingConcept
            title="Best Practices and Common Mistakes"
            subtitle="Using increment and decrement operators effectively"
            conceptNumber={4}
            blocks={[
              {
                type: 'text',
                content: 'Follow these guidelines to use increment and decrement operators effectively:'
              },
              {
                type: 'text',
                content: '• Use pre-increment (++x) when you need the new value immediately\n• Use post-increment (x++) when you need the original value first\n• Avoid multiple increments in a single expression (x++ + ++x) as it creates confusion\n• Use standalone statements (x++; or ++x;) when you just want to change the value'
              },
              {
                type: 'tip',
                caption: 'Developer Tip',
                content: 'For better readability in complex code, consider using the longer form (x = x + 1) instead of x++ when the intent might not be clear to other developers.'
              },
              {
                type: 'note',
                caption: 'Try the Example',
                content: 'Experiment with the code editor to see how tasks can be tracked and updated using increment and decrement operators.'
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
              name="inc_dec_editor"
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

export default IncrementDecrementLesson; 