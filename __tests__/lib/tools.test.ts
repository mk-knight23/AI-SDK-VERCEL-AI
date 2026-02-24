import {
  executeWeatherTool,
  executeCalculatorTool,
  executeWebSearchTool,
  executeImageGenerationTool,
  getToolNames,
  getToolsDescriptions,
} from '../../lib/tools';

describe('Tools Library', () => {
  describe('Weather Tool', () => {
    it('should return weather data for San Francisco', async () => {
      const result = await executeWeatherTool({ location: 'San Francisco' });
      const data = JSON.parse(result);

      expect(data.location).toBe('San Francisco');
      expect(data.temperature).toBeDefined();
      expect(data.condition).toBeDefined();
      expect(data.humidity).toBeDefined();
    });

    it('should return weather data for London in celsius', async () => {
      const result = await executeWeatherTool({ location: 'London', unit: 'celsius' });
      const data = JSON.parse(result);

      expect(data.location).toBe('London');
      expect(data.temperature).toContain('°C');
    });

    it('should return weather data for New York in fahrenheit', async () => {
      const result = await executeWeatherTool({ location: 'New York', unit: 'fahrenheit' });
      const data = JSON.parse(result);

      expect(data.location).toBe('New York');
      expect(data.temperature).toContain('°F');
    });

    it('should handle unknown locations with default data', async () => {
      const result = await executeWeatherTool({ location: 'Unknown City' });
      const data = JSON.parse(result);

      expect(data.location).toBe('Unknown City');
      expect(data.temperature).toBeDefined();
    });
  });

  describe('Calculator Tool', () => {
    it('should evaluate simple addition', async () => {
      const result = await executeCalculatorTool({ expression: '2 + 2' });
      const data = JSON.parse(result);

      expect(data.expression).toBe('2 + 2');
      expect(data.result).toBe(4);
    });

    it('should evaluate complex expression', async () => {
      const result = await executeCalculatorTool({ expression: '10 * (5 + 3)' });
      const data = JSON.parse(result);

      expect(data.result).toBe(80);
    });

    it('should handle division', async () => {
      const result = await executeCalculatorTool({ expression: '100 / 4' });
      const data = JSON.parse(result);

      expect(data.result).toBe(25);
    });

    it('should handle subtraction', async () => {
      const result = await executeCalculatorTool({ expression: '50 - 15' });
      const data = JSON.parse(result);

      expect(data.result).toBe(35);
    });

    it('should handle nested parentheses', async () => {
      const result = await executeCalculatorTool({ expression: '(2 + 3) * (4 + 5)' });
      const data = JSON.parse(result);

      expect(data.result).toBe(45);
    });

    it('should handle decimal numbers', async () => {
      const result = await executeCalculatorTool({ expression: '3.5 * 2' });
      const data = JSON.parse(result);

      expect(data.result).toBe(7);
    });

    it('should return error for invalid expression', async () => {
      const result = await executeCalculatorTool({ expression: 'invalid' });
      const data = JSON.parse(result);

      expect(data.error).toBeDefined();
    });

    it('should handle division by zero gracefully', async () => {
      const result = await executeCalculatorTool({ expression: '10 / 0' });
      const data = JSON.parse(result);

      expect(data.error).toBeDefined();
    });
  });

  describe('Web Search Tool', () => {
    it('should return search results', async () => {
      const result = await executeWebSearchTool({ query: 'TypeScript' });
      const data = JSON.parse(result);

      expect(data.query).toBe('TypeScript');
      expect(data.results).toBeDefined();
      expect(Array.isArray(data.results)).toBe(true);
      expect(data.results.length).toBeGreaterThan(0);
    });

    it('should limit results', async () => {
      const result = await executeWebSearchTool({ query: 'React', limit: 2 });
      const data = JSON.parse(result);

      expect(data.results.length).toBeLessThanOrEqual(2);
    });

    it('should include required fields in results', async () => {
      const result = await executeWebSearchTool({ query: 'Next.js' });
      const data = JSON.parse(result);

      data.results.forEach((item: any) => {
        expect(item.title).toBeDefined();
        expect(item.url).toBeDefined();
        expect(item.snippet).toBeDefined();
      });
    });

    it('should handle empty query', async () => {
      const result = await executeWebSearchTool({ query: '' });
      const data = JSON.parse(result);

      expect(data.results).toBeDefined();
    });
  });

  describe('Image Generation Tool', () => {
    it('should generate image data', async () => {
      const result = await executeImageGenerationTool({
        prompt: 'A sunset over mountains',
      });
      const data = JSON.parse(result);

      expect(data.prompt).toBe('A sunset over mountains');
      expect(data.imageUrl).toBeDefined();
      expect(data.size).toBe('512x512');
      expect(data.style).toBe('vivid');
      expect(data.id).toBeDefined();
    });

    it('should support different sizes', async () => {
      const result = await executeImageGenerationTool({
        prompt: 'A cat',
        size: '1024x1024',
      });
      const data = JSON.parse(result);

      expect(data.size).toBe('1024x1024');
      expect(data.imageUrl).toContain('1024');
    });

    it('should support natural style', async () => {
      const result = await executeImageGenerationTool({
        prompt: 'A landscape',
        style: 'natural',
      });
      const data = JSON.parse(result);

      expect(data.style).toBe('natural');
    });

    it('should generate unique image IDs', async () => {
      const result1 = await executeImageGenerationTool({ prompt: 'Test 1' });
      const result2 = await executeImageGenerationTool({ prompt: 'Test 2' });

      const data1 = JSON.parse(result1);
      const data2 = JSON.parse(result2);

      expect(data1.id).not.toBe(data2.id);
    });
  });

  describe('Tool Utilities', () => {
    it('should return all tool names', () => {
      const names = getToolNames();

      expect(names).toContain('weather');
      expect(names).toContain('calculator');
      expect(names).toContain('webSearch');
      expect(names).toContain('imageGeneration');
    });

    it('should return tools descriptions', () => {
      const descriptions = getToolsDescriptions();

      expect(descriptions.weather).toBeDefined();
      expect(descriptions.calculator).toBeDefined();
      expect(descriptions.webSearch).toBeDefined();
      expect(descriptions.imageGeneration).toBeDefined();
    });
  });

  describe('Tool Parameter Validation', () => {
    it('should accept valid weather parameters', async () => {
      const result = await executeWeatherTool({
        location: 'Tokyo',
        unit: 'celsius',
      });

      expect(JSON.parse(result)).toBeDefined();
    });

    it('should accept valid calculator parameters', async () => {
      const result = await executeCalculatorTool({
        expression: '2 + 2',
      });

      expect(JSON.parse(result)).toBeDefined();
    });

    it('should accept valid web search parameters', async () => {
      const result = await executeWebSearchTool({
        query: 'test',
        limit: 5,
      });

      expect(JSON.parse(result)).toBeDefined();
    });

    it('should accept valid image generation parameters', async () => {
      const result = await executeImageGenerationTool({
        prompt: 'A beautiful landscape',
        size: '512x512',
        style: 'vivid',
      });

      expect(JSON.parse(result)).toBeDefined();
    });
  });
});
