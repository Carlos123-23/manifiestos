import { CobisException } from './CobisException';
import { CobisAuthenticationError } from './CobisAuthenticationError';
import { CobisForbiddenError } from './CobisForbiddenError';
import { CobisProviderError } from './CobisProviderError';

/**
 * Maps different error types to appropriate Cobis exceptions
 */
export class CobisErrorMapper {
  /**
   * Maps an error to a CobisException
   * @param error - The error to map
   * @param context - Additional context about where the error occurred
   * @returns A CobisException instance
   */
  static mapError(error: unknown, context?: string): CobisException {
    // If already a CobisException, return as is
    if (error instanceof CobisException) {
      return error;
    }

    const errorMessage = error instanceof Error ? error.message : String(error);

    // Map authentication errors
    if (
      errorMessage.toLowerCase().includes('authentication') ||
      errorMessage.toLowerCase().includes('unauthorized') ||
      errorMessage.toLowerCase().includes('invalid credentials')
    ) {
      return new CobisAuthenticationError(errorMessage, error);
    }

    // Map forbidden errors
    if (
      errorMessage.toLowerCase().includes('forbidden') ||
      errorMessage.toLowerCase().includes('permission denied') ||
      errorMessage.toLowerCase().includes('access denied')
    ) {
      return new CobisForbiddenError(errorMessage, error);
    }

    // Map provider errors
    if (
      errorMessage.toLowerCase().includes('provider') ||
      errorMessage.toLowerCase().includes('external') ||
      errorMessage.toLowerCase().includes('service unavailable')
    ) {
      return new CobisProviderError(errorMessage, 502, error);
    }

    // Default to base CobisException
    return new CobisException(
      errorMessage || 'An unexpected error occurred',
      500,
      'Internal Server Error',
      error
    );
  }

  /**
   * Converts a CobisException to an error response object
   * @param exception - The exception to convert
   * @returns An error response object
   */
  static toErrorResponse(exception: CobisException): {
    statusCode: number;
    error: string;
    message: string;
    detail?: unknown;
  } {
    return {
      statusCode: exception.statusCode,
      error: exception.error,
      message: exception.message,
      ...(exception.detail && { detail: exception.detail })
    };
  }
}
