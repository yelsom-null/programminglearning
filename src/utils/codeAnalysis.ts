/**
 * Safely evaluates JavaScript code in a sandboxed environment
 * and captures console.log outputs and variable values
 */
export function evaluateCodeSafely(code: string): Record<string, any> {
  const runtimeValues: Record<string, any> = {};
  
  try {
    // Extract variable names from code for tracking
    const variableNames = extractVariableNames(code);
    
    // Extract potential class declarations to help with type identification
    const classDeclarations = extractClassDeclarations(code);
    
    // This is still not completely safe for production use
    // A proper sandbox should be implemented for real applications
    const sandboxedCode = new Function(`
      const capturedValues = {};
      const originalConsoleLog = console.log;
      
      // Override console.log
      console.log = function(...args) {
        originalConsoleLog.apply(console, args);
        if (!capturedValues.consoleOutput) {
          capturedValues.consoleOutput = [];
        }
        capturedValues.consoleOutput.push(args);
      };
      
      try {
        ${code}
        
        // Capture final values of variables
        capturedValues.variables = {};
        
        // Try to evaluate each variable in the current scope
        ${variableNames.map(name => `
          try { 
            if (typeof ${name} !== 'undefined') {
              // Store the basic value
              capturedValues.variables['${name}'] = ${name};
              
              // Enhance with type metadata
              if (typeof ${name} === 'object' && ${name} !== null) {
                // Attempt to get constructor name for better type identification
                const constructorName = Object.getPrototypeOf(${name}).constructor.name;
                if (constructorName && constructorName !== 'Object' && constructorName !== 'Array') {
                  capturedValues.variables['${name}'].__constructorName = constructorName;
                  capturedValues.variables['${name}'].__isClass = true;
                }
              }
            }
          } catch(e) { /* Variable not in scope */ }
        `).join('\n')}
        
      } catch (error) {
        capturedValues.error = error.message;
      }
      
      return capturedValues;
    `);
    
    const result = sandboxedCode();
    Object.assign(runtimeValues, result);

    // Post-process to improve class identification
    if (runtimeValues.variables) {
      const variables = runtimeValues.variables as Record<string, any>;
      
      // Enhance type information for variables based on class declarations
      Object.entries(variables).forEach(([name, value]) => {
        if (typeof value === 'object' && value !== null) {
          // Check if it might be a class instance without explicit constructor info
          if (!value.__isClass && !Array.isArray(value)) {
            // Check against extracted class names
            if (classDeclarations.some(c => 
              // Check if this variable was created using a 'new ClassName()' syntax
              code.includes(`${name} = new ${c}`) || 
              code.includes(`const ${name} = new ${c}`) || 
              code.includes(`let ${name} = new ${c}`) || 
              code.includes(`var ${name} = new ${c}`)
            )) {
              variables[name].__isClass = true;
              variables[name].__constructorName = classDeclarations.find(c => 
                code.includes(`${name} = new ${c}`) ||
                code.includes(`const ${name} = new ${c}`) ||
                code.includes(`let ${name} = new ${c}`) ||
                code.includes(`var ${name} = new ${c}`)
              );
            }
          }
        }
      });
    }
    
  } catch (error) {
    console.error('Error evaluating code:', error);
    runtimeValues.error = error instanceof Error ? error.message : 'Unknown error';
  }
  
  return runtimeValues;
}

export interface ScopeInfo {
  type: 'global' | 'function' | 'class' | 'block';
  name?: string;
  start: number;
  end: number;
  parent?: number;
  variables: string[];
}

export interface ScopeAnalysisResult {
  scopes: ScopeInfo[];
  variablesToScopes: Record<string, number[]>;
}

/**
 * Analyzes code to identify scopes and their variables
 */
