# JavaScript Learning Platform

This platform provides interactive lessons for learning JavaScript, focusing on task management examples.

## TeachingConcept Component Implementation Guide

The platform uses a standardized `TeachingConcept` component for presenting educational content across all lessons. This component creates a consistent learning experience with structured content blocks.

### Already Updated Lessons
- NumbersLesson.tsx
- ConsoleLesson.tsx
- StringConcatenationLesson.tsx
- VariablesLesson.tsx

### Remaining Lessons to Update
- NullUndefinedLesson.tsx (requires conversion from Bootstrap to Material UI)
- UndefinedLesson.tsx (requires conversion from Bootstrap to Material UI)
- IncrementDecrementLesson.tsx
- BootDevStyleLesson.tsx
- BootDevVariablesLesson.tsx 
- BasicOperationsLesson.tsx
- TaskManagerDemoLesson.tsx

### TeachingConcept Implementation Steps

1. Import the component:
```tsx
import TeachingConcept from '../components/TeachingConcept';
```

2. Replace traditional content with structured concepts:
```tsx
<TeachingConcept
  title="Concept Title"
  subtitle="Optional subtitle explaining the concept"
  conceptNumber={1} // Sequential numbering
  blocks={[
    {
      type: 'text',
      content: 'Explanatory text for the concept'
    },
    {
      type: 'code',
      caption: 'Optional caption for code',
      content: `// Your code example here
const example = "This is code";
console.log(example);`
    },
    {
      type: 'note',
      caption: 'Note Title',
      content: 'Important information the student should know'
    },
    {
      type: 'warning',
      caption: 'Warning Title',
      content: 'Highlighting common pitfalls or issues'
    },
    {
      type: 'tip',
      caption: 'Tip Title',
      content: 'Helpful advice or best practices'
    },
    {
      type: 'exercise',
      caption: 'Exercise Title',
      content: 'Practice activity for the student'
    }
  ]}
/>
```

3. Follow consistent patterns:
   - Use 3-5 concepts per lesson
   - Start with introductory concepts
   - End with practical applications
   - Include at least one exercise or tip
   - Use warning blocks to highlight common errors

### Styling Standards

The TeachingConcept component handles all styling internally, providing:
- Consistent typography
- Proper spacing
- Visual hierarchy
- Responsive design for all screen sizes
- Code formatting with syntax highlighting
- Dark/light mode support

## Curriculum Structure

The platform features a structured curriculum with the following chapters:
1. JavaScript Fundamentals
   - Variables, Numbers, Strings, etc.
2. Operations and Logic
   - Operators, Conditionals, Loops
3. Advanced Concepts
   - Functions, Arrays, Objects

## Development

To add new lessons, follow the TeachingConcept pattern and add your lesson to the curriculum data structure.

## Features

- Monaco code editor (same as VS Code)
- JavaScript code execution
- Runtime value analysis (currently logged to console)
- Simple static code analysis

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to the displayed URL (default: http://localhost:3000)

## How to Use

1. Write JavaScript code in the editor
2. Click "Execute Code" to analyze the code
3. Check the browser console (F12) to see the runtime values

## Future Improvements

- Display runtime values in the UI instead of the console
- Connect to a real AI agent for more advanced analysis
- Add support for more programming languages
- Implement proper code sandboxing for security 