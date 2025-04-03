import React, { useState, useEffect } from 'react';
import CodeEditor from '../components/CodeEditor';
import { 
  evaluateCodeSafely, 
  evaluateCodeWithAI, 
  isStringifiedClassInstance,
  parseStringifiedClass 
} from '../utils/codeAnalysis';
import '../styles/LessonStyles.css';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { useParams, Link } from 'react-router-dom';
import curriculum from '../data/curriculum';
import { CardHeader, CardContent, Typography, Box } from '@mui/material';
import CodeBlock from '../components/CodeBlock';

interface StringConcatenationLessonProps {
  darkMode?: boolean;
}

const StringConcatenationLesson: React.FC<StringConcatenationLessonProps> = ({ 
  darkMode = false
}) => {
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
  const [executionPath, setExecutionPath] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
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
      case 'array': return 'danger';
      case 'object': return 'info';
      case 'class': return 'purple';
      case 'function': return 'secondary';
      default: return 'light';
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

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="lesson-container">
      <div className="lesson-header">
        <h1>Lesson 3: String Concatenation for Task Summaries</h1>
        <div className="lesson-meta">
          <div className="chapter-info">
            <span className="chapter-title">Chapter 1: Task Manager Fundamentals</span>
            <div className="lesson-navigation">
              {(() => {
                // Find current lesson in curriculum
                const currentLessonId = "string-concatenation";
                
                let prevLesson = null;
                let nextLesson = null;
                let currentChapter = null;
                let currentLessonIndex = -1;
                
                // Find current chapter and lesson
                for (const chapter of curriculum) {
                  const lessonIndex = chapter.lessons.findIndex(l => l.id === currentLessonId);
                  if (lessonIndex !== -1) {
                    currentChapter = chapter;
                    currentLessonIndex = lessonIndex;
                    
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
                
                return (
                  <>
                    {prevLesson ? (
                      <Link 
                        to={prevLesson.route}
                        className="chapter-nav-button"
                        title={`Previous: ${prevLesson.title}`}
                      >
                        ← Previous Lesson
                      </Link>
                    ) : (
                      <button 
                        className="chapter-nav-button" 
                        disabled={true}
                        title="This is the first lesson"
                      >
                        ← Previous Lesson
                      </button>
                    )}
                    
                    <span className="lesson-indicator">
                      {currentChapter && currentLessonIndex !== -1 
                        ? `Lesson ${currentLessonIndex + 1} of ${currentChapter.lessons.length}`
                        : "Lesson"}
                    </span>
                    
                    {nextLesson ? (
                      <Link 
                        to={nextLesson.route}
                        className="chapter-nav-button"
                        title={`Next: ${nextLesson.title}`}
                      >
                        Next Lesson →
                      </Link>
                    ) : (
                      <button 
                        className="chapter-nav-button" 
                        disabled={true}
                        title="This is the last lesson"
                      >
                        Next Lesson →
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      <div className="lesson-content">
        <div className="explanation-panel">
          <h2>String Concatenation for Task Summaries</h2>
          <p>
            In task management applications, we often need to create meaningful descriptions
            and summaries by combining text values. String concatenation allows us to join 
            different pieces of text (and other values) into a single string.
          </p>
          
          <ConceptCard title="String Concatenation with + Operator">
            <Typography variant="body1" gutterBottom>
              The simplest way to join strings in JavaScript is with the + operator:
            </Typography>
            <CodeBlock>
{`// Basic concatenation with the + operator
let firstName = "Maria";
let lastName = "Garcia";

// Creating a full name by concatenating strings
let fullName = firstName + " " + lastName;
console.log(fullName);  // "Maria Garcia"

// Building task descriptions
let taskVerb = "Debug";
let taskObject = "login form";
let taskDescription = taskVerb + " the " + taskObject;
console.log(taskDescription);  // "Debug the login form"

// Concatenating with numbers (numbers are converted to strings)
let taskId = 42;
let taskLog = "Task #" + taskId + ": " + taskDescription;
console.log(taskLog);  // "Task #42: Debug the login form"

// Using string concatenation for multi-part messages
let totalTasks = 10;
let completedTasks = 7;
let statusUpdate = "Completed " + completedTasks + " out of " + 
                  totalTasks + " tasks";
console.log(statusUpdate);  // "Completed 7 out of 10 tasks"`}
            </CodeBlock>
          </ConceptCard>
          
          <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Template Literals - The Modern Approach
          </Typography>
          
          <Typography variant="body1" paragraph>
            ES6 introduced template literals, which make string concatenation much cleaner
            using backticks (<Box component="code" sx={{ backgroundColor: 'rgba(0,0,0,0.05)', px: 0.5 }}>`</Box>) and <Box component="code" sx={{ backgroundColor: 'rgba(0,0,0,0.05)', px: 0.5 }}>${}</Box> for embedding expressions:
          </Typography>
          
          <Card className="concept-card mb-4">
            <Card.Header as="h4">Template Literals</Card.Header>
            <Card.Body>
              <p>Using template literals for more readable string creation:</p>
              
<p>`// Template literals use backticks (\`) and \${} for variables
let projectName = "Task Manager";
let version = 2.1;

// Embedding variables directly in strings
console.log(appInfo);  // "Task Manager v2.1"

// Multi-line strings without concatenation
let taskDetails = \`
Task: Implement login feature
Priority: High
Due date: Next week
Assigned to: Alex
\`;
console.log(taskDetails);

// Embedding expressions in template literals
let totalTasks = 10;
let completedTasks = 7;
let progress = (completedTasks / totalTasks) * 100;

console.log(progressReport);  // "Project progress: 70% (7/10 tasks)"

// Embedding complex expressions
let timePerTask = 1.5;  // hours
let remainingTasks = totalTasks - completedTasks;
console.log(timeEstimate);  // "Estimated time remaining: 4.5 hours"` </p>
             
            </Card.Body>
          </Card>
          
          <h3>Choosing the Right Approach</h3>
          <p>
            Both approaches have their place in modern JavaScript:
          </p>
          <ul>
            <li><strong>Use + operator</strong> when working with legacy systems or for very simple concatenation</li>
            <li><strong>Use template literals</strong> for more complex strings, especially those with multiple variables or multiline text</li>
          </ul>
          
          <h3>Real-World Task Management Applications</h3>
          <p>
            String concatenation and template literals are essential for creating:
          </p>
          <ul>
            <li>Task summaries and details</li>
            <li>Progress reports</li>
            <li>User notifications</li>
            <li>Formatted dates and times</li>
            <li>Status messages</li>
          </ul>
          
          <p>
            Try experimenting with the code editor to create your own task summaries and reports!
          </p>
        </div>

        <div className="interactive-panel">
          <div className="code-editor-container">
            <CodeEditor
              value={code}
              onChange={handleCodeChange}
              darkMode={darkMode}
            />
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
          </div>

          <div className="visualization-panel">
            <h3>Variable Values</h3>
            <div className="visualization-scroll-container">
              <div className="memory-containers">
                {Object.keys(runtimeValues).length === 0 ? (
                  <div className="empty-state">
                    No variables created yet.
                  </div>
                ) : (
                  <Row xs={1} className="g-3 justify-content-center display-flow">
                    {Object.entries(runtimeValues).map(([name, value]) => {
                      const type = getValueType(value);
                      return (
                        <Col key={name} className="">
                          <Card className={`variable-card type-${type}`}>
                            <Card.Header className="variable-name d-flex justify-content-between align-items-center">
                              {name}
                              {value?.aiDescription && (
                                <Badge bg="info" pill title={value.aiDescription}>
                                  <i className="bi bi-magic"></i> AI
                                </Badge>
                              )}
                            </Card.Header>
                            <Card.Body>
                              <Card.Title>{getTypeExplanation(type)}</Card.Title>
                              <Card.Text className="variable-value">{formatValue(value)}</Card.Text>
                              
                              <div className="variable-type-container mt-2">
                                <span className={`variable-type-badge bg-${getTypeColor(type)}`}>
                                  {getTypeExplanation(type)}
                                </span>
                              </div>
                              
                              {value?.aiDescription && (
                                <div className="ai-explanation mt-2">
                                  <small className="text-muted">{value.aiDescription}</small>
                                </div>
                              )}
                            </Card.Body>
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>
                )}
              </div>

              {consoleOutput.length > 0 && (
                <div className="console-output">
                  <h3>Console Output</h3>
                  {consoleOutput.map((output, index) => (
                    <div key={index} className="console-line">
                      {formatValue(output)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StringConcatenationLesson; 