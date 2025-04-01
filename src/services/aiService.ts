interface AIResponse {
  runtimeValues: Record<string, any>;
  explanation?: string;
}

interface AIScopeAnalysisResponse {
  scopes: {
    type: 'global' | 'function' | 'class' | 'block';
    name?: string;
    variables: Array<{
      name: string;
      value?: any;
    }>;
  }[];
}

interface ComprehensiveCodeAnalysis {
  scopes: {
    type: 'global' | 'function' | 'class' | 'block';
    name?: string;
    variables: Array<{
      name: string;
      value: any;
      description?: string;
    }>;
  }[];
  runtimeValues: Record<string, any>;
  executionFlow?: string[];
  errors?: string[];
}

const API_KEY = process.env.OPENAI_API_KEY || 'your-api-key-here';

/**
 * Performs comprehensive analysis of the code, determining both scopes and runtime values
 * @param code The code to analyze
 * @returns A comprehensive analysis including scopes and runtime values
 */
export async function analyzeCodeComprehensively(code: string): Promise<ComprehensiveCodeAnalysis> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an expert JavaScript analyzer and educator. Your task is to help a programmer understand code by:

1. Identifying the most important variables and functions in each scope (global, function, class, block)
2. Providing ONLY the runtime values that are important for understanding the code's behavior
3. Including brief, focused descriptions ONLY when they add meaningful context
4. Tracing the execution flow with an emphasis on key operations and transformations

Focus on being concise and insightful - quality over quantity. Omit obvious or redundant information.

Return a JSON object with the following structure:

{
  "scopes": [
    {
      "type": "global"|"function"|"class"|"block",
      "name": "optional name for named functions/classes",
      "variables": [
        { 
          "name": "variableName",
          "value": "computed value", 
          "description": "OPTIONAL: only include if it provides meaningful insight about the variable's purpose or behavior"
        }
      ]
    }
  ],
  "runtimeValues": {
    "variableName1": "value1",
    "variableName2": "value2"
  },
  "executionFlow": [
    "Brief, focused description of key execution steps",
    "Focus on transformations and important control flow changes"
  ],
  "errors": [
    "Optional error messages if code has issues"
  ]
}

Be precise, educational, and focus only on what matters for understanding the code.`
          },
          {
            role: 'user',
            content: `Analyze this JavaScript code with a focus on what matters for understanding it: \n\n${code}`
          }
        ],
        temperature: 0.1
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `API error: ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    try {
      // Parse the AI response to extract the JSON
      const contentText = data.choices[0].message.content.trim();
      // Look for JSON object in the response (handling potential markdown code blocks)
      const jsonMatch = contentText.match(/```(?:json)?\s*({[\s\S]*?})\s*```/) || 
                       contentText.match(/({[\s\S]*})/);
                       
      const jsonString = jsonMatch ? jsonMatch[1] : contentText;
      const analysis = JSON.parse(jsonString);
      
      return analysis as ComprehensiveCodeAnalysis;
    } catch (error) {
      console.error('Failed to parse AI code analysis response:', error);
      return {
        scopes: [{
          type: 'global',
          variables: [{ name: 'Error parsing AI response', value: 'error' }]
        }],
        runtimeValues: { error: 'Failed to parse AI response' }
      };
    }
  } catch (error) {
    console.error('Error analyzing code with AI:', error);
    return {
      scopes: [{
        type: 'global',
        variables: [{ 
          name: `Error`, 
          value: error instanceof Error ? error.message : 'Unknown error'
        }]
      }],
      runtimeValues: { error: error instanceof Error ? error.message : 'Unknown error' }
    };
  }
}

/**
 * Sends code to an AI agent for analysis
 * @param code The code to analyze
 * @returns Runtime values determined by the AI
 */
export async function analyzeCodeWithAI(code: string): Promise<AIResponse> {
  try {
    // Example using OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an expert JavaScript runtime analyzer. Analyze the provided code and determine the runtime values of all variables and expressions. Return ONLY a valid JSON object with the variable names as keys and their runtime values.`
          },
          {
            role: 'user',
            content: `Analyze this JavaScript code and return the runtime values: \n\n${code}`
          }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `API error: ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    let runtimeValues = {};
    
    try {
      // Try to parse the response content to extract the JSON
      const contentText = data.choices[0].message.content.trim();
      // Look for JSON object in the response (handling potential markdown code blocks)
      const jsonMatch = contentText.match(/```(?:json)?\s*({[\s\S]*?})\s*```/) || 
                       contentText.match(/({[\s\S]*})/);
                       
      const jsonString = jsonMatch ? jsonMatch[1] : contentText;
      runtimeValues = JSON.parse(jsonString);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      runtimeValues = { 
        error: 'Failed to parse AI response',
        rawResponse: data.choices[0].message.content
      };
    }

    return {
      runtimeValues,
      explanation: data.choices[0].message.content
    };
  } catch (error) {
    console.error('Error analyzing code with AI:', error);
    return {
      runtimeValues: { error: error instanceof Error ? error.message : 'Unknown error' }
    };
  }
}

/**
 * Sends code to an AI agent to analyze scopes and variables
 * @param code The code to analyze
 * @returns Scopes and their variables
 */
export async function analyzeScopesWithAI(code: string): Promise<AIScopeAnalysisResponse> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an expert JavaScript analyzer specialized in identifying variable scopes and scope hierarchy.
            
Analyze the provided code and identify all variables and their scopes (global, function, class, block).
You must return a valid JSON object with the following structure:

{
  "scopes": [
    {
      "type": "global"|"function"|"class"|"block",
      "name": "optional name for named functions/classes",
      "variables": [
        { "name": "variableName1" },
        { "name": "variableName2" }
      ]
    }
  ]
}

Be precise and thorough in your analysis.`
          },
          {
            role: 'user',
            content: `Analyze this JavaScript code and return the scope structure: \n\n${code}`
          }
        ],
        temperature: 0.1
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `API error: ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    try {
      // Parse the AI response to extract the JSON
      const contentText = data.choices[0].message.content.trim();
      // Look for JSON object in the response (handling potential markdown code blocks)
      const jsonMatch = contentText.match(/```(?:json)?\s*({[\s\S]*?})\s*```/) || 
                       contentText.match(/({[\s\S]*})/);
                       
      const jsonString = jsonMatch ? jsonMatch[1] : contentText;
      const scopeAnalysis = JSON.parse(jsonString);
      
      return scopeAnalysis as AIScopeAnalysisResponse;
    } catch (error) {
      console.error('Failed to parse AI scope analysis response:', error);
      return {
        scopes: [{
          type: 'global',
          variables: [{ name: 'Error parsing AI response' }]
        }]
      };
    }
  } catch (error) {
    console.error('Error analyzing scopes with AI:', error);
    return {
      scopes: [{
        type: 'global',
        variables: [{ name: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      }]
    };
  }
} 