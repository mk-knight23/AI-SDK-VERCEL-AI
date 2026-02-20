import { POST } from '../../app/api/chat/route';

// Mock the AI SDK modules
jest.mock('@ai-sdk/openai', () => ({
  openai: jest.fn((model: string) => ({ model })),
}));

jest.mock('ai', () => ({
  streamText: jest.fn(),
}));

describe('Chat API Endpoint', () => {
  const { streamText } = require('ai');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/chat', () => {
    it('should handle valid chat request with messages', async () => {
      const mockStreamResponse = {
        toDataStreamResponse: jest.fn().mockReturnValue(
          new Response('stream-data', {
            headers: { 'content-type': 'text/plain' },
          })
        ),
      };
      streamText.mockReturnValue(mockStreamResponse);

      const messages = [
        { role: 'user', content: 'Hello, how are you?' },
      ];

      const request = new Request('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });

      const response = await POST(request);

      expect(streamText).toHaveBeenCalledWith({
        model: expect.any(Object),
        messages,
      });
      expect(response).toBeDefined();
    });

    it('should handle conversation with multiple messages', async () => {
      const mockStreamResponse = {
        toDataStreamResponse: jest.fn().mockReturnValue(
          new Response('stream-data', {
            status: 200,
            headers: { 'content-type': 'text/plain' },
          })
        ),
      };
      streamText.mockReturnValue(mockStreamResponse);

      const messages = [
        { role: 'user', content: 'What is TypeScript?' },
        { role: 'assistant', content: 'TypeScript is a typed superset of JavaScript.' },
        { role: 'user', content: 'Can you show me an example?' },
      ];

      const request = new Request('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });

      const response = await POST(request);

      expect(streamText).toHaveBeenCalledWith({
        model: expect.any(Object),
        messages,
      });
      expect(response.status).toBe(200);
    });

    it('should handle empty messages array', async () => {
      const mockStreamResponse = {
        toDataStreamResponse: jest.fn().mockReturnValue(
          new Response('stream-data', { status: 200 })
        ),
      };
      streamText.mockReturnValue(mockStreamResponse);

      const request = new Request('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [] }),
      });

      const response = await POST(request);

      expect(streamText).toHaveBeenCalledWith({
        model: expect.any(Object),
        messages: [],
      });
      expect(response).toBeDefined();
    });

    it('should use gpt-4o-mini model', async () => {
      const { openai } = require('@ai-sdk/openai');
      const mockStreamResponse = {
        toDataStreamResponse: jest.fn().mockReturnValue(
          new Response('stream-data')
        ),
      };
      streamText.mockReturnValue(mockStreamResponse);

      const request = new Request('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: 'Hi' }] }),
      });

      await POST(request);

      expect(openai).toHaveBeenCalledWith('gpt-4o-mini');
    });

    it('should return streaming response', async () => {
      const mockStreamData = 'data: {"content": "Hello"}\n\n';
      const mockStreamResponse = {
        toDataStreamResponse: jest.fn().mockReturnValue(
          new Response(mockStreamData, {
            status: 200,
            headers: {
              'content-type': 'text/event-stream',
              'cache-control': 'no-cache',
            },
          })
        ),
      };
      streamText.mockReturnValue(mockStreamResponse);

      const request = new Request('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: 'Hi' }] }),
      });

      const response = await POST(request);

      expect(mockStreamResponse.toDataStreamResponse).toHaveBeenCalled();
      expect(response).toBeDefined();
    });

    it('should handle system messages', async () => {
      const mockStreamResponse = {
        toDataStreamResponse: jest.fn().mockReturnValue(
          new Response('stream-data')
        ),
      };
      streamText.mockReturnValue(mockStreamResponse);

      const messages = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello' },
      ];

      const request = new Request('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });

      await POST(request);

      expect(streamText).toHaveBeenCalledWith({
        model: expect.any(Object),
        messages,
      });
    });

    it('should handle long messages', async () => {
      const mockStreamResponse = {
        toDataStreamResponse: jest.fn().mockReturnValue(
          new Response('stream-data')
        ),
      };
      streamText.mockReturnValue(mockStreamResponse);

      const longContent = 'A'.repeat(10000);
      const messages = [{ role: 'user', content: longContent }];

      const request = new Request('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });

      const response = await POST(request);

      expect(response).toBeDefined();
      expect(streamText).toHaveBeenCalledWith({
        model: expect.any(Object),
        messages,
      });
    });

    it('should handle special characters in messages', async () => {
      const mockStreamResponse = {
        toDataStreamResponse: jest.fn().mockReturnValue(
          new Response('stream-data')
        ),
      };
      streamText.mockReturnValue(mockStreamResponse);

      const messages = [
        { role: 'user', content: 'Hello! @#$%^&*()_+ <>[]{}|\n\t' },
      ];

      const request = new Request('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });

      const response = await POST(request);

      expect(response).toBeDefined();
    });
  });
});
