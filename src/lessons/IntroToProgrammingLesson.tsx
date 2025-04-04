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

interface IntroToProgrammingLessonProps {
  darkMode?: boolean;
}

const IntroToProgrammingLesson: React.FC<IntroToProgrammingLessonProps> = ({ 
  darkMode = false
}) => {
  const theme = useTheme();
  
  // Initial code sample
  const initialCode = `// This is your first computer program!
// The lines that start with // are notes for you (not for the computer)

// This line shows a message on the screen
console.log("Hello! I'm learning to code!");

// Try changing the message above and see what happens!
// For example, change it to your name or favorite color
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
    const currentLessonId = "intro-to-programming";
    
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
    const currentLessonId = "intro-to-programming";
    
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
  const currentLessonId = "intro-to-programming";
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
        title="Introduction to Programming"
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
            title="What is Programming?"
            subtitle="An introduction to giving computers instructions"
            conceptNumber={1}
            lessonId="intro-to-programming"
            blocks={[
              {
                type: 'text',
                content: 'Coding is like giving instructions to a computer. Just like you might write down steps for a recipe, you write steps for the computer to follow.',
                keyTerms: [
                  {
                    term: 'Coding',
                    definition: 'The process of creating instructions for computers to follow using a programming language.'
                  },
                  {
                    term: 'instructions',
                    definition: 'Specific commands that tell a computer exactly what tasks to perform.'
                  }
                ]
              },
              {
                type: 'text',
                content: 'Computers can\'t think for themselves - they only do exactly what you tell them to do. This means you need to be clear and specific with your instructions.'
              },
              {
                type: 'visualization',
                content: 'How code execution works',
                visualization: {
                  type: 'flow',
                  title: 'Code Execution Flow',
                  description: 'Your code goes through several steps before the computer can understand and execute it.'
                }
              },
              {
                type: 'tip',
                caption: 'Think About It',
                content: 'If you were telling a robot how to make a sandwich, you would need to be very detailed. You can\'t just say "make a sandwich" - you\'d have to explain every step!'
              },
              {
                type: 'alternative-explanation',
                alternativeTitle: 'Another way to think about programming',
                content: 'Programming is like writing a detailed recipe for someone who has never cooked before. You need to explain every step, no matter how obvious it might seem to you!'
              }
            ]}
          />

          <TeachingConcept
            title="How Computers Execute Code"
            subtitle="Understanding the process of code execution"
            conceptNumber={2}
            lessonId="intro-to-programming"
            blocks={[
              {
                type: 'text',
                content: 'Let\'s start with the simplest instruction: showing a message on the screen.',
                keyTerms: [
                  {
                    term: 'execute',
                    definition: 'To run or perform the instructions in a program, translating code into actions.'
                  }
                ]
              },
              {
                type: 'code',
                caption: 'Showing a message:',
                content: `// This is how we show a message
console.log("Hello, world!");      Outputs: Hello, world!`
              },
              {
                type: 'note',
                caption: 'What\'s happening here?',
                content: '• console.log is how we tell the computer to display something\n• The text inside the quotes ("Hello, world!") is what gets displayed\n• The semicolon (;) tells the computer this instruction is complete'
              },
              {
                type: 'advanced',
                advancedTitle: 'How Code Gets Processed',
                content: 'When your JavaScript code runs, it\'s processed by an engine that translates your human-readable code into instructions the computer can understand. This happens in milliseconds, allowing for immediate feedback as you write and test your programs.'
              }
            ]}
          />
          
          <TeachingConcept
            title="Programming Languages"
            subtitle="Different languages for different purposes"
            conceptNumber={3}
            lessonId="intro-to-programming"
            blocks={[
              {
                type: 'text',
                content: 'There are many different programming languages, each designed for specific purposes. JavaScript, which we\'re learning, is primarily used for web development.',
                keyTerms: [
                  {
                    term: 'programming languages',
                    definition: 'Formal languages with specific syntax and rules used to give instructions to computers.'
                  },
                  {
                    term: 'JavaScript',
                    definition: 'A programming language primarily used for creating interactive effects within web browsers.'
                  }
                ]
              },
              {
                type: 'visualization',
                content: 'Programming languages overview',
                visualization: {
                  type: 'comparison',
                  title: 'Common Programming Languages',
                  description: 'Different languages are used for different purposes, from web development to data analysis to mobile apps.'
                }
              },
              {
                type: 'related-concepts',
                content: 'Related concepts',
                relatedConcepts: [
                  {
                    title: 'Introduction to JavaScript',
                    lessonId: 'intro-to-javascript',
                    description: 'Learn more about the JavaScript language and its capabilities.',
                    isPrerequisite: false
                  },
                  {
                    title: 'JavaScript Data Types',
                    lessonId: 'javascript-data-types',
                    description: 'Understand the kinds of data that can be used in programming.',
                    isPrerequisite: false
                  }
                ]
              }
            ]}
          />
          
          <TeachingConcept
            title="Why Learn JavaScript?"
            subtitle="The benefits of starting with JavaScript"
            conceptNumber={4}
            lessonId="intro-to-programming"
            blocks={[
              {
                type: 'text',
                content: 'This is just the beginning! As you continue, you\'ll learn how to:'
              },
              {
                type: 'text',
                content: '• Store information in variables (like boxes for data)\n• Do math and other operations\n• Make decisions in your code\n• Repeat actions automatically'
              },
              {
                type: 'note',
                caption: 'Keep Going!',
                content: 'Don\'t worry if this seems simple - everyone starts with these basics. In the next lessons, we\'ll build on what you learned here.'
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
              name="intro_editor"
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

export default IntroToProgrammingLesson; 