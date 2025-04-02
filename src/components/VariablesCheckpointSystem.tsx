import React, { useState, useEffect } from 'react';
import '../styles/CheckpointSystem.css';

export interface Module {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  quiz: Quiz;
}

export interface Quiz {
  questions: Question[];
  passingScore: number;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface VariablesCheckpointSystemProps {
  onModuleChange: (moduleId: number) => void;
  currentModuleId: number;
  darkMode?: boolean;
}

const VariablesCheckpointSystem: React.FC<VariablesCheckpointSystemProps> = ({
  onModuleChange,
  currentModuleId,
  darkMode = false
}) => {
  // Define the modules for variables learning
  const [modules, setModules] = useState<Module[]>([
    {
      id: 1,
      title: "Variable Basics",
      description: "What are variables and how to use them for task management",
      completed: false,
      quiz: {
        questions: [
          {
            id: 1,
            text: "Which keyword is used to declare a variable that can be reassigned?",
            options: ["const", "let", "var", "static"],
            correctAnswer: 1
          },
          {
            id: 2,
            text: "What would be a good variable name for storing whether a task is complete?",
            options: ["task", "complete", "isCompleted", "status"],
            correctAnswer: 2
          },
          {
            id: 3,
            text: "What is the correct way to assign a value to an existing variable?",
            options: [
              "let taskName = 'Review code';", 
              "taskName = 'Review code';", 
              "const taskName = 'Review code';", 
              "var = taskName 'Review code';"
            ],
            correctAnswer: 1
          },
          {
            id: 4,
            text: "What happens if you try to change a variable declared with 'const'?",
            options: [
              "It will work fine", 
              "It will give a warning", 
              "It will throw an error", 
              "It will automatically convert to 'let'"
            ],
            correctAnswer: 2
          },
          {
            id: 5,
            text: "Which statement correctly creates a variable for a task's name?",
            options: [
              "variable taskName = 'Complete project';", 
              "let taskName = 'Complete project';", 
              "taskName = 'Complete project';", 
              "string taskName = 'Complete project';"
            ],
            correctAnswer: 1
          }
        ],
        passingScore: 80
      }
    },
    {
      id: 2,
      title: "Variable Types for Tasks",
      description: "Using different variable types to represent task properties",
      completed: false,
      quiz: {
        questions: [
          {
            id: 1,
            text: "Which variable type would be best for storing a task's priority level (1-5)?",
            options: ["String", "Boolean", "Number", "Date"],
            correctAnswer: 2
          },
          {
            id: 2,
            text: "How would you represent whether a task is completed or not?",
            options: [
              "let isCompleted = true;", 
              "let isCompleted = 'yes';", 
              "let isCompleted = 1;", 
              "let isCompleted = 'completed';"
            ],
            correctAnswer: 0
          },
          {
            id: 3,
            text: "What type of variable would 'let dueDate = \"2023-06-30\";' be?",
            options: ["Number", "Boolean", "Date", "String"],
            correctAnswer: 3
          },
          {
            id: 4,
            text: "Which is the correct way to create a number variable for task progress (0-100%)?",
            options: [
              "let progress = '75';", 
              "let progress = 75;", 
              "let progress = '75%';", 
              "let progress = true;"
            ],
            correctAnswer: 1
          },
          {
            id: 5,
            text: "What happens when you try: let taskName = 'Project ' + 123;",
            options: [
              "Error: can't mix types", 
              "It creates 'Project 123'", 
              "It creates 'Project'", 
              "It creates the number 123"
            ],
            correctAnswer: 1
          }
        ],
        passingScore: 80
      }
    },
    {
      id: 3,
      title: "Variable Manipulation",
      description: "Changing variables and combining them to track task updates",
      completed: false,
      quiz: {
        questions: [
          {
            id: 1,
            text: "How would you increase a task's progress by 10%?",
            options: [
              "progress = progress + 10;", 
              "progress += 10;", 
              "progress = 10;", 
              "Both A and B are correct"
            ],
            correctAnswer: 3
          },
          {
            id: 2,
            text: "What does this code output: let task = 'Report'; console.log('Task: ' + task);",
            options: ["'Task: '", "'Report'", "'Task: Report'", "Error"],
            correctAnswer: 2
          },
          {
            id: 3,
            text: "How do you convert the string '42' to a number?",
            options: [
              "Number('42')", 
              "parseInt('42')", 
              "'42'.toNumber()", 
              "Both A and B are correct"
            ],
            correctAnswer: 3
          },
          {
            id: 4,
            text: "What's the result of: let progress = 75; let status = 'Progress: ' + progress + '%';",
            options: [
              "'Progress: 75%'", 
              "Error", 
              "'Progress: ' + 75 + '%'", 
              "undefined"
            ],
            correctAnswer: 0
          },
          {
            id: 5,
            text: "How would you change a task from incomplete to complete?",
            options: [
              "isCompleted = complete;", 
              "isCompleted = 'true';", 
              "isCompleted = true;", 
              "isCompleted = 1;"
            ],
            correctAnswer: 2
          }
        ],
        passingScore: 80
      }
    },
    {
      id: 4,
      title: "Multiple Tasks",
      description: "Managing several tasks with proper variable organization",
      completed: false,
      quiz: {
        questions: [
          {
            id: 1,
            text: "What's a good way to name variables for multiple tasks?",
            options: [
              "task1, task2, task3", 
              "taskName1, taskName2, taskName3", 
              "tasks", 
              "t1, t2, t3"
            ],
            correctAnswer: 1
          },
          {
            id: 2,
            text: "How can you determine which task has higher priority?",
            options: [
              "Compare priority variables with > or <", 
              "You can't compare task priorities with variables", 
              "Use the 'moreImportant' function", 
              "Sort the tasks alphabetically"
            ],
            correctAnswer: 0
          },
          {
            id: 3,
            text: "If task1Progress is 75 and task2Progress is 50, what's the result of task1Progress > task2Progress?",
            options: ["false", "true", "Error", "undefined"],
            correctAnswer: 1
          },
          {
            id: 4,
            text: "Which naming approach is best for related task variables?",
            options: [
              "t1n, t1c, t1p (for name, completion, priority)", 
              "name1, completion1, priority1", 
              "task1Name, task1Completed, task1Priority", 
              "taskName, taskCompletion, taskPriority"
            ],
            correctAnswer: 2
          },
          {
            id: 5,
            text: "What's a good way to compare if two tasks have the same name?",
            options: [
              "task1Name = task2Name", 
              "task1Name == task2Name", 
              "task1Name === task2Name", 
              "task1Name.equals(task2Name)"
            ],
            correctAnswer: 2
          }
        ],
        passingScore: 80
      }
    }
  ]);

  // Track quiz state
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuizAnswers, setCurrentQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  
  // Reset quiz state when module changes
  useEffect(() => {
    setShowQuiz(false);
    setQuizSubmitted(false);
    setCurrentQuizAnswers([]);
  }, [currentModuleId]);
  
  // Get the active module
  const activeModule = modules.find(m => m.id === currentModuleId) || modules[0];
  
  // Check if the previous module is completed to enable the next one
  const isPreviousModuleCompleted = (moduleId: number) => {
    if (moduleId === 1) return true;
    return modules.find(m => m.id === moduleId - 1)?.completed === true;
  };
  
  // Handle answer selection in quiz
  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    if (quizSubmitted) return;
    
    const newAnswers = [...currentQuizAnswers];
    newAnswers[questionIndex] = answerIndex;
    setCurrentQuizAnswers(newAnswers);
  };
  
