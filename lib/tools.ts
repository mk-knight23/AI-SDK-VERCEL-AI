/**
 * Tool definitions for AI agent capabilities
 * Defines available tools that the AI can use during conversations
 */

import { z } from 'zod';

// Weather tool parameters
export interface WeatherParams {
  location: string;
  unit?: 'celsius' | 'fahrenheit';
}

// Calculator tool parameters
export interface CalculatorParams {
  expression: string;
}

// Web search tool parameters
export interface WebSearchParams {
  query: string;
  limit?: number;
}

// Image generation tool parameters
export interface ImageGenerationParams {
  prompt: string;
  size?: '256x256' | '512x512' | '1024x1024';
  style?: 'vivid' | 'natural';
}

/**
 * Safe mathematical expression evaluator using tokenization and parsing
 */
function safeCalculate(expression: string): number {
  const tokens = expression.match(/(\d+\.?\d*|[+\-*/()])/g);
  if (!tokens) throw new Error('Invalid expression');

  const output: string[] = [];
  const operators: string[] = [];
  const precedence: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2 };

  for (const token of tokens) {
    if (!isNaN(parseFloat(token))) {
      output.push(token);
    } else if (token in precedence) {
      while (
        operators.length &&
        operators[operators.length - 1] !== '(' &&
        precedence[operators[operators.length - 1]] >= precedence[token]
      ) {
        output.push(operators.pop()!);
      }
      operators.push(token);
    } else if (token === '(') {
      operators.push(token);
    } else if (token === ')') {
      while (operators.length && operators[operators.length - 1] !== '(') {
        output.push(operators.pop()!);
      }
      operators.pop();
    }
  }

  while (operators.length) {
    output.push(operators.pop()!);
  }

  const stack: number[] = [];
  for (const token of output) {
    if (!isNaN(parseFloat(token))) {
      stack.push(parseFloat(token));
    } else {
      const b = stack.pop()!;
      const a = stack.pop()!;
      switch (token) {
        case '+': stack.push(a + b); break;
        case '-': stack.push(a - b); break;
        case '*': stack.push(a * b); break;
        case '/':
          if (b === 0) throw new Error('Division by zero');
          stack.push(a / b);
          break;
      }
    }
  }

  return stack[0];
}

export const weatherToolDefinition = {
  description: 'Get the current weather for a specific location',
  parameters: z.object({
    location: z.string().describe('The city or location name'),
    unit: z.enum(['celsius', 'fahrenheit']).default('celsius'),
  }),
};

export async function executeWeatherTool(params: WeatherParams): Promise<string> {
  const temperatures: Record<string, { temp: number; condition: string; humidity: number }> = {
    'san francisco': { temp: 18, condition: 'Partly Cloudy', humidity: 65 },
    'new york': { temp: 12, condition: 'Sunny', humidity: 45 },
    'london': { temp: 15, condition: 'Rainy', humidity: 80 },
    'tokyo': { temp: 22, condition: 'Clear', humidity: 55 },
    'paris': { temp: 16, condition: 'Cloudy', humidity: 70 },
  };

  const key = params.location.toLowerCase();
  const data = temperatures[key] || { temp: 20, condition: 'Partly Cloudy', humidity: 60 };
  const temp = params.unit === 'fahrenheit' ? (data.temp * 9) / 5 + 32 : data.temp;
  const unit = params.unit === 'fahrenheit' ? '°F' : '°C';

  return JSON.stringify({
    location: params.location,
    temperature: `${Math.round(temp)}${unit}`,
    condition: data.condition,
    humidity: `${data.humidity}%`,
  });
}

export const calculatorToolDefinition = {
  description: 'Evaluate mathematical expressions. Supports +, -, *, /, ()',
  parameters: z.object({
    expression: z.string().describe('Mathematical expression to evaluate'),
  }),
};

export async function executeCalculatorTool(params: CalculatorParams): Promise<string> {
  try {
    const result = safeCalculate(params.expression);

    if (typeof result !== 'number' || !isFinite(result)) {
      throw new Error('Invalid result');
    }

    return JSON.stringify({
      expression: params.expression,
      result: Math.round(result * 10000) / 10000,
    });
  } catch (error) {
    return JSON.stringify({
      expression: params.expression,
      error: 'Invalid mathematical expression',
    });
  }
}

export const webSearchToolDefinition = {
  description: 'Search the web for information on a given topic',
  parameters: z.object({
    query: z.string().describe('Search query'),
    limit: z.number().min(1).max(10).default(5),
  }),
};

export async function executeWebSearchTool(params: WebSearchParams): Promise<string> {
  const mockResults = [
    {
      title: 'Understanding the topic',
      url: 'https://example.com/article1',
      snippet: `Comprehensive information about ${params.query}...`,
    },
    {
      title: 'Latest developments',
      url: 'https://example.com/article2',
      snippet: `Recent news and updates regarding ${params.query}...`,
    },
    {
      title: 'In-depth analysis',
      url: 'https://example.com/article3',
      snippet: `Expert analysis on ${params.query}...`,
    },
  ];

  const results = mockResults.slice(0, params.limit || 5);

  return JSON.stringify({
    query: params.query,
    results,
  });
}

export const imageGenerationToolDefinition = {
  description: 'Generate images based on text descriptions',
  parameters: z.object({
    prompt: z.string().describe('Detailed description of the image to generate'),
    size: z.enum(['256x256', '512x512', '1024x1024']).default('512x512'),
    style: z.enum(['vivid', 'natural']).default('vivid'),
  }),
};

export async function executeImageGenerationTool(params: ImageGenerationParams): Promise<string> {
  const mockImageId = Math.random().toString(36).substring(7);
  const sizeParts = (params.size || '512x512').split('x');
  const mockUrl = `https://picsum.photos/seed/${mockImageId}/${sizeParts[0]}/${sizeParts[1]}`;

  return JSON.stringify({
    prompt: params.prompt,
    imageUrl: mockUrl,
    size: params.size || '512x512',
    style: params.style || 'vivid',
    id: mockImageId,
  });
}

export const tools = {
  weather: {
    ...weatherToolDefinition,
    execute: executeWeatherTool,
  },
  calculator: {
    ...calculatorToolDefinition,
    execute: executeCalculatorTool,
  },
  webSearch: {
    ...webSearchToolDefinition,
    execute: executeWebSearchTool,
  },
  imageGeneration: {
    ...imageGenerationToolDefinition,
    execute: executeImageGenerationTool,
  },
};

export function getToolNames(): string[] {
  return Object.keys(tools);
}

export function getToolsDescriptions(): Record<string, string> {
  return Object.entries(tools).reduce(
    (acc, [name, tool]) => ({
      ...acc,
      [name]: tool.description,
    }),
    {} as Record<string, string>
  );
}
