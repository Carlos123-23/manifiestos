/**
 * Base exception for all Cobis-related errors
 * Provides standardized error handling across the application
 */
export class CobisException extends Error {
  public readonly statusCode: number;
  public readonly error: string;
  public readonly detail?: unknown;

  constructor(
    message: string,
    statusCode: number = 500,
    error: string = 'Internal Server Error',
    detail?: unknown
  ) {
    super(message);
    this.name = 'CobisException';
    this.statusCode = statusCode;
    this.error = error;
    this.detail = detail;

    // Maintain proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, CobisException.prototype);
  }
}
