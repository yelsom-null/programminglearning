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

interface IntroToJavaScriptLessonProps {
  darkMode?: boolean;
}

const IntroToJavaScriptLesson: React.FC<IntroToJavaScriptLessonProps> = ({ 
  darkMode = false
}) => {
  const theme = useTheme();
  
  // Initial code sample
  const initialCode = `// Welcome to JavaScript!
// This is the most popular programming language in the world

// Let's try some simple JavaScript
console.log("JavaScript runs in the browser");
console.log("JavaScript also runs on servers");
console.log("JavaScript is used to make websites interactive");

// You can try editing the messages above
// Or add your own new message below
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
    const currentLessonId = "intro-to-javascript";
    
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
    const currentLessonId = "intro-to-javascript";
    
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
  const currentLessonId = "intro-to-javascript";
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
        title="Introduction to JavaScript"
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
            title="What is JavaScript?"
            subtitle="Understanding JavaScript's role in web development"
            conceptNumber={1}
            lessonId="intro-to-javascript"
            blocks={[
              {
                type: 'text',
                content: 'JavaScript is the world\'s most popular programming language. Despite having "Java" in its name, it has nothing to do with the Java programming language!',
                keyTerms: [
                  {
                    term: 'JavaScript',
                    definition: 'A high-level programming language primarily used to create interactive effects within web browsers.'
                  }
                ]
              },
              {
                type: 'text',
                content: 'JavaScript was created in 1995 to make websites interactive. Before JavaScript, websites were just static pages - like reading a book. JavaScript made websites respond to your actions, creating a more engaging experience.'
              },
              {
                type: 'visualization',
                content: 'JavaScript in web development',
                visualization: {
                  type: 'flow',
                  title: 'JavaScript\'s Role in Web Development',
                  description: 'JavaScript connects the user interface with backend systems, allowing for dynamic content and interactivity.'
                }
              },
              {
                type: 'note',
                caption: 'Did you know?',
                content: 'JavaScript was created in just 10 days by Brendan Eich while he was working at Netscape. It was originally called "Mocha", then "LiveScript", before settling on "JavaScript".'
              },
              {
                type: 'advanced',
                advancedTitle: 'JavaScript Engines',
                content: 'JavaScript code is executed by a JavaScript engine, which is built into modern web browsers. Chrome uses V8, Firefox uses SpiderMonkey, and Safari uses JavaScriptCore. These engines compile JavaScript code into machine code that your computer can understand and execute very quickly.'
              }
            ]}
          />

          <TeachingConcept
            title="Where JavaScript is Used"
            subtitle="More places than you might think"
            conceptNumber={2}
            lessonId="intro-to-javascript"
            blocks={[
              {
                type: 'text',
                content: 'JavaScript started in web browsers, but now it\'s used almost everywhere:',
                keyTerms: [
                  {
                    term: 'browser',
                    definition: 'A software application used to access and view websites on the internet, such as Chrome, Firefox, Safari, or Edge.'
                  },
                  {
                    term: 'Node.js',
                    definition: 'A runtime environment that allows JavaScript to be executed outside of web browsers, enabling server-side development.'
                  }
                ]
              },
              {
                type: 'text',
                content: '• Web Browsers: Creating interactive websites and web apps\n• Web Servers: Running backend services with Node.js\n• Mobile Apps: Building apps for phones and tablets\n• Desktop Apps: Creating programs for Windows, Mac, and Linux\n• Games: Creating browser and mobile games\n• Smart Devices: Programming IoT (Internet of Things) devices'
              },
              {
                type: 'tip',
                caption: 'Learning JavaScript Opens Doors',
                content: 'When you learn JavaScript, you gain skills that can be applied in many different tech fields - from web development to game design!'
              },
              {
                type: 'alternative-explanation',
                alternativeTitle: 'If you\'re struggling to understand JavaScript\'s reach...',
                content: 'Think of JavaScript as a universal language for computers, similar to how English is often used across many countries. Just as knowing English helps you communicate in many places, knowing JavaScript helps you work with many different platforms and technologies.'
              }
            ]}
          />
          
          <TeachingConcept
            title="JavaScript in Web Browsers"
            subtitle="Making websites come alive"
            conceptNumber={3}
            lessonId="intro-to-javascript"
            blocks={[
              {
                type: 'text',
                content: 'JavaScript works with HTML and CSS to create modern websites:',
                keyTerms: [
                  {
                    term: 'HTML',
                    definition: 'HyperText Markup Language, used to define the structure and content of web pages.'
                  },
                  {
                    term: 'CSS',
                    definition: 'Cascading Style Sheets, used to control the appearance and layout of HTML elements.'
                  }
                ]
              },
              {
                type: 'text',
                content: '• HTML creates the structure (like the skeleton)\n• CSS styles the appearance (like clothing and makeup)\n• JavaScript adds behavior (like muscles and a brain)'
              },
              {
                type: 'visualization',
                content: 'Web Technologies Visualization',
                visualization: {
                  type: 'comparison',
                  title: 'Web Technologies Working Together',
                  description: 'HTML, CSS, and JavaScript work together to create the complete web experience.'
                }
              },
              {
                type: 'text',
                content: 'With JavaScript, websites can respond to user actions like clicks and typing, animate elements, fetch data from servers, and much more!'
              },
              {
                type: 'code',
                caption: 'This simple code shows a message in the browser:',
                content: `// Show a message
console.log("Hello from JavaScript!");  Outputs: Hello from JavaScript!

// We can also show alerts
// (You won't see this run in our editor though)
alert("Welcome to JavaScript!");`
              }
            ]}
          />
          
          <TeachingConcept
            title="JavaScript for Beginners"
            subtitle="Why it's a great first language"
            conceptNumber={4}
            lessonId="intro-to-javascript"
            blocks={[
              {
                type: 'text',
                content: 'JavaScript is a wonderful first programming language for several reasons:',
                keyTerms: [
                  {
                    term: 'syntax',
                    definition: 'The set of rules that define how JavaScript programs must be written to be valid.'
                  }
                ]
              },
              {
                type: 'text',
                content: '1. Built-in to browsers - no setup needed to get started\n2. Instant feedback - see your code working immediately\n3. Forgiving - it tries to run even with small mistakes\n4. Huge community - easy to find help and resources online\n5. Actually used in the real world - not just for learning'
              },
              {
                type: 'exercise',
                caption: 'Try it yourself',
                content: 'In the editor on the right, try adding another line with console.log() and a message of your choosing. What happens when you add it?'
              },
              {
                type: 'related-concepts',
                content: 'Related topics',
                relatedConcepts: [
                  {
                    title: 'JavaScript Data Types',
                    lessonId: 'javascript-data-types',
                    description: 'Learn about the different kinds of data you can use in JavaScript.',
                    isPrerequisite: false
                  },
                  {
                    title: 'Using the Console',
                    lessonId: 'console',
                    description: 'Learn more about using the console for debugging and output.',
                    isPrerequisite: false
                  },
                  {
                    title: 'Introduction to Programming',
                    lessonId: 'intro-to-programming',
                    description: 'Basic programming concepts that apply to all languages.',
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
              name="javascript_intro_editor"
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

export default IntroToJavaScriptLesson; 