export function analyzeScopesInCode(code: string): ScopeAnalysisResult {
  const scopes: ScopeInfo[] = [];
  const variablesToScopes: Record<string, number[]> = {};

  // Add the global scope as the first scope
  scopes.push({
    type: 'global',
    start: 0,
    end: code.length,
    variables: []
  });

  // Helper to add a variable to a scope
  const addVariableToScope = (variable: string, scopeIndex: number) => {
    if (!scopes[scopeIndex].variables.includes(variable)) {
      scopes[scopeIndex].variables.push(variable);
    }
    
    if (!variablesToScopes[variable]) {
      variablesToScopes[variable] = [];
    }
    if (!variablesToScopes[variable].includes(scopeIndex)) {
      variablesToScopes[variable].push(scopeIndex);
    }
  };

  try {
    // Find all function declarations and expressions
    const functionRegex = /function\s+(\w+)?\s*\([^)]*\)\s*{/g;
    let match;
    
    while ((match = functionRegex.exec(code)) !== null) {
      const funcName = match[1] || 'anonymous';
      const startPos = match.index;
      
      // Find the matching closing brace
      let openBraces = 1;
      let endPos = startPos + match[0].length;
      
      for (let i = endPos; i < code.length; i++) {
        if (code[i] === '{') openBraces++;
        else if (code[i] === '}') openBraces--;
        
        if (openBraces === 0) {
          endPos = i + 1;
          break;
        }
      }
      
      const scopeIndex = scopes.length;
      scopes.push({
        type: 'function',
        name: funcName,
        start: startPos,
        end: endPos,
        parent: 0, // Assume global parent for simplicity
        variables: []
      });
      
      // If it's a named function, add it to the parent scope
      if (match[1]) {
        addVariableToScope(match[1], 0);
      }
      
      // Find variables declared in this function
      const funcBody = code.substring(startPos, endPos);
      const varDeclarations = funcBody.match(/(?:let|const|var)\s+(\w+)\s*(?:=|;)/g) || [];
      
      varDeclarations.forEach(decl => {
        const varName = decl.replace(/(?:let|const|var)\s+/, '').replace(/[=;]/g, '').trim();
        addVariableToScope(varName, scopeIndex);
      });
      
      // Find function parameters
      const paramsMatch = match[0].match(/\(([^)]*)\)/);
      if (paramsMatch && paramsMatch[1]) {
        const params = paramsMatch[1].split(',').map(p => p.trim()).filter(p => p);
        params.forEach(param => {
          addVariableToScope(param, scopeIndex);
        });
      }
    }
    
    // Find class declarations
    const classRegex = /class\s+(\w+)\s*{/g;
    while ((match = classRegex.exec(code)) !== null) {
      const className = match[1];
      const startPos = match.index;
      
      // Find the matching closing brace
      let openBraces = 1;
      let endPos = startPos + match[0].length;
      
      for (let i = endPos; i < code.length; i++) {
        if (code[i] === '{') openBraces++;
        else if (code[i] === '}') openBraces--;
        
        if (openBraces === 0) {
          endPos = i + 1;
          break;
        }
      }
      
      const scopeIndex = scopes.length;
      scopes.push({
        type: 'class',
        name: className,
        start: startPos,
        end: endPos,
        parent: 0, // Assume global parent for simplicity
        variables: []
      });
      
      // Add class name to global scope
      addVariableToScope(className, 0);
      
      // Find class methods and properties
      const classBody = code.substring(startPos, endPos);
      
      // Find methods
      const methodRegex = /(\w+)\s*\([^)]*\)\s*{/g;
      let methodMatch;
      while ((methodMatch = methodRegex.exec(classBody)) !== null) {
        addVariableToScope(methodMatch[1], scopeIndex);
      }
      
      // Find class properties
      const propRegex = /this\.(\w+)\s*=/g;
      let propMatch;
      while ((propMatch = propRegex.exec(classBody)) !== null) {
        addVariableToScope(propMatch[1], scopeIndex);
      }
    }
    
    // Find block scopes (if, for, while, etc.)
    const blockRegex = /(?:if|for|while|switch)\s*\([^)]*\)\s*{/g;
    while ((match = blockRegex.exec(code)) !== null) {
      const blockType = match[0].match(/^(\w+)/)?.[0] || 'block';
      const startPos = match.index;
      
      // Find the matching closing brace
      let openBraces = 1;
      let endPos = startPos + match[0].length;
      
      for (let i = endPos; i < code.length; i++) {
        if (code[i] === '{') openBraces++;
        else if (code[i] === '}') openBraces--;
        
        if (openBraces === 0) {
          endPos = i + 1;
          break;
        }
      }
      
      const scopeIndex = scopes.length;
      scopes.push({
        type: 'block',
        name: blockType,
        start: startPos,
        end: endPos,
        parent: 0, // Assume global parent for simplicity
        variables: []
      });
      
      // Find variables declared in this block
      const blockBody = code.substring(startPos, endPos);
      const varDeclarations = blockBody.match(/(?:let|const)\s+(\w+)\s*(?:=|;)/g) || [];
      
      varDeclarations.forEach(decl => {
        const varName = decl.replace(/(?:let|const)\s+/, '').replace(/[=;]/g, '').trim();
        addVariableToScope(varName, scopeIndex);
      });
    }
    
    // Find global variable declarations
    const globalVarRegex = /^(?:let|const|var)\s+(\w+)\s*(?:=|;)/gm;
    while ((match = globalVarRegex.exec(code)) !== null) {
      const varName = match[1];
      
      // Skip if this position is inside a non-global scope
      let insideNonGlobalScope = false;
      for (let i = 1; i < scopes.length; i++) { // Skip index 0 (global scope)
        if (match.index >= scopes[i].start && match.index < scopes[i].end) {
          insideNonGlobalScope = true;
          break;
        }
      }
      
      if (!insideNonGlobalScope) {
        addVariableToScope(varName, 0);
      }
    }
    
  } catch (error) {
    console.error('Error analyzing scopes:', error);
  }
  
  return { scopes, variablesToScopes };
}

