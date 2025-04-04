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
import curriculum, { Chapter, Lesson } from '../data/curriculum';
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

interface NullUndefinedLessonProps {
  darkMode?: boolean;
}

const NullUndefinedLesson: React.FC<NullUndefinedLessonProps> = ({ 
  darkMode = false
}) => {
  const theme = useTheme();
  
  // Initial code sample
  const initialCode = `// Null vs Undefined in Task Management

// PART 1: Understanding the Difference
// ====================================

// undefined: variable is declared but has no value assigned
let taskDueDate;
console.log("1. Undefined variable:", taskDueDate);  // undefined

// null: explicitly assigned "no value"
let taskAssignee = null;
console.log("2. Null variable:", taskAssignee);  // null

// Type checking
console.log("3. typeof undefined:", typeof undefined);  // "undefined"
console.log("4. typeof null:", typeof null);  // "object" (JS quirk)

// Equality comparisons
console.log("5. null == undefined:", null == undefined);    // true (loose equality)
console.log("6. null === undefined:", null === undefined);  // false (strict equality)

// PART 2: Task Management with null and undefined
// ==============================================

// Task object with intentional null values and missing properties
let task = {
  id: 123,
  title: "Setup project repository", 
  description: "Create initial folder structure and config files",
  dueDate: "2023-12-31",
  assignee: null,              // explicitly no assignee yet
  completedDate: null,         // explicitly not completed
  priority: "high",
  // tags property is missing (will be undefined when accessed)
};

// Accessing properties
console.log("7. Task assignee:", task.assignee);       // null (explicitly set)
console.log("8. Task tags:", task.tags);               // undefined (property doesn't exist)

// PART 3: Different Ways to Check for Empty Values
// ===============================================

// Checking for null
if (task.assignee === null) {
  console.log("9. Task needs to be assigned");
}

// Checking for undefined
if (task.tags === undefined) {
  console.log("10. No tags have been added to this task");
}

// Checking for either null or undefined (unsafe)
if (!task.assignee) {
  console.log("11. Task assignee is empty (null)");
}

if (!task.tags) {
  console.log("12. Task tags is empty (undefined)");
}

// Beware: This approach also catches other falsy values like 0 and ""
let urgentTask = {
  title: "Fix critical bug",
  priority: 0  // 0 = lowest priority in this system
};

if (!urgentTask.priority) {
  // This will incorrectly run even though priority exists but is 0
  console.log("13. WARNING: This runs even though priority exists!");
}

// PART 4: Best Practices for Checking Empty Values
// ==============================================

// 1. Checking for either null or undefined specifically
function isNullOrUndefined(value) {
  return value == null;  // Uses loose equality (==)
  // This works because null == undefined is true
}

console.log("14. isNullOrUndefined(null):", isNullOrUndefined(null));            // true
console.log("15. isNullOrUndefined(undefined):", isNullOrUndefined(undefined));  // true
console.log("16. isNullOrUndefined(0):", isNullOrUndefined(0));                  // false
console.log("17. isNullOrUndefined(''):", isNullOrUndefined(""));                // false

// 2. Using the nullish coalescing operator (??) for default values
function getTaskDuration(task) {
  // If duration is null or undefined, use default value
  return task.duration ?? 1;  // Default to 1 hour
}

let projectTask = { title: "Project planning", duration: 2 };
let meetingTask = { title: "Team meeting", duration: 0 };
let unknownTask = { title: "New task" };  // no duration property
let emptyTask = { title: "Empty task", duration: null };

console.log("18. Task durations:");
console.log("   - Project:", getTaskDuration(projectTask));  // 2 (uses actual value)
console.log("   - Meeting:", getTaskDuration(meetingTask));  // 0 (preserves zero)
console.log("   - Unknown:", getTaskDuration(unknownTask));  // 1 (uses default - undefined)
console.log("   - Empty:", getTaskDuration(emptyTask));      // 1 (uses default - null)

// 3. Using optional chaining (?.) for safe property access
let taskCollection = {
  categories: {
    development: [
      { title: "Fix login bug" },
      { title: "Update API endpoints" }
    ]
    // design category is missing
  }
};

// Safe access with optional chaining
let designTasks = taskCollection.categories?.design?.length ?? 0;
console.log("19. Design tasks:", designTasks);  // 0 (safe access to missing property)

// Without optional chaining this would cause an error:
// let designTasks = taskCollection.categories.design.length;  // Error!

// PART 5: When to Use Each in Task Management
// =========================================

// Use null when:
let userTask = {
  title: "Review documentation",
  assignee: null,      // Explicitly no assignee yet
  dueDate: null,       // Explicitly no due date
  parentTask: null     // Explicitly not a subtask
};

// Use undefined (implicitly) when something just doesn't exist:
let simpleTask = {
  title: "Quick fix"
  // All other properties are undefined because they don't exist
};

// PART 6: Creating a Function to Format Task Info
// ============================================

function formatTaskInfo(task) {
  // Default values using nullish coalescing operator
  const title = task.title ?? "Untitled Task";
  const assignee = task.assignee ?? "Unassigned";
  const dueDate = task.dueDate ?? "No due date";
  const description = task.description ?? "No description provided";
  
  return \`
  TASK: \${title}
  ASSIGNEE: \${assignee}
  DUE: \${dueDate}
  DESCRIPTION: \${description}
  \`;
}

// Test with different tasks
const tasks = [
  {
    id: 1,
    title: "Complete project",
    dueDate: "2023-12-31",
    assignee: null,  // explicitly not assigned
    description: undefined  // implicitly missing
  },
  {
    id: 2,
    title: "Review code"
    // dueDate is missing
    // assignee is missing
    // description is missing
  }
];

console.log("20. Formatted task info:");
console.log(formatTaskInfo(tasks[0]));
console.log(formatTaskInfo(tasks[1]));`;
  
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
    const currentLessonId = "null-undefined";
    
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
    const currentLessonId = "null-undefined";
    
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
  const currentLessonId = "null-undefined";
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
        title="Null and Undefined in JavaScript"
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
            title="Understanding Null vs Undefined"
            subtitle="The fundamental difference between two 'empty' values"
            conceptNumber={1}
            blocks={[
              {
                type: 'text',
                content: 'JavaScript has two different ways to represent "nothing" or "no value" - null and undefined. Understanding the difference is crucial for effective task management applications.'
              },
              {
                type: 'code',
                caption: 'The basic difference between null and undefined:',
                content: `// undefined: variable is declared but has no value assigned
let taskDueDate;
console.log("Undefined variable:", taskDueDate);  // undefined

// null: explicitly assigned "no value"
let taskAssignee = null;
console.log("Null variable:", taskAssignee);  // null

// Type checking
console.log("typeof undefined:", typeof undefined);  // "undefined"
console.log("typeof null:", typeof null);  // "object" (JS quirk)

// Equality comparisons
console.log("null == undefined:", null == undefined);    // true (loose equality)
console.log("null === undefined:", null === undefined);  // false (strict equality)`
              },
              {
                type: 'warning',
                caption: 'JavaScript Quirk',
                content: 'Despite null representing an empty object reference, typeof null returns "object", which is considered a JavaScript bug that can\'t be fixed for backward compatibility reasons.'
              }
            ]}
          />
          
          <TeachingConcept
            title="Task Management with Null and Undefined"
            subtitle="Practical uses in task tracking applications"
            conceptNumber={2}
            blocks={[
              {
                type: 'text',
                content: 'In task management applications, both null and undefined have practical uses:'
              },
              {
                type: 'code',
                caption: 'Task object with intentional null values and missing properties:',
                content: `// Task object with both null values and undefined properties
let task = {
  id: 123,
  title: "Setup project repository", 
  description: "Create initial folder structure and config files",
  dueDate: "2023-12-31",
  assignee: null,              // explicitly no assignee yet
  completedDate: null,         // explicitly not completed
  priority: "high",
  // tags property is missing (will be undefined when accessed)
};

// Accessing properties
console.log("Task assignee:", task.assignee);       // null (explicitly set)
console.log("Task tags:", task.tags);               // undefined (property doesn't exist)

// Use null when you want to indicate a deliberate absence of value:
// - A task deliberately has no assignee yet
// - A task is explicitly not part of any category
// - A message has been intentionally left blank

// Use undefined (by omitting properties) when:
// - A property doesn't apply to this particular task
// - Something hasn't been set or initialized yet by default`
              },
              {
                type: 'tip',
                caption: 'Best Practice',
                content: 'Use null when you want to explicitly indicate "no value" and let properties remain undefined (by not setting them) when they simply don\'t exist yet or don\'t apply.'
              }
            ]}
          />
          
          <TeachingConcept
            title="Checking for Empty Values"
            subtitle="Safe ways to test for null and undefined"
            conceptNumber={3}
            blocks={[
              {
                type: 'text',
                content: 'There are multiple ways to check for null or undefined values, with different trade-offs:'
              },
              {
                type: 'code',
                caption: 'Different ways to check for null and undefined:',
                content: `// Explicit checks
if (task.assignee === null) {
  console.log("Task needs to be assigned");
}

if (task.tags === undefined) {
  console.log("No tags have been added to this task");
}

// Using the falsy nature (can be problematic)
if (!task.assignee) {
  console.log("Task assignee is empty"); // Works for null AND undefined
}

// But beware! This also catches other falsy values like 0 and ""
let urgentTask = {
  title: "Fix critical bug",
  priority: 0  // 0 = lowest priority in this system
};

if (!urgentTask.priority) {
  // This will incorrectly run even though priority exists but is 0
  console.log("WARNING: This runs even though priority exists!");
}

// A safer way to check for either null or undefined
function isNullOrUndefined(value) {
  return value == null;  // Uses loose equality (==)
  // This works because null == undefined is true
}

console.log("isNullOrUndefined(null):", isNullOrUndefined(null));            // true
console.log("isNullOrUndefined(undefined):", isNullOrUndefined(undefined));  // true
console.log("isNullOrUndefined(0):", isNullOrUndefined(0));                  // false
console.log("isNullOrUndefined(''):", isNullOrUndefined(""));                // false`
              },
              {
                type: 'warning',
                caption: 'Avoid Simple Negation',
                content: 'The !variable check is convenient but dangerous as it treats all falsy values (0, "", false, NaN) the same as null and undefined. Use explicit checks or value == null for more reliable code.'
              }
            ]}
          />
          
          <TeachingConcept
            title="Modern JavaScript Solutions"
            subtitle="Elegant handling of null and undefined with ES6+"
            conceptNumber={4}
            blocks={[
              {
                type: 'text',
                content: 'Modern JavaScript provides elegant solutions for working with null and undefined values:'
              },
              {
                type: 'code',
                caption: 'Modern ways to handle null and undefined:',
                content: `// 1. Nullish coalescing operator (??) for default values
function getTaskDuration(task) {
  // If duration is null or undefined, use default value
  return task.duration ?? 1;  // Default to 1 hour
}

let projectTask = { title: "Project planning", duration: 2 };
let meetingTask = { title: "Team meeting", duration: 0 };
let unknownTask = { title: "New task" };  // no duration property
let emptyTask = { title: "Empty task", duration: null };

console.log("Task durations:");
console.log("- Project:", getTaskDuration(projectTask));  // 2 (uses actual value)
console.log("- Meeting:", getTaskDuration(meetingTask));  // 0 (preserves zero)
console.log("- Unknown:", getTaskDuration(unknownTask));  // 1 (undefined → default)
console.log("- Empty:", getTaskDuration(emptyTask));      // 1 (null → default)

// 2. Optional chaining (?.) for safe property access
let taskCollection = {
  categories: {
    development: [
      { title: "Fix login bug" },
      { title: "Update API endpoints" }
    ]
    // design category is missing
  }
};

// Safe access with optional chaining
let designTasks = taskCollection.categories?.design?.length ?? 0;
console.log("Design tasks:", designTasks);  // 0 (safe access to missing property)

// 3. Applying these concepts to format task information
function formatTaskInfo(task) {
  // Default values using nullish coalescing operator
  const title = task.title ?? "Untitled Task";
  const assignee = task.assignee ?? "Unassigned";
  const dueDate = task.dueDate ?? "No due date";
  const description = task.description ?? "No description provided";
  
  return \`
  TASK: \${title}
  ASSIGNEE: \${assignee}
  DUE: \${dueDate}
  DESCRIPTION: \${description}
  \`;
}`
              },
              {
                type: 'note',
                caption: 'Nullish Coalescing vs OR',
                content: 'The ?? operator only falls back to the default when the value is null or undefined, unlike || which also falls back for other falsy values like 0 or empty string. This makes ?? safer for numbers and strings where 0 and "" might be valid values.'
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
              name="null_undefined_editor"
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

export default NullUndefinedLesson; 