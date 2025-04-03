export interface Lesson {
  id: string;
  title: string;
  description: string;
  order: number;
  status: 'available' | 'in-progress' | 'coming-soon';
  route: string;
}

export interface Chapter {
  id: string;
  title: string;
  order: number;
  description: string;
  lessons: Lesson[];
  status: 'available' | 'in-progress' | 'coming-soon';
}

const curriculum: Chapter[] = [
  {
    id: 'task-manager-demo',
    title: 'Task Manager Project',
    order: 1,
    description: 'Interactive showcase of the task management application you will build',
    status: 'available',
    lessons: [
      {
        id: 'task-manager-demo',
        title: 'Project Overview',
        description: 'Preview the complete task manager app and understand what you will be building',
        order: 1,
        status: 'available',
        route: '/lesson/task-manager-demo'
      }
    ]
  },
  {
    id: 'chapter-1',
    title: 'Chapter 1: JavaScript Fundamentals',
    order: 2,
    description: 'Master the basics of JavaScript variables and task management',
    status: 'available',
    lessons: [
      {
        id: 'variables-intro',
        title: 'Lesson 1: Building with Variables',
        description: 'Define variables to represent tasks and their properties',
        order: 1,
        status: 'available',
        route: '/lesson/variables-intro'
      },
      {
        id: 'console',
        title: 'Lesson 2: Console Logging Task Variables',
        description: 'Learn to output task information to the console',
        order: 2,
        status: 'available',
        route: '/lesson/console'
      },
      {
        id: 'string-concatenation',
        title: 'Lesson 3: String Concatenation for Task Summaries',
        description: 'Combine strings to create readable task summaries',
        order: 3,
        status: 'available',
        route: '/lesson/string-concatenation'
      },
      {
        id: 'numbers-in-js',
        title: 'Lesson 4: Numbers in JS',
        description: 'Working with numeric data in JavaScript tasks',
        order: 4,
        status: 'available',
        route: '/lesson/numbers-in-js'
      },
      {
        id: 'increment-decrement',
        title: 'Lesson 5: Increment and Decrement',
        description: 'Learn about the ++ and -- operators for task counters',
        order: 5,
        status: 'available',
        route: '/lesson/increment-decrement'
      },
      {
        id: 'undefined-undeclared',
        title: 'Lesson 6: Undefined and Undeclared',
        description: 'Understanding variable scope and declaration in task management',
        order: 6,
        status: 'available',
        route: '/lesson/undefined-undeclared'
      },
      {
        id: 'null-undefined',
        title: 'Lesson 7: Null and Undefined',
        description: 'Working with missing or empty task values',
        order: 7,
        status: 'available',
        route: '/lesson/null-undefined'
      }
    ]
  },
  {
    id: 'chapter-2',
    title: 'Chapter 2: Task Operations',
    order: 3,
    description: 'Learn to manipulate and analyze task data',
    status: 'available',
    lessons: [
      {
        id: 'basic-operations',
        title: 'Lesson 1: Basic Task Operations',
        description: 'Perform calculations on task data to gain insights',
        order: 1,
        status: 'available',
        route: '/lesson/basic-operations'
      },
      {
        id: 'comparison-operators',
        title: 'Lesson 2: Comparing Tasks',
        description: 'Use comparison operators to prioritize tasks',
        order: 2,
        status: 'available',
        route: '/lesson/comparison-operators'
      },
      {
        id: 'logical-operators',
        title: 'Lesson 3: Task Filtering',
        description: 'Apply logical operators to filter and sort tasks',
        order: 3,
        status: 'available',
        route: '/lesson/logical-operators'
      }
    ]
  },
  {
    id: 'chapter-3',
    title: 'Chapter 3: Task Functions',
    order: 4,
    description: 'Create reusable functions for task management',
    status: 'available',
    lessons: [
      {
        id: 'function-basics',
        title: 'Lesson 1: Function Basics',
        description: 'Create functions to manage task operations',
        order: 1,
        status: 'available',
        route: '/lesson/function-basics'
      },
      {
        id: 'function-parameters',
        title: 'Lesson 2: Function Parameters',
        description: 'Pass task data to functions with parameters',
        order: 2,
        status: 'available',
        route: '/lesson/function-parameters'
      },
      {
        id: 'return-values',
        title: 'Lesson 3: Return Values',
        description: 'Get results back from task functions',
        order: 3,
        status: 'available',
        route: '/lesson/return-values'
      }
    ]
  },
  {
    id: 'chapter-4',
    title: 'Chapter 4: Complete Task System',
    order: 5,
    description: 'Build a complete task management system with objects and classes',
    status: 'available',
    lessons: [
      {
        id: 'object-basics',
        title: 'Lesson 1: Task Objects',
        description: 'Create objects to represent individual tasks',
        order: 1,
        status: 'available',
        route: '/lesson/object-basics'
      },
      {
        id: 'object-methods',
        title: 'Lesson 2: Task Methods',
        description: 'Add functions to task objects for common operations',
        order: 2,
        status: 'available',
        route: '/lesson/object-methods'
      },
      {
        id: 'class-basics',
        title: 'Lesson 3: Task Classes',
        description: 'Build a Task class for consistent task creation',
        order: 3,
        status: 'available',
        route: '/lesson/class-basics'
      },
      {
        id: 'task-manager-class',
        title: 'Lesson 4: TaskManager Class',
        description: 'Create a class to manage multiple tasks',
        order: 4,
        status: 'available',
        route: '/lesson/task-manager-class'
      }
    ]
  }
];

export default curriculum; 