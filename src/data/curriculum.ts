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
        id: 'intro-to-programming',
        title: 'Lesson 1: Introduction to Programming',
        description: 'Learn the basics of programming and JavaScript',
        order: 1,
        status: 'available',
        route: '/lesson/intro-to-programming'
      },
      {
        id: 'intro-to-javascript',
        title: 'Lesson 2: Introduction to JavaScript',
        description: 'Learn what JavaScript is and how it\'s used in the real world',
        order: 2,
        status: 'available',
        route: '/lesson/intro-to-javascript'
      },
      {
        id: 'javascript-data-types',
        title: 'Lesson 3: JavaScript Data Types',
        description: 'Explore different types of data in JavaScript',
        order: 3,
        status: 'available',
        route: '/lesson/javascript-data-types'
      },
      {
        id: 'variables-intro',
        title: 'Lesson 4: Building with Variables',
        description: 'Define variables to represent tasks and their properties',
        order: 4,
        status: 'available',
        route: '/lesson/variables-intro'
      },
      {
        id: 'console',
        title: 'Lesson 5: Console Logging Task Variables',
        description: 'Learn to output task information to the console',
        order: 5,
        status: 'available',
        route: '/lesson/console'
      },
      {
        id: 'string-concatenation',
        title: 'Lesson 6: String Concatenation for Task Summaries',
        description: 'Combine strings to create readable task summaries',
        order: 6,
        status: 'available',
        route: '/lesson/string-concatenation'
      },
      {
        id: 'numbers-in-js',
        title: 'Lesson 7: Numbers in JS',
        description: 'Working with numeric data in JavaScript tasks',
        order: 7,
        status: 'available',
        route: '/lesson/numbers-in-js'
      },
      {
        id: 'increment-decrement',
        title: 'Lesson 8: Increment and Decrement',
        description: 'Learn about the ++ and -- operators for task counters',
        order: 8,
        status: 'available',
        route: '/lesson/increment-decrement'
      },
      {
        id: 'undefined-undeclared',
        title: 'Lesson 9: Undefined and Undeclared',
        description: 'Understanding variable scope and declaration in task management',
        order: 9,
        status: 'available',
        route: '/lesson/undefined-undeclared'
      },
      {
        id: 'null-undefined',
        title: 'Lesson 10: Null and Undefined',
        description: 'Working with missing or empty task values',
        order: 10,
        status: 'available',
        route: '/lesson/null-undefined'
      }
    ]
  },
];

export default curriculum; 