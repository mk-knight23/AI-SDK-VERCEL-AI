import { POST, GET } from '../../app/api/generate-image/route';

// Mock the tools library
jest.mock('../../lib/tools', () => ({
  executeImageGenerationTool: jest.fn(),
}));

describe('Image Generation API Endpoint', () => {
  const { executeImageGenerationTool } = require('../../lib/tools');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/generate-image', () => {
    it('should generate image with valid prompt', async () => {
      const mockImageData = {
        prompt: 'A sunset over mountains',
        imageUrl: 'https://picsum.photos/seed/test123/512/512',
        size: '512x512',
        style: 'vivid',
        id: 'test123',
      };

      executeImageGenerationTool.mockResolvedValue(JSON.stringify(mockImageData));

      const request = new Request('http://localhost:3000/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'A sunset over mountains' }),
      });

      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.prompt).toBe('A sunset over mountains');
      expect(data.imageUrl).toBeDefined();
      expect(executeImageGenerationTool).toHaveBeenCalledWith({
        prompt: 'A sunset over mountains',
        size: '512x512',
        style: 'vivid',
      });
    });

    it('should support custom size', async () => {
      const mockImageData = {
        prompt: 'A cat',
        imageUrl: 'https://picsum.photos/seed/test456/1024/1024',
        size: '1024x1024',
        style: 'vivid',
        id: 'test456',
      };

      executeImageGenerationTool.mockResolvedValue(JSON.stringify(mockImageData));

      const request = new Request('http://localhost:3000/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'A cat',
          size: '1024x1024',
        }),
      });

      const response = await POST(request as any);
      const data = await response.json();

      expect(data.size).toBe('1024x1024');
    });

    it('should support natural style', async () => {
      const mockImageData = {
        prompt: 'A landscape',
        imageUrl: 'https://picsum.photos/seed/test789/512/512',
        size: '512x512',
        style: 'natural',
        id: 'test789',
      };

      executeImageGenerationTool.mockResolvedValue(JSON.stringify(mockImageData));

      const request = new Request('http://localhost:3000/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'A landscape',
          style: 'natural',
        }),
      });

      const response = await POST(request as any);
      const data = await response.json();

      expect(data.style).toBe('natural');
    });

    it('should return 400 for missing prompt', async () => {
      const request = new Request('http://localhost:3000/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('should return 400 for empty prompt', async () => {
      const request = new Request('http://localhost:3000/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: '   ' }),
      });

      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid size', async () => {
      const request = new Request('http://localhost:3000/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Test',
          size: '999x999',
        }),
      });

      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid size');
    });

    it('should return 400 for invalid style', async () => {
      const request = new Request('http://localhost:3000/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Test',
          style: 'abstract',
        }),
      });

      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid style');
    });

    it('should handle tool execution errors', async () => {
      executeImageGenerationTool.mockRejectedValue(
        new Error('Failed to generate image')
      );

      const request = new Request('http://localhost:3000/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Test' }),
      });

      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
    });
  });

  describe('GET /api/generate-image', () => {
    it('should return API documentation', async () => {
      const request = new Request('http://localhost:3000/api/generate-image');
      const response = await GET(request as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.endpoint).toBe('/api/generate-image');
      expect(data.method).toBe('POST');
      expect(data.body).toBeDefined();
    });
  });
});
