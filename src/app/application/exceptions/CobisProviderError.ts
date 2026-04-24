import { CobisException } from './CobisException';

/**
 * Exception thrown when external provider service fails
 */
export class CobisProviderError extends CobisException {
  public readonly externalError?: unknown;

  constructor(
    message: string = 'External provider error',
    statusCode: number = 502,
    externalError?: unknown
  ) {
    const error = statusCode >= 500 ? 'Bad Gateway' : 'External Service Error';
    super(message, statusCode, error);
    this.name = 'CobisProviderError';
    this.externalError = externalError;

    Object.setPrototypeOf(this, CobisProviderError.prototype);
  }
}
