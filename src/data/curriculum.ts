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
    id: 'javascript-variables',
    title: 'Variables',
    order: 1,
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
    order: 2,
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
    order: 3,
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
    order: 4,
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