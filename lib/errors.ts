/**
 * Custom error classes for better error handling
 */

export class AISDKError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "AISDKError";
  }
}

export class ValidationError extends AISDKError {
  constructor(message: string, public field?: string) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
  }
}

export class ToolExecutionError extends AISDKError {
  constructor(
    message: string,
    public toolName: string,
    public originalError?: Error
  ) {
    super(message, "TOOL_EXECUTION_ERROR", 500);
    this.name = "ToolExecutionError";
  }
}

export class ModelError extends AISDKError {
  constructor(
    message: string,
    public model: string,
    public originalError?: Error
  ) {
    super(message, "MODEL_ERROR", 500);
    this.name = "ModelError";
  }
}

export class RateLimitError extends AISDKError {
  constructor(message: string = "Rate limit exceeded") {
    super(message, "RATE_LIMIT_ERROR", 429);
    this.name = "RateLimitError";
  }
}

/**
 * Error response formatter for API responses
 */
export function formatErrorResponse(error: unknown): {
  error: string;
  code?: string;
  message?: string;
  details?: unknown;
} {
  if (error instanceof AISDKError) {
    return {
      error: error.name,
      code: error.code,
      message: error.message,
      details: error instanceof ToolExecutionError ? { tool: error.toolName } : undefined,
    };
  }

  if (error instanceof Error) {
    return {
      error: "InternalError",
      message: error.message,
    };
  }

  return {
    error: "UnknownError",
    message: "An unknown error occurred",
  };
}

/**
 * Safe async wrapper that catches and formats errors
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: string
): Promise<{ data?: T; error?: ReturnType<typeof formatErrorResponse> }> {
  try {
    const data = await operation();
    return { data };
  } catch (error) {
    console.error(`Error in ${context}:`, error);
    return { error: formatErrorResponse(error) };
  }
}

/**
 * Validation helpers
 */
export function validateRequired<T>(
  value: T | undefined | null,
  fieldName: string
): T {
  if (value === undefined || value === null) {
    throw new ValidationError(`${fieldName} is required`, fieldName);
  }
  return value;
}

export function validateString(value: unknown, fieldName: string): string {
  if (typeof value !== "string") {
    throw new ValidationError(`${fieldName} must be a string`, fieldName);
  }
  if (value.trim().length === 0) {
    throw new ValidationError(`${fieldName} cannot be empty`, fieldName);
  }
  return value;
}

export function validateEnum<T extends string>(
  value: unknown,
  fieldName: string,
  allowedValues: readonly T[]
): T {
  if (typeof value !== "string") {
    throw new ValidationError(`${fieldName} must be a string`, fieldName);
  }
  if (!allowedValues.includes(value as T)) {
    throw new ValidationError(
      `${fieldName} must be one of: ${allowedValues.join(", ")}`,
      fieldName
    );
  }
  return value as T;
}

export function validateNumber(
  value: unknown,
  fieldName: string,
  options?: { min?: number; max?: number }
): number {
  if (typeof value !== "number" || isNaN(value)) {
    throw new ValidationError(`${fieldName} must be a number`, fieldName);
  }
  if (options?.min !== undefined && value < options.min) {
    throw new ValidationError(
      `${fieldName} must be at least ${options.min}`,
      fieldName
    );
  }
  if (options?.max !== undefined && value > options.max) {
    throw new ValidationError(
      `${fieldName} must be at most ${options.max}`,
      fieldName
    );
  }
  return value;
}
