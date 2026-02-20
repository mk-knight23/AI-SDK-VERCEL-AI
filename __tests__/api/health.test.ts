import { GET } from '../../app/api/health/route';

describe('Health API Endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/health', () => {
    it('should return healthy status with correct structure', async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('healthy');
      expect(data.service).toBe('insight-stream');
      expect(data.timestamp).toBeDefined();
      expect(data.version).toBeDefined();
    });

    it('should return correct content-type header', async () => {
      const response = await GET();

      expect(response.headers.get('content-type')).toContain('application/json');
    });

    it('should return cache control headers', async () => {
      const response = await GET();

      expect(response.headers.get('cache-control')).toBe('no-store, no-cache, must-revalidate');
    });

    it('should return valid ISO timestamp', async () => {
      const response = await GET();
      const data = await response.json();

      // Verify timestamp is a valid ISO string
      const timestamp = new Date(data.timestamp);
      expect(timestamp.toISOString()).toBe(data.timestamp);

      // Verify timestamp is recent (within last minute)
      const now = new Date();
      const diffInSeconds = (now.getTime() - timestamp.getTime()) / 1000;
      expect(diffInSeconds).toBeLessThan(60);
    });

    it('should return version from package or fallback', async () => {
      const response = await GET();
      const data = await response.json();

      expect(typeof data.version).toBe('string');
      expect(data.version.length).toBeGreaterThan(0);
    });

    it('should handle multiple requests consistently', async () => {
      const responses = await Promise.all([
        GET(),
        GET(),
        GET(),
      ]);

      for (const response of responses) {
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.status).toBe('healthy');
      }
    });
  });
});