/**
 * Extract class declarations from code
 */
function extractClassDeclarations(code: string): string[] {
  const classNames = new Set<string>();
  
  // Extract class declarations (ES6 style)
  const classMatches = code.match(/class\s+(\w+)/g) || [];
  classMatches.forEach(match => {
    const className = match.replace('class', '').trim();
    classNames.add(className);
  });
  
  // Extract constructor functions that might be used as classes (ES5 style)
  const constructorMatches = code.match(/function\s+(\w+)\s*\([^)]*\)\s*{[\s\S]*?this\./g) || [];
  constructorMatches.forEach(match => {
    const funcName = match.replace(/function\s+/, '').split('(')[0].trim();
    if (/^[A-Z]/.test(funcName)) { // Convention: class names start with uppercase
      classNames.add(funcName);
    }
  });
  
  return Array.from(classNames);
}

/**
 * Extract all potential variable names from code
 */
function extractVariableNames(code: string): string[] {
  const variableNames = new Set<string>();
  
  // Extract variable declarations
  const varMatches = code.match(/(?:let|const|var)\s+(\w+)\s*=/g) || [];
  varMatches.forEach(match => {
    const varName = match.replace(/(?:let|const|var)\s+/, '').replace('=', '').trim();
    variableNames.add(varName);
  });
  
  // Extract function declarations
  const funcMatches = code.match(/function\s+(\w+)\s*\(/g) || [];
  funcMatches.forEach(match => {
    const funcName = match.replace(/function\s+/, '').replace('(', '').trim();
    variableNames.add(funcName);
  });
  
  // Extract assignment to variables
  const assignmentMatches = code.match(/(\w+)\s*=\s*[^=]/g) || [];
  assignmentMatches.forEach(match => {
    const varName = match.split('=')[0].trim();
    if (varName && !varName.match(/^(if|while|for)$/)) {
      variableNames.add(varName);
    }
  });
  
  return Array.from(variableNames);
}

/**
 * Simple static analysis to extract variable declarations
 */
export function extractVariableDeclarations(code: string): Record<string, string> {
  const variables: Record<string, string> = {};
  
  try {
    // Extract variable declarations
    const varMatches = code.match(/(?:let|const|var)\s+(\w+)\s*=\s*([^;]+)/g) || [];
    
    varMatches.forEach(match => {
      const parts = match.split('=');
      if (parts.length >= 2) {
        const varName = parts[0].replace(/(let|const|var)/, '').trim();
        const varValue = parts[1].trim();
        variables[varName] = varValue;
      }
    });
    
    // Extract function declarations
    const funcMatches = code.match(/function\s+(\w+)\s*\([^)]*\)/g) || [];
    
    funcMatches.forEach(match => {
      const funcName = match.replace(/function\s+/, '').split('(')[0].trim();
      variables[funcName] = 'function';
    });
    
  } catch (error) {
    console.error('Error in static analysis:', error);
  }
  
  return variables;
}

