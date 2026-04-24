import { CobisException } from './CobisException';

/**
 * Exception thrown when authentication fails
 */
export class CobisAuthenticationError extends CobisException {
  constructor(message: string = 'Authentication failed', detail?: unknown) {
    super(message, 401, 'Unauthorized', detail);
    this.name = 'CobisAuthenticationError';

    Object.setPrototypeOf(this, CobisAuthenticationError.prototype);
  }
}
