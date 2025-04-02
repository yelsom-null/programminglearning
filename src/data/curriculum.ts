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
    id: 'task-manager-fundamentals',
    title: 'Task Manager Fundamentals',
    order: 2,
    description: 'Learn to build a simple task management application starting with the basics',
    status: 'available',
    lessons: [
      {
        id: 'variables-intro',
        title: 'Task Variables',
        description: 'Define variables to represent tasks and their properties',
        order: 1,
        status: 'available',
        route: '/lesson/variables-intro'
      },
      {
        id: 'basic-operations',
        title: 'Task Operations',
        description: 'Perform calculations on task data to gain insights',
        order: 2,
        status: 'available',
        route: '/lesson/basic-operations'
      }
    ]
  },
  {
    id: 'advanced-task-management',
    title: 'Advanced Task Management',
    order: 3,
    description: 'Build more complex task management features using functions and classes',
    status: 'available',
    lessons: [
      {
        id: 'boot-dev-style',
        title: 'Task Functions',
        description: 'Create functions to manage task operations',
        order: 1,
        status: 'available',
        route: '/lesson/boot-dev-style'
      },
      {
        id: 'boot-dev-variables',
        title: 'Complete Task System',
        description: 'Build a complete task management system with classes',
        order: 2,
        status: 'available',
        route: '/lesson/boot-dev-variables'
      }
    ]
  },
  {
    id: 'javascript-variables',
    title: 'JavaScript Variables',
    order: 4,
    description: 'Learn the basic syntax of JavaScript and how to declare variables',
    status: 'available',
    lessons: [
      {
        id: 'basic-types',
        title: 'Basic Types',
        description: 'Learn about JavaScript\'s primitive data types',
        order: 1,
        status: 'available',
        route: '/lesson/basic-types'
      },
      {
        id: 'let-and-const',
        title: 'let and const',
        description: 'Understand variable declarations in modern JavaScript',
        order: 2,
        status: 'available',
        route: '/lesson/let-and-const'
      },
      {
        id: 'why-javascript',
        title: 'Why JavaScript?',
        description: 'Explore the popularity and use cases of JavaScript',
        order: 3,
        status: 'available',
        route: '/lesson/why-javascript'
      },
      {
        id: 'comments',
        title: 'Comments',
        description: 'Learn how to add comments to your code',
        order: 4,
        status: 'available',
        route: '/lesson/comments'
      },
      {
        id: 'numbers-in-js',
        title: 'Numbers in JS',
        description: 'Working with numeric data in JavaScript',
        order: 5,
        status: 'available',
        route: '/lesson/numbers-in-js'
      },
      {
        id: 'numbers-review',
        title: 'Numbers Review',
        description: 'Practice and review of number operations',
        order: 6,
        status: 'available',
        route: '/lesson/numbers-review'
      },
      {
        id: 'increment-decrement',
        title: 'Increment and Decrement',
        description: 'Learn about the ++ and -- operators',
        order: 7,
        status: 'available',
        route: '/lesson/increment-decrement'
      }
    ]
  },
  {
    id: 'javascript-functions',
    title: 'Functions',
    order: 5,
    description: 'Learn about the different ways to create and execute functions in JavaScript',
    status: 'available',
    lessons: [
      {
        id: 'function-basics',
        title: 'Function Basics',
        description: 'Creating and calling JavaScript functions',
        order: 1,
        status: 'available',
        route: '/lesson/function-basics'
      },
      {
        id: 'function-parameters',
        title: 'Function Parameters',
        description: 'Working with function parameters and arguments',
        order: 2,
        status: 'available',
        route: '/lesson/function-parameters'
      },
      {
        id: 'return-values',
        title: 'Return Values',
        description: 'Understanding function return values',
        order: 3,
        status: 'available',
        route: '/lesson/return-values'
      }
    ]
  },
  {
    id: 'javascript-objects',
    title: 'Objects',
    order: 6,
    description: 'Objects are one of the most-used JS structures, learn to master them',
    status: 'coming-soon',
    lessons: [
      {
        id: 'object-basics',
        title: 'Object Basics',
        description: 'Creating and accessing object properties',
        order: 1,
        status: 'coming-soon',
        route: '/lesson/object-basics'
      },
      {
        id: 'object-methods',
        title: 'Object Methods',
        description: 'Adding functions to objects',
        order: 2,
        status: 'coming-soon',
        route: '/lesson/object-methods'
      }
    ]
  },
  {
    id: 'javascript-classes',
    title: 'Classes',
    order: 7,
    description: 'Learn about classes in JavaScript and how they differ from POJOs and the classes in other languages',
    status: 'coming-soon',
    lessons: [
      {
        id: 'class-basics',
        title: 'Class Basics',
        description: 'Creating classes in JavaScript',
        order: 1,
        status: 'coming-soon',
        route: '/lesson/class-basics'
      }
    ]
  }
];

export default curriculum; 