export async function evaluateCodeWithAI(code: string): Promise<Record<string, any>> {
  try {
    // Check if the aiService module is available
    let aiService;
    try {
      aiService = await import('../services/aiService');
    } catch (error) {
      console.warn('AI service not available, falling back to standard evaluation:', error);
      return evaluateCodeSafely(code);
    }

    // First try to analyze with AI
    const aiAnalysis = await aiService.analyzeCodeComprehensively(code);
    
    // If we got valid results from AI, use them
    if (aiAnalysis && aiAnalysis.runtimeValues && Object.keys(aiAnalysis.runtimeValues).length > 0) {
      return {
        variables: aiAnalysis.runtimeValues,
        consoleOutput: aiAnalysis.executionFlow || [],
        error: aiAnalysis.errors?.join('\n'),
        aiEnhanced: true,
        scopeInfo: aiAnalysis.scopes
      };
    } else {
      // Otherwise, fall back to standard evaluation
      console.info('AI analysis returned incomplete results, falling back to standard evaluation');
      const standardResults = evaluateCodeSafely(code);
      return {
        ...standardResults,
        aiEnhanced: false
      };
    }
  } catch (error) {
    console.error('Error in AI code evaluation:', error);
    // Fall back to standard evaluation on any error
    const standardResults = evaluateCodeSafely(code);
    return {
      ...standardResults,
      aiEnhanced: false,
      error: standardResults.error || (error instanceof Error ? error.message : 'Unknown error')
    };
  }
}

/**
 * Checks if a string value appears to be a stringified class instance
 * Examples: "Person { name: 'John', age: 30 }" or "Car {make: 'Toyota', model: 'Corolla'}"
 */
export function isStringifiedClassInstance(value: string): { isClass: boolean; className?: string } {
  if (typeof value !== 'string') {
    return { isClass: false };
  }
  
  // Pattern to match: ClassName { ... }
  const classPattern = /^([A-Z][a-zA-Z0-9_]*)\s*\{(.*)\}$/;
  const match = value.match(classPattern);
  
  if (match && match[1]) {
    return { 
      isClass: true,
      className: match[1]
    };
  }
  
  return { isClass: false };
}

/**
 * Attempts to convert a stringified class instance back to an object with class metadata
 */
export function parseStringifiedClass(value: string): any {
  const classInfo = isStringifiedClassInstance(value);
  
  if (!classInfo.isClass) {
    return value;
  }
  
  try {
    // Extract the object part: "Person { name: 'John' }" -> { name: 'John' }
    const objectPart = value.substring(value.indexOf('{'), value.length);
    
    // Try to parse it as JSON
    let objectValue;
    try {
      // Replace single quotes with double quotes to make it valid JSON
      const jsonString = objectPart
        .replace(/'/g, '"')
        .replace(/(\w+):/g, '"$1":'); // Convert property names to quoted strings
      
      objectValue = JSON.parse(jsonString);
    } catch (e) {
      // If JSON parsing fails, create a simple object with the raw content
      objectValue = { _raw: value };
    }
    
    // Add class metadata
    objectValue.__isClass = true;
    objectValue.__constructorName = classInfo.className;
    
    return objectValue;
  } catch (e) {
    // If parsing fails, return the original string
    return value;
  }
} 