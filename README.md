# Code Runtime Visualizer

A web application with an in-browser code editor that sends code to an AI agent for runtime value analysis.

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