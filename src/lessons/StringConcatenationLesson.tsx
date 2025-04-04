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

interface StringConcatenationLessonProps {
  darkMode?: boolean;
}

const StringConcatenationLesson: React.FC<StringConcatenationLessonProps> = ({ 
  darkMode = false
}) => {
  const theme = useTheme();
  
  // Initial code sample
  const initialCode = `// String Concatenation for Task Management
// Create meaningful task descriptions by combining strings

// Basic task information
let taskName = "Create project proposal";
let assignee = "John Doe";
let dueDate = "2023-05-15";
let priority = "High";
let progress = 30;

// Create a task summary using + operator
let taskSummary = "Task: " + taskName + " | Assigned to: " + assignee;

// Create a detailed report using template literals
let detailedReport = \`
=== TASK DETAILS ===
Name: \${taskName}
Assignee: \${assignee}
Due Date: \${dueDate}
Priority: \${priority}
Progress: \${progress}%
\`;

// Display both in the console
console.log(taskSummary);
console.log(detailedReport);

// Try modifying the variables and see how the output changes!
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
    const currentLessonId = "string-concatenation";
    
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
    const currentLessonId = "string-concatenation";
    
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
  const currentLessonId = "string-concatenation";
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
        title="String Concatenation for Task Summaries"
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
            title="Introduction to String Concatenation"
            subtitle="Combining strings in JavaScript"
            conceptNumber={1}
            lessonId="string-concatenation"
            blocks={[
              {
                type: 'text',
                content: 'In task management applications, we often need to create meaningful descriptions and summaries by combining text values. String concatenation allows us to join different pieces of text (and other values) into a single string.',
                keyTerms: [
                  {
                    term: 'string concatenation',
                    definition: 'The process of joining two or more strings together to create a new string.'
                  }
                ]
              },
              {
                type: 'visualization',
                content: 'String concatenation visualization',
                visualization: {
                  type: 'flow',
                  title: 'How String Concatenation Works',
                  description: 'Individual strings are joined together to form a new, combined string.'
                }
              },
              {
                type: 'code',
                caption: 'Basic concatenation with the + operator:',
                content: `// Creating strings with the + operator
let firstName = "Maria";
let lastName = "Garcia";

// Concatenating with a space between
let fullName = firstName + " " + lastName;
console.log(fullName);            Outputs: "Maria Garcia"

// Building descriptive task strings
let taskVerb = "Debug";
let taskObject = "login form";
let taskDescription = taskVerb + " the " + taskObject;
console.log(taskDescription);     Outputs: "Debug the login form"

// Numbers are converted to strings during concatenation
let taskId = 42;
let taskLog = "Task #" + taskId + ": " + taskDescription;
console.log(taskLog);             Outputs: "Task #42: Debug the login form"

// Multi-part messages with concatenation
let totalTasks = 10;
let completedTasks = 7;
let statusUpdate = "Completed " + completedTasks + " out of " + 
                  totalTasks + " tasks";
console.log(statusUpdate);        Outputs: "Completed 7 out of 10 tasks"`
              },
              {
                type: 'alternative-explanation',
                alternativeTitle: 'If you\'re struggling with string concatenation...',
                content: 'Think of string concatenation like building a train. Each string is a train car, and the + operator is the coupling that connects them. Just as you can connect many train cars to make a longer train, you can connect many strings to make a longer message.'
              }
            ]}
          />
          
          <TeachingConcept
            title="String Concatenation Methods"
            subtitle="Different ways to combine strings"
            conceptNumber={2}
            lessonId="string-concatenation"
            blocks={[
              {
                type: 'text',
                content: 'In addition to the + operator and template literals, JavaScript provides other methods for string concatenation.',
                keyTerms: [
                  {
                    term: 'concat()',
                    definition: 'A string method that joins two or more strings and returns a new string without modifying the original strings.'
                  }
                ]
              },
              {
                type: 'code',
                caption: 'Using the concat() method:',
                content: `// Using the concat() method
let firstName = "Maria";
let lastName = "Garcia";

// Concatenating with the concat() method
let fullName = firstName.concat(" ", lastName);
console.log(fullName);            Outputs: "Maria Garcia"

// The concat method can take multiple arguments
let greeting = "Hello";
let message = greeting.concat(", ", firstName, " ", lastName, "!");
console.log(message);             Outputs: "Hello, Maria Garcia!"

// String concatenation with arrays
let taskParts = ["Debug", "the", "login", "form"];
let taskDescription = taskParts.join(" ");
console.log(taskDescription);     Outputs: "Debug the login form"

// The original strings remain unchanged
console.log(firstName);           Outputs: "Maria" (unchanged)
console.log(lastName);            Outputs: "Garcia" (unchanged)`
              },
              {
                type: 'advanced',
                advancedTitle: 'Performance Considerations',
                content: 'For simple concatenations, the + operator is usually fastest. The concat() method can be more readable when joining many strings, but may be slower. For repeatedly building large strings, consider using array.join() or a specialized approach like StringBuilder in some environments.'
              }
            ]}
          />
          
          <TeachingConcept
            title="Template Literals"
            subtitle="Modern string formatting in JavaScript"
            conceptNumber={3}
            lessonId="string-concatenation"
            blocks={[
              {
                type: 'text',
                content: 'ES6 introduced template literals, which make string concatenation much cleaner using backticks (`) and ${} for embedding expressions:',
                keyTerms: [
                  {
                    term: 'template literals',
                    definition: 'A modern JavaScript feature that allows embedding expressions within string literals using backticks (`) and ${} syntax.'
                  },
                  {
                    term: 'expression',
                    definition: 'A combination of values, variables, and operators that resolves to a value.'
                  }
                ]
              },
              {
                type: 'visualization',
                content: 'Template literals visualization',
                visualization: {
                  type: 'comparison',
                  title: 'Concatenation vs. Template Literals',
                  description: 'Template literals provide a more readable and maintainable way to create complex strings than traditional concatenation.'
                }
              },
              {
                type: 'code',
                caption: 'Using template literals for more readable string creation:',
                content: `// Template literals use backticks (\\\`) instead of quotes
let projectName = "Task Manager";
let version = 2.1;

// Variable embedding with \${} syntax
let appInfo = \\\`\${projectName} v\${version}\\\`;
console.log(appInfo);             Outputs: "Task Manager v2.1"

// Multi-line strings without concatenation or \\n
let taskDetails = \\\`
Task: Implement login feature
Priority: High
Due date: Next week
Assigned to: Alex
\\\`;
console.log(taskDetails);         Preserves line breaks and formatting

// Expressions inside \${} are evaluated
let totalTasks = 10;
let completedTasks = 7;
let progress = (completedTasks / totalTasks) * 100;
let progressReport = \\\`Project progress: \${progress}% (\${completedTasks}/\${totalTasks} tasks)\\\`;
console.log(progressReport);      Outputs: "Project progress: 70% (7/10 tasks)"

// Math expressions and function calls work inside \${}
let timePerTask = 1.5;            // Time in hours
let remainingTasks = totalTasks - completedTasks;
let timeEstimate = \\\`Estimated time remaining: \${remainingTasks * timePerTask} hours\\\`;
console.log(timeEstimate);        Outputs: "Estimated time remaining: 4.5 hours"`
              },
              {
                type: 'tip',
                caption: 'Template Literal Best Practice',
                content: 'Use template literals instead of concatenation for complex strings with multiple variables or when creating multi-line strings. They\'re more readable and less error-prone.'
              }
            ]}
          />
          
          <TeachingConcept
            title="Building Task Summaries"
            subtitle="Practical applications for task management"
            conceptNumber={4}
            lessonId="string-concatenation"
            blocks={[
              {
                type: 'text',
                content: 'String concatenation and template literals are essential for creating:'
              },
              {
                type: 'text',
                content: `• Task summaries and details
• Progress reports
• User notifications 
• Formatted dates and times
• Status messages`
              },
              {
                type: 'tip',
                caption: 'Try it yourself',
                content: 'Try experimenting with the code editor to create your own task summaries and reports!'
              },
              {
                type: 'related-concepts',
                content: 'Related topics',
                relatedConcepts: [
                  {
                    title: 'Console Logging',
                    lessonId: 'console',
                    description: 'Using string concatenation for effective console messages.',
                    isPrerequisite: false
                  },
                  {
                    title: 'JavaScript Data Types',
                    lessonId: 'javascript-data-types',
                    description: 'Learning more about strings and other data types.',
                    isPrerequisite: true
                  },
                  {
                    title: 'Numbers',
                    lessonId: 'numbers',
                    description: 'Understanding how numbers work with string concatenation.',
                    isPrerequisite: false
                  },
                  {
                    title: 'Variables',
                    lessonId: 'variables-intro',
                    description: 'Creating and using variables for string concatenation.',
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
            borderColor: 'divider'
          }}>
            <CodeEditor
              value={code}
              onChange={handleCodeChange}
              darkMode={darkMode}
              name="string_concat_editor"
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

export default StringConcatenationLesson; 