  // Calculate quiz score
  const calculateQuizScore = () => {
    const quiz = activeModule.quiz;
    let correctAnswers = 0;
    
    quiz.questions.forEach((question, index) => {
      if (currentQuizAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    return Math.round((correctAnswers / quiz.questions.length) * 100);
  };
  
  // Handle quiz submission
  const handleQuizSubmit = () => {
    const score = calculateQuizScore();
    setQuizScore(score);
    setQuizSubmitted(true);
    
    // Mark module as completed if passed
    if (score >= activeModule.quiz.passingScore) {
      const updatedModules = modules.map(module => 
        module.id === activeModule.id ? { ...module, completed: true } : module
      );
      setModules(updatedModules);
    }
  };
  
  // Move to the next module
  const goToNextModule = () => {
    const nextModuleId = currentModuleId + 1;
    if (nextModuleId <= modules.length) {
      onModuleChange(nextModuleId);
    }
  };
  
  // Start the checkpoint quiz
  const startQuiz = () => {
    setShowQuiz(true);
    setQuizSubmitted(false);
    setCurrentQuizAnswers([]);
  };
  
  return (
    <div className={`checkpoint-system ${darkMode ? 'dark' : 'light'}`}>
      <div className="module-progress-bar">
        {modules.map(module => (
          <div 
            key={module.id} 
            className={`module-indicator ${module.id === currentModuleId ? 'active' : ''} ${module.completed ? 'completed' : ''}`}
            onClick={() => isPreviousModuleCompleted(module.id) ? onModuleChange(module.id) : null}
            title={module.title}
          >
            {module.completed ? '✓' : module.id}
          </div>
        ))}
      </div>
      
      {!showQuiz ? (
        <div className="module-status">
          <h3>{activeModule.title}</h3>
          <p>{activeModule.description}</p>
          
          {activeModule.completed ? (
            <div className="module-completed">
              <span className="completion-badge">✓ Completed</span>
              {activeModule.id < modules.length && (
                <button className="next-module-btn" onClick={goToNextModule}>
                  Continue to {modules.find(m => m.id === activeModule.id + 1)?.title}
                </button>
              )}
            </div>
          ) : (
            <button className="start-quiz-btn" onClick={startQuiz}>
              Take Checkpoint Quiz
            </button>
          )}
        </div>
      ) : (
        <div className="quiz-container">
          <h3>Checkpoint: {activeModule.title}</h3>
          
          {!quizSubmitted ? (
            <>
              <div className="quiz-questions">
                {activeModule.quiz.questions.map((question, qIndex) => (
                  <div key={question.id} className="quiz-question">
                    <h4>Question {qIndex + 1}: {question.text}</h4>
                    <div className="answer-options">
                      {question.options.map((option, aIndex) => (
                        <div 
                          key={aIndex} 
                          className={`answer-option ${currentQuizAnswers[qIndex] === aIndex ? 'selected' : ''}`}
                          onClick={() => handleAnswerSelect(qIndex, aIndex)}
                        >
                          <span className="option-letter">{String.fromCharCode(65 + aIndex)}</span>
                          <span className="option-text">{option}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                className="submit-quiz-btn"
                onClick={handleQuizSubmit}
                disabled={currentQuizAnswers.length < activeModule.quiz.questions.length}
              >
                Submit Answers
              </button>
            </>
          ) : (
            <div className="quiz-results">
              <h4>Quiz Results</h4>
              <div className={`score-display ${quizScore >= activeModule.quiz.passingScore ? 'passing' : 'failing'}`}>
                <span className="score-value">{quizScore}%</span>
                <span className="score-label">
                  {quizScore >= activeModule.quiz.passingScore ? 'Passed!' : 'Try Again'}
                </span>
              </div>
              
              <div className="quiz-feedback">
                {quizScore >= activeModule.quiz.passingScore ? (
                  <p>Congratulations! You've demonstrated understanding of {activeModule.title}.</p>
                ) : (
                  <p>Review the material and try again to advance to the next module.</p>
                )}
              </div>
              
              <div className="question-results">
                {activeModule.quiz.questions.map((question, qIndex) => (
                  <div 
                    key={question.id} 
                    className={`question-result ${
                      currentQuizAnswers[qIndex] === question.correctAnswer ? 'correct' : 'incorrect'
                    }`}
                  >
                    <p>Question {qIndex + 1}: {
                      currentQuizAnswers[qIndex] === question.correctAnswer ? 
                      '✓ Correct' : 
                      '✗ Incorrect'
                    }</p>
                    {currentQuizAnswers[qIndex] !== question.correctAnswer && (
                      <p className="correct-answer">
                        Correct answer: {question.options[question.correctAnswer]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="quiz-actions">
                {quizScore >= activeModule.quiz.passingScore ? (
                  activeModule.id < modules.length ? (
                    <button className="next-module-btn" onClick={goToNextModule}>
                      Continue to {modules.find(m => m.id === activeModule.id + 1)?.title}
                    </button>
                  ) : (
                    <button className="back-to-module-btn" onClick={() => setShowQuiz(false)}>
                      Complete! Back to Module
                    </button>
                  )
                ) : (
                  <button className="retry-quiz-btn" onClick={() => {
                    setQuizSubmitted(false);
                    setCurrentQuizAnswers([]);
                  }}>
                    Try Again
                  </button>
                )}
                
                <button className="back-to-module-btn" onClick={() => setShowQuiz(false)}>
                  Back to Module
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VariablesCheckpointSystem; 