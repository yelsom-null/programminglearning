import React, { useState, useEffect } from 'react';
import CodeEditor from '../components/CodeEditor';
import { 
  evaluateCodeWithAI, 
  isStringifiedClassInstance
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

interface JavaScriptDataTypesLessonProps {
  darkMode?: boolean;
}

const JavaScriptDataTypesLesson: React.FC<JavaScriptDataTypesLessonProps> = ({ 
  darkMode = false
}) => {
  const theme = useTheme();
  
  // Initial code sample
  const initialCode = `// JavaScript has different types of data

// Type 1: Strings - for text
console.log("This is a string");
console.log('This is also a string');

// Type 2: Numbers - for numeric values
console.log(42);        // A whole number (integer)
console.log(3.14);      // A decimal number
console.log(-10);       // A negative number

// Type 3: Booleans - for true/false values
console.log(true);
console.log(false);

// Let's check what type each value is
console.log(typeof "Hello");    // Shows what type "Hello" is
console.log(typeof 42);         // Shows what type 42 is
console.log(typeof true);       // Shows what type true is
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
    const currentLessonId = "javascript-data-types";
    
    let prevLesson: Lesson | null = null;
    let currentChapter: Chapter | null = null;
    
    // Find current chapter and lesson
    for (const chapter of curriculum) {
      const lessonIndex = chapter.lessons.findIndex((l: Lesson) => l.id === currentLessonId);
      if (lessonIndex !== -1) {
        currentChapter = chapter;
        
        // Get previous lesson
        if (lessonIndex > 0) {
          prevLesson = chapter.lessons[lessonIndex - 1];
        } else {
          // Look for last lesson in previous chapter
          const chapterIndex = curriculum.findIndex((c: Chapter) => c.id === chapter.id);
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
    const currentLessonId = "javascript-data-types";
    
    let nextLesson: Lesson | null = null;
    let currentChapter: Chapter | null = null;
    
    // Find current chapter and lesson
    for (const chapter of curriculum) {
      const lessonIndex = chapter.lessons.findIndex((l: Lesson) => l.id === currentLessonId);
      if (lessonIndex !== -1) {
        currentChapter = chapter;
        
        // Get next lesson
        if (lessonIndex < chapter.lessons.length - 1) {
          nextLesson = chapter.lessons[lessonIndex + 1];
        } else {
          // Look for first lesson in next chapter
          const chapterIndex = curriculum.findIndex((c: Chapter) => c.id === chapter.id);
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
  const currentLessonId = "javascript-data-types";
  let currentLessonIndex = -1;
  let totalLessons = 0;
  let hasPrevious = false;
  let hasNext = false;
  
  // Find current chapter and lesson
  for (const chapter of curriculum) {
    const lessonIndex = chapter.lessons.findIndex((l: Lesson) => l.id === currentLessonId);
    if (lessonIndex !== -1) {
      currentLessonIndex = lessonIndex;
      totalLessons = chapter.lessons.length;
      hasPrevious = lessonIndex > 0 || curriculum.findIndex((c: Chapter) => c.id === chapter.id) > 0;
      hasNext = lessonIndex < chapter.lessons.length - 1 || 
                curriculum.findIndex((c: Chapter) => c.id === chapter.id) < curriculum.length - 1;
      break;
    }
  }

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <LessonNav
        title="JavaScript Data Types"
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
            title="What Are Data Types?"
            subtitle="Different kinds of information in JavaScript"
            conceptNumber={1}
            lessonId="javascript-data-types"
            blocks={[
              {
                type: 'text',
                content: 'In JavaScript, data can be of different types. Think of data types like different kinds of containers - each designed to hold a specific kind of information.',
                keyTerms: [
                  {
                    term: 'data types',
                    definition: 'Categories of values that determine what operations can be performed on them and how they are stored in memory.'
                  }
                ]
              },
              {
                type: 'text',
                content: 'Understanding data types is important because each type has different properties and methods (special abilities) that you can use.'
              },
              {
                type: 'visualization',
                content: 'JavaScript data types',
                visualization: {
                  type: 'container',
                  title: 'JavaScript Data Types',
                  description: 'Different data types store different kinds of information, just like different containers are designed for specific contents.'
                }
              },
              {
                type: 'note',
                caption: 'Fun Fact',
                content: 'JavaScript automatically figures out what type of data you\'re using. This is called "dynamic typing" and makes JavaScript easier for beginners.'
              },
              {
                type: 'advanced',
                advancedTitle: 'Type Coercion in JavaScript',
                content: 'JavaScript will sometimes automatically convert data from one type to another when needed. This is called "type coercion" and can be both helpful and confusing. For example, when you add a number to a string, JavaScript converts the number to a string before concatenating: 5 + "5" = "55".'
              }
            ]}
          />

          <TeachingConcept
            title="Strings - Text Data"
            subtitle="For words, letters, and text"
            conceptNumber={2}
            lessonId="javascript-data-types"
            blocks={[
              {
                type: 'text',
                content: 'Strings are used to store and manipulate text. They can include letters, numbers, symbols, and spaces.',
                keyTerms: [
                  {
                    term: 'strings',
                    definition: 'A sequence of characters (letters, numbers, symbols) used to represent text in JavaScript.'
                  }
                ]
              },
              {
                type: 'code',
                caption: 'Creating strings:',
                content: `// Strings are created with quotes
let name = "Alex";              Outputs: Alex
let message = 'Hello, world!';  Outputs: Hello, world!

// Strings can contain letters, numbers, spaces and symbols
let address = "123 Main St.";
let emoji = "😊";

// You can find out the length of a string
console.log(name.length);       Outputs: 4`
              },
              {
                type: 'visualization',
                content: 'String visualization',
                visualization: {
                  type: 'container',
                  title: 'Strings as Character Collections',
                  description: 'Each character in a string has a position (index) starting from 0.'
                }
              },
              {
                type: 'tip',
                caption: 'Double vs. Single Quotes',
                content: 'You can use either double quotes (") or single quotes (\') for strings. They work exactly the same way, but you need to be consistent within each string.'
              },
              {
                type: 'alternative-explanation',
                alternativeTitle: 'If you\'re struggling with strings...',
                content: 'Think of a string like a necklace, where each character is a bead on the necklace. Just as you can count beads or replace them, you can work with individual characters in a string.'
              }
            ]}
          />
          
          <TeachingConcept
            title="Numbers - Numeric Data"
            subtitle="For counting, measuring, and calculating"
            conceptNumber={3}
            lessonId="javascript-data-types"
            blocks={[
              {
                type: 'text',
                content: 'Numbers in JavaScript are used for calculations. Unlike other programming languages, JavaScript has only one number type for integers and decimals.',
                keyTerms: [
                  {
                    term: 'numbers',
                    definition: 'Numeric values used for calculations in JavaScript, which can be integers (whole numbers) or floating-point (decimal) values.'
                  },
                  {
                    term: 'integers',
                    definition: 'Whole numbers without decimal points (e.g., 1, 42, -7).'
                  },
                  {
                    term: 'floating-point',
                    definition: 'Numbers with decimal places (e.g., 3.14, 2.5, -0.001).'
                  }
                ]
              },
              {
                type: 'code',
                caption: 'Working with numbers:',
                content: `// Numbers don't use quotes
let age = 25;                   Outputs: 25
let price = 19.99;              Outputs: 19.99
let temperature = -5;           Outputs: -5

// You can perform calculations
let sum = 10 + 5;               Outputs: 15
let product = 4 * 3;            Outputs: 12
let remainder = 10 % 3;         Outputs: 1 (remainder of division)`
              },
              {
                type: 'visualization',
                content: 'Number operations',
                visualization: {
                  type: 'flow',
                  title: 'Math Operations in JavaScript',
                  description: 'JavaScript provides various operators for mathematical calculations.'
                }
              },
              {
                type: 'note',
                caption: 'Math in JavaScript',
                content: 'JavaScript has all the standard math operations: addition (+), subtraction (-), multiplication (*), division (/), and more. We\'ll learn about these in detail in later lessons.'
              }
            ]}
          />
          
          <TeachingConcept
            title="Booleans - True/False Data"
            subtitle="For yes/no, true/false, on/off situations"
            conceptNumber={4}
            lessonId="javascript-data-types"
            blocks={[
              {
                type: 'text',
                content: 'Booleans are simple but powerful - they can only be true or false. They\'re used to make decisions in your code.',
                keyTerms: [
                  {
                    term: 'boolean',
                    definition: 'A data type with only two possible values: true or false, used for logical operations and conditions.'
                  }
                ]
              },
              {
                type: 'code',
                caption: 'Using boolean values:',
                content: `// Boolean values are either true or false
let isLoggedIn = true;          Outputs: true
let isCompleted = false;        Outputs: false

// Booleans are often created through comparisons
let isAdult = age >= 18;        true if age is 18 or more
let hasDiscount = price < 20;   true if price is less than 20`
              },
              {
                type: 'visualization',
                content: 'Boolean logic',
                visualization: {
                  type: 'comparison',
                  title: 'True vs False',
                  description: 'Booleans represent binary states - things that can only be in one of two possible conditions.'
                }
              },
              {
                type: 'tip',
                caption: 'Boolean Logic',
                content: 'Booleans are the foundation of computer logic. They\'re used in conditionals (if statements) to decide which code should run based on whether something is true or false.'
              }
            ]}
          />
          
          <TeachingConcept
            title="The typeof Operator"
            subtitle="Finding out what type of data you have"
            conceptNumber={5}
            lessonId="javascript-data-types"
            blocks={[
              {
                type: 'text',
                content: 'JavaScript provides a special operator called typeof that tells you what type of data you\'re working with.',
                keyTerms: [
                  {
                    term: 'typeof',
                    definition: 'An operator that returns a string indicating the data type of a value.'
                  }
                ]
              },
              {
                type: 'code',
                caption: 'Using the typeof operator:',
                content: `// Check the type of different values
console.log(typeof "Hello");    Outputs: "string"
console.log(typeof 42);         Outputs: "number"
console.log(typeof true);       Outputs: "boolean"

// This is useful when debugging
let value = "42";
console.log(typeof value);      Outputs: "string" (not "number"!)`
              },
              {
                type: 'exercise',
                caption: 'Try it yourself',
                content: 'In the editor, try adding some different values and use typeof to check what type they are. Try numbers with and without quotes to see the difference!'
              },
              {
                type: 'related-concepts',
                content: 'Related topics',
                relatedConcepts: [
                  {
                    title: 'Variables',
                    lessonId: 'variables-intro',
                    description: 'Learn how to store and work with different types of data.',
                    isPrerequisite: false
                  },
                  {
                    title: 'Introduction to JavaScript',
                    lessonId: 'intro-to-javascript',
                    description: 'Overview of the JavaScript language.',
                    isPrerequisite: true
                  },
                  {
                    title: 'String Concatenation',
                    lessonId: 'string-concatenation',
                    description: 'Working with string data in JavaScript.',
                    isPrerequisite: false
                  },
                  {
                    title: 'Number Operations',
                    lessonId: 'numbers',
                    description: 'Working with numeric data in JavaScript.',
                    isPrerequisite: false
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
              name="data_types_editor"
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

export default JavaScriptDataTypesLesson; 