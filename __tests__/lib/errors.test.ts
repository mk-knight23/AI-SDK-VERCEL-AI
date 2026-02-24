import {
  AISDKError,
  ValidationError,
  ToolExecutionError,
  ModelError,
  RateLimitError,
  formatErrorResponse,
  validateRequired,
  validateString,
  validateEnum,
  validateNumber,
} from '../../lib/errors';

describe('Error Classes', () => {
  describe('AISDKError', () => {
    it('should create error with code and status', () => {
      const error = new AISDKError('Test error', 'TEST_ERROR', 400);

      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.statusCode).toBe(400);
      expect(error.name).toBe('AISDKError');
    });
  });

  describe('ValidationError', () => {
    it('should create validation error', () => {
      const error = new ValidationError('Field is required', 'field_name');

      expect(error.message).toBe('Field is required');
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.statusCode).toBe(400);
      expect(error.field).toBe('field_name');
      expect(error.name).toBe('ValidationError');
    });
  });

  describe('ToolExecutionError', () => {
    it('should create tool execution error', () => {
      const originalError = new Error('Original error');
      const error = new ToolExecutionError(
        'Tool failed',
        'calculator',
        originalError
      );

      expect(error.message).toBe('Tool failed');
      expect(error.code).toBe('TOOL_EXECUTION_ERROR');
      expect(error.toolName).toBe('calculator');
      expect(error.originalError).toBe(originalError);
    });
  });

  describe('ModelError', () => {
    it('should create model error', () => {
      const originalError = new Error('API error');
      const error = new ModelError('Model failed', 'gpt-4o-mini', originalError);

      expect(error.message).toBe('Model failed');
      expect(error.code).toBe('MODEL_ERROR');
      expect(error.model).toBe('gpt-4o-mini');
      expect(error.originalError).toBe(originalError);
    });
  });

  describe('RateLimitError', () => {
    it('should create rate limit error with default message', () => {
      const error = new RateLimitError();

      expect(error.message).toBe('Rate limit exceeded');
      expect(error.code).toBe('RATE_LIMIT_ERROR');
      expect(error.statusCode).toBe(429);
    });

    it('should create rate limit error with custom message', () => {
      const error = new RateLimitError('Too many requests');

      expect(error.message).toBe('Too many requests');
    });
  });
});

describe('Error Response Formatting', () => {
  it('should format AISDKError correctly', () => {
    const error = new ValidationError('Invalid input', 'email');
    const response = formatErrorResponse(error);

    expect(response.error).toBe('ValidationError');
    expect(response.code).toBe('VALIDATION_ERROR');
    expect(response.message).toBe('Invalid input');
  });

  it('should format ToolExecutionError with details', () => {
    const error = new ToolExecutionError('Tool failed', 'weather');
    const response = formatErrorResponse(error);

    expect(response.error).toBe('ToolExecutionError');
    expect(response.details).toEqual({ tool: 'weather' });
  });

  it('should format generic Error correctly', () => {
    const error = new Error('Something went wrong');
    const response = formatErrorResponse(error);

    expect(response.error).toBe('InternalError');
    expect(response.message).toBe('Something went wrong');
  });

  it('should handle unknown errors', () => {
    const response = formatErrorResponse('string error');

    expect(response.error).toBe('UnknownError');
    expect(response.message).toBe('An unknown error occurred');
  });
});

describe('Validation Helpers', () => {
  describe('validateRequired', () => {
    it('should return value when present', () => {
      expect(validateRequired('test', 'field')).toBe('test');
      expect(validateRequired(0, 'field')).toBe(0);
      expect(validateRequired(false, 'field')).toBe(false);
    });

    it('should throw ValidationError for undefined', () => {
      expect(() => validateRequired(undefined, 'field')).toThrow(
        ValidationError
      );
    });

    it('should throw ValidationError for null', () => {
      expect(() => validateRequired(null, 'field')).toThrow(ValidationError);
    });
  });

  describe('validateString', () => {
    it('should return valid string', () => {
      expect(validateString('test', 'field')).toBe('test');
      expect(validateString('  test  ', 'field')).toBe('  test  ');
    });

    it('should throw ValidationError for non-string', () => {
      expect(() => validateString(123, 'field')).toThrow(ValidationError);
      expect(() => validateString(null, 'field')).toThrow(ValidationError);
    });

    it('should throw ValidationError for empty string', () => {
      expect(() => validateString('', 'field')).toThrow(ValidationError);
      expect(() => validateString('   ', 'field')).toThrow(ValidationError);
    });
  });

  describe('validateEnum', () => {
    const allowedValues = ['small', 'medium', 'large'] as const;

    it('should return valid enum value', () => {
      expect(validateEnum('small', 'size', allowedValues)).toBe('small');
      expect(validateEnum('large', 'size', allowedValues)).toBe('large');
    });

    it('should throw ValidationError for non-string', () => {
      expect(() => validateEnum(123, 'size', allowedValues)).toThrow(
        ValidationError
      );
    });

    it('should throw ValidationError for invalid value', () => {
      expect(() => validateEnum('extra-large', 'size', allowedValues)).toThrow(
        ValidationError
      );
    });
  });

  describe('validateNumber', () => {
    it('should return valid number', () => {
      expect(validateNumber(42, 'count')).toBe(42);
      expect(validateNumber(3.14, 'pi')).toBe(3.14);
    });

    it('should throw ValidationError for non-number', () => {
      expect(() => validateNumber('42', 'count')).toThrow(ValidationError);
      expect(() => validateNumber(NaN, 'count')).toThrow(ValidationError);
    });

    it('should enforce minimum value', () => {
      expect(() => validateNumber(-1, 'count', { min: 0 })).toThrow(
        ValidationError
      );
      expect(validateNumber(0, 'count', { min: 0 })).toBe(0);
      expect(validateNumber(1, 'count', { min: 0 })).toBe(1);
    });

    it('should enforce maximum value', () => {
      expect(() => validateNumber(101, 'percent', { max: 100 })).toThrow(
        ValidationError
      );
      expect(validateNumber(100, 'percent', { max: 100 })).toBe(100);
      expect(validateNumber(99, 'percent', { max: 100 })).toBe(99);
    });

    it('should enforce range', () => {
      expect(() => validateNumber(-1, 'value', { min: 0, max: 10 })).toThrow(
        ValidationError
      );
      expect(() => validateNumber(11, 'value', { min: 0, max: 10 })).toThrow(
        ValidationError
      );
      expect(validateNumber(5, 'value', { min: 0, max: 10 })).toBe(5);
    });
  });
});
