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
import { useParams, Link } from 'react-router-dom';
import curriculum from '../data/curriculum';

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
          
          <h3>Basic String Concatenation with + Operator</h3>
          <p>
            JavaScript allows you to combine strings using the <code>+</code> operator:
          </p>
          
          <div className="code-example">
{`// Basic concatenation with +
let taskName = "Complete project";
let dueDate = "2023-12-31";
let taskSummary = "Task: " + taskName + " (Due: " + dueDate + ")";

console.log(taskSummary); // "Task: Complete project (Due: 2023-12-31)"

// Adding numbers to strings
let progress = 75;
let progressMessage = "Current progress: " + progress + "%";
console.log(progressMessage); // "Current progress: 75%"`}
          </div>
          
          <p>
            When you use the <code>+</code> operator with a string and another type,
            JavaScript automatically converts the other value to a string. This is called
            <i>type coercion</i>.
          </p>
          
          <h3>Template Literals - The Modern Approach</h3>
          <p>
            ES6 introduced template literals, which make string concatenation much cleaner
            using backticks (<code>`</code>) and <code>${}</code> for embedding expressions:
          </p>
          
          <div className="code-example">
{`// Template literals with backticks
let taskName = "Complete project";
let dueDate = "2023-12-31";
let progress = 75;

// Simple template literal
let taskSummary = \`Task: \${taskName} (Due: \${dueDate})\`;
console.log(taskSummary); // "Task: Complete project (Due: 2023-12-31)"

// Template literals with expressions
let remaining = 100 - progress;
let statusReport = \`The task "\${taskName}" is \${progress}% complete with \${remaining}% remaining.\`;
console.log(statusReport);
// "The task "Complete project" is 75% complete with 25% remaining."

// Multiline template literals - great for reports
let taskReport = \`
Task: \${taskName}
Progress: \${progress}%
Due Date: \${dueDate}
\`;
console.log(taskReport);
// Neatly formatted on multiple lines`}
          </div>
          
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